<template>
  <div class="cubing-mobile" tabindex="-1">


    <div class="cubing-header-mobile">
      <el-button type="primary" icon="ArrowLeft"
                 @click="activeEvent = events_all[events_all.indexOf(activeEvent) - 1]"
                 :disabled="events_all.indexOf(activeEvent)==0" round></el-button>
      <el-select v-model="activeEvent" placeholder="请选择项目" style="width: 100px">
        <el-option
            v-for="item in events_available"
            :key="item"
            :label="item"
            :value="item"
        >
          <span class="cubing-icon" :class="`event-${translateEventForScramble(item)}`"><span style="margin-left: 5px">{{item}}</span></span>
        </el-option>
      </el-select>
      <el-button type="primary" icon="ArrowRight"
                 @click="activeEvent = events_all[events_all.indexOf(activeEvent) + 1]"
                 :disabled="events_all.indexOf(activeEvent)==events_all.length-1" round></el-button>
    </div>

    <div class="scramble-container-mobile" v-if="events_available.indexOf(activeEvent) > -1">
      <p style="text-align: center; line-height: 25px; font-weight: 10">{{scrambleOfEvent[count - 1]}}</p>
    </div>

    <div class="scramble-submit" v-if="events_available.indexOf(activeEvent) > -1">
      <div class="result-floater">
        <el-popover placement="left-end" width="200" trigger="click" :offset="20">
          <template #reference>
            <div class="cubing-icon event-333"></div>
          </template>
          <template #default>
            <div class="results-overview">
              <p v-for="(result, name, i) in state.resultForm" :key="result">
                <span v-if="i+1<=maxScrambleCount">第{{i+1}}次：{{result}}</span>
              </p>
            </div>
          </template>
        </el-popover>
      </div>
    </div>

    <div class="finished" v-else>
      <div class="finished-header account-profile">
        <img :src="store.user.avatar" alt="" >
        <div class="blob-wrap">
          <div class="blob"></div>
          <div class="blob"></div>
          <div class="blob"></div>
        </div>
      </div>
      <div class="finished-content">
        <p>你已经完成了此项目</p>
        <div class="scramble-content">
          <div class="control">
            <el-button-group>
              <el-button type="primary" icon="ArrowLeft" @click="count--" :disabled="count===1"></el-button>
              <el-button type="primary" icon="ArrowRight" @click="count++" :disabled="count===maxScrambleCount"></el-button>
            </el-button-group>
          </div>
          <div class="scramble">
            <p>{{`第${count}次打乱`}}</p>
            <p>{{scrambleOfEvent[count - 1]}}</p>
          </div>
        </div>
      </div>
    </div>


    <timing-curtain
        @timing-over="set_time"
        :state="curtain_state"
        v-if="events_available.indexOf(activeEvent) > -1 && state.resultForm[`time_${count}`] === ''"
    />


  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, Ref, ref, watch} from "vue";
import {getComp, getCompCachedResult} from "@/api/fetchData";
import {localStore} from "@/store";
import type {apiUsedEventName, CachedResult} from "@/types";
import {
  convert_time_num2str,
  convert_time_str2num,
  SPECIAL_EVENTS,
  translateEventForScramble
} from "@/utils";
import type {FormInstance} from "element-plus";
import {ElMessage, ElNotification} from "element-plus";
import {postResult, postTempResult} from "@/api/service";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";
import TimingCurtain from "@/components/timingCurtain/timingCurtain.vue";

const curtain_state = ref(1)
const activeEvent: Ref<apiUsedEventName> = ref('333' as apiUsedEventName)
const store = localStore()
const set_time = async (time_) => {
    let time = time_.punishment === -1?0:time_.time

    if (time === 0) {
        state.resultForm[`time_${count.value}`] = 'DNF'
    }
    else {
        state.resultForm[`time_${count.value}`] = convert_time_num2str(convert_time_str2num(time.toFixed(3))).replace(/\s*/g,"")
    }

    // 将成绩缓存到服务器
    await postTempResult({
        wos: 'week',
        event: activeEvent.value,
        order: count.value,
        result: time,
    })

    // 自动进入下一个打乱
    if (count.value < maxScrambleCount.value) {
        count.value += 1
    }

}

const cachedResult = await getCompCachedResult('week')



