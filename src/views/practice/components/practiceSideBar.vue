<template>
  <div class="practice-side-bar-container">
    <div class="group-selector">
      <el-select v-model="group" @change="setGroup(group)">
        <el-option
            v-for="item in groups"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>

      <el-button-group>
        <el-button type="primary" @click="createGroup">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button type="danger" @click="deleteDialogVisible=true">
          <el-icon><Close /></el-icon>
        </el-button>
      </el-button-group>

      <el-dialog
          title="删除分组"
          v-model="deleteDialogVisible"
          width="30%"
          @close="deleteDialogVisible=false">
        <span>你确定要删除分组 {{group}} 吗？</span>
        <template #footer>
          <el-button type="primary" @click="deleteDialogVisible=false">取消</el-button>
          <el-button type="danger" @click="deleteGroup">是</el-button>
        </template>
      </el-dialog>
    </div>


    <el-table :data="general_statistic">
      <el-table-column label="" prop="title" />
      <el-table-column label="当前" prop="current" :formatter="formatter" />
      <el-table-column label="最好" prop="best" />
    </el-table>


    <el-table :data="groupDetail" style="width: 100%">

      <el-table-column label="" width="50">
        <template v-slot="scope">
          {{groupDetail.length - scope.$index}}
        </template>
      </el-table-column>

      <el-table-column prop="time" label="时间">
        <template v-slot="scope">
          {{scope.row.time===0?'DNF':time_convert(scope.row.time)}}
        </template>
      </el-table-column>

      <el-table-column label="ao5">
        <template v-slot="scope">
          {{statistics.ao5[scope.$index] > -1 ? (statistics.ao5[scope.$index]===0?'DNF':time_convert(statistics.ao5[scope.$index])) : ''}}
        </template>
      </el-table-column>

      <el-table-column label="ao12">
        <template v-slot="scope">
          {{statistics.ao12[scope.$index] > -1 ? (statistics.ao12[scope.$index]===0?'DNF':time_convert(statistics.ao12[scope.$index])) : ''}}
        </template>
      </el-table-column>
    </el-table>


    <timing-curtain :state="timingState" @timing-over="setTime" v-if="group" />
  </div>
</template>

<script lang="ts" setup>
import {del, get, keys, set, update} from 'idb-keyval';
import {computed, ref} from "vue";
import {Result, StoredTime} from "@/types";
import TimingCurtain from "@/components/timingCurtain/timingCurtain.vue";
import {time_convert} from "@/utils";
import {Close, Plus} from "@element-plus/icons-vue";
import {ElNotification, TableColumnCtx} from "element-plus";

const deleteDialogVisible = ref(false)

const group = ref()
const groupDetail = ref()
const groups = ref()
keys().then((val) => {
  groups.value = val
})
const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  if (val === Infinity) return 'DNF'
  return val>0?time_convert(val):'DNF'
}

const createGroup = async () => {
  const newGroup = prompt('输入新分组名')
  if (newGroup) {
    await set(newGroup, [])
    keys().then((val) => {
      groups.value = val
    })
    ElNotification.success({
      title: '创建成功',
      message: `分组 ${newGroup} 已创建`,
    })
    setGroup(newGroup)
  }
}
const deleteGroup = async () => {
  if (group.value) {
    await del(group.value)
    keys().then((val) => {
      groups.value = val
      setGroup(groups.value[0])
    })
    deleteDialogVisible.value = false
    ElNotification.success({
      title: '删除成功',
      message: '分组已删除',
    })
  }
}

const setGroup = (g) => {
  group.value = g
  get(g).then((val) => {
    groupDetail.value = val.reverse()
  })
}
const setTime = (t) => {
  emits('setTime', t)
  // store time to indexedDB
  update(group.value, (times) => {
    times.push({
      time: t,
      scramble: props.scramble,
      date: (new Date()).getTime(),
      note: '',
      punishment: 0,
    })
    return times
  })
  groupDetail.value.unshift({  // use unshift to add to the front of the list
    time: t,
    scramble: props.scramble,
    date: (new Date()).getTime(),
    note: '',
    punishment: 0,
  })
}
const emits = defineEmits<{
  (event: 'setTime', t: number): void
}>()
const props = defineProps<{
  timingState: number
  scramble: string
}>()



// compute ao5 and ao12, etc, as list.
const ao = (n: number) => {
  const RATIO = 0.05  // 删去头尾各 5% 的数据，向上取整

  if (groupDetail.value) {
    const times = groupDetail.value.map((t: StoredTime) => t.time)
    const len = times.length
    const drop_size = Math.ceil(len * RATIO)
    const ao: number[] = []
    for (let i = 0; i < len; i++) {
      if (i > len - n) {
        ao.push(-1)
      } else {
        const array = times.slice(i, i + n).sort((a, b) => {
          a = a === 0 ? Infinity : a; b = b === 0 ? Infinity : b;
          return a - b
        })
        // for n <=12, we need to consider return DNF if there's 2 or more DNFs
        if (n <= 12 && array.filter(t => t === 0).length >= 2) {
          ao.push(0)
        } else {
          ao.push(array.slice(drop_size, array.length - drop_size).reduce((acc, t) => acc + t, 0) / (array.length - 2 * drop_size)).toFixed(3)
        }
      }
    }
    return ao
  }

  return []
}
const statistics = computed(() => {
  if (groupDetail.value) {
    return {
      solved: groupDetail.value.filter((t: StoredTime) => t.time !== 0).length,
      total: groupDetail.value.length,
      ao5: ao(5),
      ao12: ao(12),
      ao100: ao(100),
      ao1000: ao(1000),
      best: groupDetail.value.map((t: StoredTime) => t.time).sort((a, b) => {
        a = a === 0 ? Infinity : a; b = b === 0 ? Infinity : b;
        return a - b
      })[0].toFixed(3)
    }
  }

  return {
    solved: 0,
    total: 0,
    ao5: [],
    ao12: [],
    ao100: [],
    ao1000: [],
    best: Infinity,
  }
})
const general_statistic = computed(() => {
  if (groupDetail.value === undefined) return []
  const result = [
    {
      title: 'time',
      current: groupDetail.value.length===0?NaN:groupDetail.value[0].time,
      best: statistics.value.best,
    },
    {
      title: 'ao5',
      current:statistics.value.ao5.length===0?NaN: statistics.value.ao5[0],
      best: Math.min(...statistics.value.ao5.filter(t => t > 0)).toFixed(3),
    },
    {
      title: 'ao12',
      current:statistics.value.ao12.length===0?NaN: statistics.value.ao12[0],
      best: Math.min(...statistics.value.ao12.filter(t => t > 0)).toFixed(3),
    },
  ]

  if (statistics.value.total > 100) result.push({
    title: 'ao100',
    current:statistics.value.ao100.length===0?NaN: statistics.value.ao100[0],
    best: Math.min(...statistics.value.ao100.filter(t => t > 0)).toFixed(3),
  })
  if (statistics.value.total > 1000) result.push({
    title: 'ao1000',
    current:statistics.value.ao1000.length===0?NaN: statistics.value.ao1000[0],
    best: Math.min(...statistics.value.ao1000.filter(t => t > 0)).toFixed(3),
  })

  return result
})
</script>

<style scoped>
.practice-side-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.group-selector {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10%;
}
:deep(.el-button-group) {
  display: flex;
}

</style>
