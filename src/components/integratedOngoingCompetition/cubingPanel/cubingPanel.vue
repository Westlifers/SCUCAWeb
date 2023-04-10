<template>
  <div class="cubing">


    <div class="cubing-header">
      <p>参加比赛</p>
      <div class="selector" v-if="events_available.indexOf(activeEvent) > -1">
        <el-button icon="ArrowLeft" size="small" round :disabled="count <= 1"
                   @click="count--" />
        <span>{{count}}</span>
        <el-button icon="ArrowRight" size="small" round :disabled="count >= maxScrambleCount"
                   @click="count++"/>
      </div>
    </div>


    <div class="scramble-container" v-if="events_available.indexOf(activeEvent) > -1">
      <el-card shadow="hover" :style="{backgroundColor: '#dbf6fd'}">

        <template #header>
          <span>{{props.activeEvent}}</span>
          <el-button-group>
            <el-switch v-model="imgVisible" active-text="显示结果" inactive-text="隐藏结果" inline-prompt style="padding-right: 5px" />
            <el-switch v-model="is3d" active-text="3D" inactive-text="2D" inline-prompt />
          </el-button-group>
        </template>

        <div class="scramble-content">
          {{scrambleOfEvent[count - 1]}}
          <!--     ignore the following warning, it's inevitable     -->
          <twisty-player
              v-if="imgVisible"
              :puzzle="translateEvent(activeEvent)"
              :alg="scrambleOfEvent[count - 1]"
              :visualization="is3d? '3D' : '2D'"
          />
        </div>

        <div class="scramble-footer">
          <p>Progress</p>
          <el-progress :percentage="count/maxScrambleCount*100" :show-text="false" :status="count===maxScrambleCount?'success':''" />
          <p>{{`${count} / ${maxScrambleCount}`}}</p>
        </div>

      </el-card>
    </div>

    <div class="scramble-submit" v-if="events_available.indexOf(activeEvent) > -1">
      <el-form
          ref="formRef"
          :model="state.resultForm"
          label-width="auto"
          size="default"
          :rules="state.resultRules"
      >
        <el-form-item label="第一次" prop="time_1" v-if="count===1">
          <el-input
              v-model="state.resultForm.time_1"
              class="w-50 m-2"
              placeholder="Type your result"
          />
        </el-form-item>

        <el-form-item label="第二次" prop="time_2" v-if="count===2">
          <el-input
              v-model="state.resultForm.time_2"
              class="w-50 m-2"
              placeholder="Type your result"
          />
        </el-form-item>

        <el-form-item label="第三次" prop="time_3" v-if="count===3">
          <el-input
              v-model="state.resultForm.time_3"
              class="w-50 m-2"
              placeholder="Type your result"
          />
        </el-form-item>

        <el-form-item label="第四次" prop="time_4" v-if="count===4">
          <el-input
              v-model="state.resultForm.time_4"
              class="w-50 m-2"
              placeholder="Type your result"
          />
        </el-form-item>

        <el-form-item label="第五次" prop="time_5" v-if="count===5">
          <el-input
              v-model="state.resultForm.time_5"
              class="w-50 m-2"
              placeholder="Type your result"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="openDialog" style="width: 100%" v-if="count===maxScrambleCount">提交</el-button>
          <el-dialog v-model="dialogVisible" width="30%" title="确认成绩" style="text-align: left">
            <p>本次成绩如下：</p>
            <p>第一次：{{state.resultForm.time_1}}</p>
            <p>第二次：{{state.resultForm.time_2}}</p>
            <p>第三次：{{state.resultForm.time_3}}</p>
            <p v-if="maxScrambleCount===5">第四次：{{state.resultForm.time_4}}</p>
            <p v-if="maxScrambleCount===5">第五次：{{state.resultForm.time_5}}</p>
            <p>请检查成绩输入是否正确。</p>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false;handleSubmit(formRef)">
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>
        </el-form-item>

        <div class="tip">
          <v-md-preview text="> 成绩格式为m:s.ms，成绩超过60s的，分钟后不要输入空格或中文冒号
          正确示范：DNF, 1:23.45, 2:4, 3:05.67, 4.29, 5等等
          如DNF请直接输入DNF, dnf, d或0"></v-md-preview>
        </div>
      </el-form>
    </div>

    <div class="finished" v-else>
      <div class="finished-header account-profile">
        <img :src="store.state.user.avatar" alt="" >
        <div class="blob-wrap">
          <div class="blob"></div>
          <div class="blob"></div>
          <div class="blob"></div>
        </div>
      </div>
      <div class="finished-content">
        <p>你已经完成了此项目</p>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from "vue";
import {getComp} from "@/api/fetchData";
import {store, UPDATE_USER_PARTICIPATION_DATA} from "@/store";
import {Scramble} from "@/types";
import {convert_time, SPECIAL_EVENTS, translateEvent} from "@/utils";
import {ElMessage, ElNotification, FormInstance} from "element-plus";
import {postResult} from "@/api/service";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";

// 下面是直接复制以前的代码，所以有些变量名可能不太合适，并且可能很混乱。但是这个组件的功能是可以正常使用的。

const props = defineProps<{
  comp: string
  activeEvent: string
}>()

const count = ref(1)
const dialogVisible = ref(false)
const imgVisible = ref(false)
const is3d = ref(false)

// 是否是周赛
const is_normal = computed(() => props.comp==='week')
// 异步获取当前比赛数据
const compData = is_normal.value?await getComp('week'):await getComp('special')
// 请求更新用户进度
store.commit(UPDATE_USER_PARTICIPATION_DATA)

// 获取用户进度
const userParticipationData = computed(() => store.state.userParticipation)
// 根据进度，计算相关的项目
const events_all = computed(() =>
    is_normal.value?
        userParticipationData.value.week.events_all:
        userParticipationData.value.special.events_all
)
const events_finished = computed(() =>
    is_normal.value?
        userParticipationData.value.week.events_finished:
        userParticipationData.value.special.events_finished
)
const events_available = computed(() => {
  const events_available: string[] = []
  for (let event of events_all.value) {
    if (!(events_finished.value.indexOf(event) > -1)) {
      events_available.push(event)
    }
  }
  return events_available
})

// 未完成的打乱
const scrambles_available = computed(() => {
  const scramble_set: Scramble[] = []
  for (let scramble of compData.scramble_set) {
    if (events_available.value.indexOf(scramble.event) > -1) {
      scramble_set.push(scramble)
    }
  }
  return scramble_set
})

// 打乱数
const maxScrambleCount = computed(() => {
  if (SPECIAL_EVENTS.indexOf(props.activeEvent) > -1) {
    return 3
  } else {
    return 5
  }
})
watch([maxScrambleCount], () => count.value = 1)
// 是否是特殊项目
const is_special = computed(() => maxScrambleCount.value === 3)
const scrambleOfEvent = computed(() => {
  for (let scramble of scrambles_available.value) {
    if (scramble.event === props.activeEvent) {
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
        event: props.activeEvent,
        time_1: convert_time(state.resultForm.time_1),
        time_2: convert_time(state.resultForm.time_2),
        time_3: convert_time(state.resultForm.time_3),
        time_4: convert_time(state.resultForm.time_4),
        time_5: convert_time(state.resultForm.time_5),
      }
      try {
        const data = await postResult(req)
        ElNotification({
          title: '成功',
          message: '提交成功！',
          type: 'success',
        })
        store.commit(UPDATE_USER_PARTICIPATION_DATA)
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
.cubing {
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100vh - 120px);
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

.cubing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.tip {
  text-align: left;
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