// 下面是直接复制以前的代码，所以有些变量名可能不太合适，并且可能很混乱。但是这个组件的功能是可以正常使用的。
const count = ref(1)
const dialogVisible = ref(false)
const imgVisible = ref(false)
const is3d = ref(false)

// 异步获取当前比赛数据
const compData = await getComp('week')
// 请求更新用户进度
store.updateUserParticipationData()

// 获取用户进度
const userParticipationData = computed(() => store.userParticipation)
// 根据进度，计算相关的项目
const events_all = computed(() =>
    userParticipationData.value.week.events_all as apiUsedEventName[]
)
const events_finished = computed(() =>
    userParticipationData.value.week.events_finished
)
const events_available = computed(() => {
    const events_available: apiUsedEventName[] = []
    for (let event of events_all.value) {
        if (!(events_finished.value.indexOf(event) > -1)) {
            events_available.push(event)
        }
    }
    return events_available
})

// 打乱数
const maxScrambleCount = computed(() => {
    if (SPECIAL_EVENTS.indexOf(activeEvent.value) > -1) {
        return 3
    } else {
        return 5
    }
})
// 切换项目时清除表单
watch(() => activeEvent.value, () => {
    let cacheOfThisEvent: CachedResult = {
        event: activeEvent.value,
        time_1: -1, time_2: -1, time_3: -1, time_4: -1, time_5: -1
    }
    // 遍历寻找是否有对应的缓存，否则取以上的默认值
    for (const cache of cachedResult) {
        if (cache.event == activeEvent.value) cacheOfThisEvent = cache
    }
    // 计算现在应该到哪一把了
    for (let i = 1; i <= 5; i++) {
        if (cacheOfThisEvent[`time_${i}`] === -1) {
            count.value = i
            // 但是注意不能超出最大轮数，这会发生在用户已经完成但忘了提交后重新加载时
            if (count.value > maxScrambleCount.value) count.value = maxScrambleCount.value
            break
        }
    }
    // 把缓存成绩填进去
    for (let i = 1; i <= 5; i++) {
        if (cacheOfThisEvent[`time_${i}`] === -1) {
            state.resultForm[`time_${i}`] = ''
        }
        else {
            state.resultForm[`time_${i}`] = cacheOfThisEvent[`time_${i}`]==0?'DNF':convert_time_num2str(cacheOfThisEvent[`time_${i}`]).replace(/\s*/g,"")
        }
    }

})

// 是否是特殊项目
const is_special = computed(() => maxScrambleCount.value === 3)
const scrambleOfEvent = computed(() => {
    for (let scramble of compData.scramble_set) {
        if (scramble.event === activeEvent.value) {
            return [scramble.scramble_1, scramble.scramble_2, scramble.scramble_3, scramble.scramble_4, scramble.scramble_5]
        }
    }
    return []  // will never work
})




// form part
const formRef = ref<FormInstance>()
const compId = computed(() => compData.compId)

// eslint-disable-next-line @typescript-eslint/ban-types
const resultValidator = (rule: any, value: string, callback: Function) => {
    if (value == 'DNF' || value == 'dnf' || value == 'd') {
        callback()
    } else {
        const pattern = /^\s*\d+(\.\d+)?(:\d+(\.\d+)?)?\s*$/
        if (pattern.test(value)) {
            callback()
        }
        else {
            callback(new Error('成绩格式错误'))
        }
    }
}

const state = reactive({
    resultForm: {
        time_1: '',
        time_2: '',
        time_3: '',
        time_4: '',
        time_5: '',
    },
    resultRules: {
        time_1: [{
            required: true,
            trigger: "blur",
            validator: resultValidator
        }],
        time_2: [{
            required: true,
            trigger: "blur",
            validator: resultValidator
        }],
        time_3: [{
            required: true,
            trigger: "blur",
            validator: resultValidator
        }],
        time_4: [{
            required: !is_special.value,
            trigger: "blur",
            validator: resultValidator
        }],
        time_5: [{
            required: !is_special.value,
            trigger: "blur",
            validator: resultValidator
        }],
    }
})

// watch count, every time it increases, validate the form, if not valid, decrease count
watch([count], (value, oldValue) => {
    if (value > oldValue) {
        formRef.value?.validate((valid) => {
            if (!valid) {
                count.value--
                ElMessage({
                    message: '请检查成绩格式！',
                    type: 'error',
                    duration: 2000
                })
            }
        })
    }
})
// check if the form is valid before open the dialog
const openDialog = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            dialogVisible.value = true
        } else {
            ElMessage({
                message: '请检查成绩格式！',
                type: 'error',
                duration: 2000
            })
        }
    })
}

const handleSubmit =  (formEl: FormInstance | undefined) => {
    if (!formEl) return

    formEl.validate(async (valid) => {
        if (valid) {
            const req = {
                competition: compId.value,
                event: activeEvent.value,
                time_1: convert_time_str2num(state.resultForm.time_1),
                time_2: convert_time_str2num(state.resultForm.time_2),
                time_3: convert_time_str2num(state.resultForm.time_3),
                time_4: convert_time_str2num(state.resultForm.time_4),
                time_5: convert_time_str2num(state.resultForm.time_5),
            }
            try {
                const data = await postResult(req)
                ElNotification({
                    title: '成功',
                    message: '提交成功！',
                    type: 'success',
                })
                store.updateUserParticipationData()
                window.location.reload()
            }
            catch (e) {
                ElNotification({
                    title: '失败',
                    message: '提交成绩失败！',
                    type: 'error',
                })
            }
        }
    })
}

</script>

<style scoped>
.cubing-mobile {
    background-color: var(--yougi-projects-section);
    padding: 32px 32px 0 32px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: calc(100vh - 60px);
    transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

.cubing-header-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-radius: 30px;
    padding: 16px 24px;
    background-color: var(--profile-card-bg-color);
}

:deep(.el-input__wrapper) {
  background-color: transparent !important;
  height: 100% !important;
}

.cubing-header p {
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;
    opacity: 0.9;
}

.selector {
    display: flex;
    justify-content: space-between;
}

.selector span {
    margin-left: 10px;
    margin-right: 10px;
    width: 10px;
}

.el-card {
    border-radius: 30px !important;
}
:deep(.el-card__header) {
    color: #4A4A4A;
}

.result-floater {
    position: fixed;
    bottom: 80px;
    right: 20px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: var(--profile-card-bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.scramble-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #4A4A4A;
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 24px;
    opacity: 0.7;
}

.scramble-footer {
    display: flex;
    flex-direction: column;
}
.scramble-footer p:first-child {
    color: #4A4A4A;
    font-size: 16px;
    line-height: 24px;
    opacity: 0.7;
    margin-bottom: 8px;
    text-align: left;
}
.scramble-footer p:last-child {
    color: #4A4A4A;
    margin-top: 8px;
    font-size: 16px;
    line-height: 24px;
    opacity: 0.7;
    text-align: right;
}

:deep(.el-progress-bar__outer) {
    background-color: #FFFFFF !important;
}

.scramble-container {
    margin-bottom: 24px;
}

.finished-content p{
    color: var(--yougi-main-color);
    font-size: 16px;
    line-height: 24px;
    opacity: 0.7;
    margin-bottom: 8px;
    text-align: center;
}


/* for animatiion */
.account-profile {
    position: relative;
    text-align: center;
    width: 50%;
    margin: 48px auto 48px auto;
}
.account-profile img {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: left;
    object-position: left;
    padding: 5px;
}
.account-profile .blob {
    position: absolute;
    border-radius: 50%;
    -webkit-animation: fly 5.8s linear infinite alternate;
    animation: fly 5.8s linear infinite alternate;
}
.account-profile .blob:nth-child(1) {
    width: 14px;
    height: 14px;
    top: 25px;
    left: -20px;
    background: #28327a;
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
}
.account-profile .blob:nth-child(2) {
    width: 18px;
    height: 18px;
    background: #87344c;
    right: -20px;
    top: -20px;
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}
.account-profile .blob:nth-child(3) {
    width: 12px;
    height: 12px;
    background: #13645b;
    right: -35px;
    top: 50%;
    -webkit-animation-delay: 1.8s;
    animation-delay: 1.8s;
}
@-webkit-keyframes fly {
    40% {
        transform: translate(-6px, -6px);
    }
    60% {
        transform: translate(-12px, -2px);
    }
    100% {
        transform: translate(0px, 0px);
    }
}

@keyframes fly {
    40% {
        transform: translate(-6px, -6px);
    }
    60% {
        transform: translate(-12px, -2px);
    }
    100% {
        transform: translate(0px, 0px);
    }
}

:deep(.el-card__header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
