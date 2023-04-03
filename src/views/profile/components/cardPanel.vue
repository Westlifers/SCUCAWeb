<template>
  <div class="cards-wrapper" style="--delay: .6s">
    <div class="cards-header">
      <div class="cards-header-date">
        <el-button size="small" round @click="month--">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left">
          <path d="M15 18l-6-6 6-6"></path></svg>
        </el-button>
        <div class="title">{{today.toLocaleDateString()}}</div>
        <el-button size="small" round @click="month++">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
            <path d="M9 18l6-6-6-6"></path></svg>
        </el-button>
      </div>
    </div>
    <div class="cards card">
      <div class="cards-head">
        <div class="cards-info">
          <div class="calendar-hour">{{today.toLocaleTimeString()}}</div>
          <div class="degree">
            <svg viewBox="0 0 512 512">
              <circle cx="330.2" cy="240.1" fill="#feb137" r="78.9"></circle>
              <g fill="#ffd15b">
                <path d="M320.5 130c-7.4.6-14-5-14.6-12.3l-4.1-47a13.5 13.5 0 0126.9-2.4l4 47c.7 7.4-4.8 14-12.2 14.6z"></path>
                <path d="M320.5 130c-7.4.6-14-5-14.6-12.3l-4.1-47a13.5 13.5 0 0126.9-2.4l4 47c.7 7.4-4.8 14-12.2 14.6zM438 228.5c-.6-7.4 4.9-14 12.3-14.6l47-4a13.5 13.5 0 012.4 26.8l-47 4.1c-7.5.7-14-4.8-14.7-12.3zM413 307.7a13.5 13.5 0 0119-1.6l36.2 30.3a13.5 13.5 0 01-17.3 20.7l-36.2-30.4a13.5 13.5 0 01-1.6-19z"></path>
                <path d="M413 307.7a13.5 13.5 0 0119-1.6l36.2 30.3a13.5 13.5 0 01-17.3 20.7l-36.2-30.4a13.5 13.5 0 01-1.6-19zM190 120.6a13.5 13.5 0 0119-1.7l36.2 30.4a13.5 13.5 0 01-17.3 20.6l-36.2-30.3a13.5 13.5 0 01-1.7-19zM447.4 98a13.5 13.5 0 011.7 19l-30.4 36.2A13.5 13.5 0 01398 136l30.4-36.2a13.5 13.5 0 0119-1.6z"></path>
              </g>
              <path d="M360 335.4a70.8 70.8 0 00-87.4-74A95 95 0 0085 286a85 85 0 00-3.4 170h273a60.4 60.4 0 005.2-120.6z" fill="#d8ecfe"></path>
              <path d="M360 335.4a70.8 70.8 0 00-87.4-74 95 95 0 00-125.7-68.3 95 95 0 0190.6 74.2 70.8 70.8 0 0187.4 74A60.4 60.4 0 01345.6 456h9.2a60.4 60.4 0 005.1-120.6z" fill="#c4e2ff"></path>
            </svg>
            Hello, world!
          </div>
        </div>
        <svg viewBox="0 0 512 512" fill="currentColor">
          <path d="M272 512h-32c-26 0-47.2-21.1-47.2-47.1V454c-11-3.5-21.8-8-32.1-13.3l-7.7 7.7a47.1 47.1 0 01-66.7 0l-22.7-22.7a47.1 47.1 0 010-66.7l7.7-7.7c-5.3-10.3-9.8-21-13.3-32.1H47.1c-26 0-47.1-21.1-47.1-47.1v-32.2c0-26 21.1-47.1 47.1-47.1H58c3.5-11 8-21.8 13.3-32.1l-7.7-7.7a47.1 47.1 0 010-66.7l22.7-22.7a47.1 47.1 0 0166.7 0l7.7 7.7c10.3-5.3 21-9.8 32.1-13.3V47.1c0-26 21.1-47.1 47.1-47.1h32.2c26 0 47.1 21.1 47.1 47.1V58c11 3.5 21.8 8 32.1 13.3l7.7-7.7a47.1 47.1 0 0166.7 0l22.7 22.7a47.1 47.1 0 010 66.7l-7.7 7.7c5.3 10.3 9.8 21 13.3 32.1h10.9c26 0 47.1 21.1 47.1 47.1v32.2c0 26-21.1 47.1-47.1 47.1H454c-3.5 11-8 21.8-13.3 32.1l7.7 7.7a47.1 47.1 0 010 66.7l-22.7 22.7a47.1 47.1 0 01-66.7 0l-7.7-7.7c-10.3 5.3-21 9.8-32.1 13.3v10.9c0 26-21.1 47.1-47.1 47.1zM165.8 409.2a176.8 176.8 0 0045.8 19 15 15 0 0111.3 14.5V465c0 9.4 7.7 17.1 17.1 17.1h32.2c9.4 0 17.1-7.7 17.1-17.1v-22.2a15 15 0 0111.3-14.5c16-4.2 31.5-10.6 45.8-19a15 15 0 0118.2 2.3l15.7 15.7a17.1 17.1 0 0024.2 0l22.8-22.8a17.1 17.1 0 000-24.2l-15.7-15.7a15 15 0 01-2.3-18.2 176.8 176.8 0 0019-45.8 15 15 0 0114.5-11.3H465c9.4 0 17.1-7.7 17.1-17.1v-32.2c0-9.4-7.7-17.1-17.1-17.1h-22.2a15 15 0 01-14.5-11.2c-4.2-16.1-10.6-31.6-19-45.9a15 15 0 012.3-18.2l15.7-15.7a17.1 17.1 0 000-24.2l-22.8-22.8a17.1 17.1 0 00-24.2 0l-15.7 15.7a15 15 0 01-18.2 2.3 176.8 176.8 0 00-45.8-19 15 15 0 01-11.3-14.5V47c0-9.4-7.7-17.1-17.1-17.1h-32.2c-9.4 0-17.1 7.7-17.1 17.1v22.2a15 15 0 01-11.3 14.5c-16 4.2-31.5 10.6-45.8 19a15 15 0 01-18.2-2.3l-15.7-15.7a17.1 17.1 0 00-24.2 0l-22.8 22.8a17.1 17.1 0 000 24.2l15.7 15.7a15 15 0 012.3 18.2 176.8 176.8 0 00-19 45.8 15 15 0 01-14.5 11.3H47c-9.4 0-17.1 7.7-17.1 17.1v32.2c0 9.4 7.7 17.1 17.1 17.1h22.2a15 15 0 0114.5 11.3c4.2 16 10.6 31.5 19 45.8a15 15 0 01-2.3 18.2l-15.7 15.7a17.1 17.1 0 000 24.2l22.8 22.8a17.1 17.1 0 0024.2 0l15.7-15.7a15 15 0 0118.2-2.3z"></path>
          <path d="M256 367.4c-61.4 0-111.4-50-111.4-111.4s50-111.4 111.4-111.4 111.4 50 111.4 111.4-50 111.4-111.4 111.4zm0-192.8a81.5 81.5 0 000 162.8 81.5 81.5 0 000-162.8z"></path>
        </svg>
      </div>
      <div class="items days">
        <div class="item">Mon</div>
        <div class="item">Tue</div>
        <div class="item">Wed</div>
        <div class="item">Thu</div>
        <div class="item">Fri</div>
        <div class="item">Sat</div>
        <div class="item">Sun</div>
      </div>
      <div class="items numbers">
        <div v-for="day in calendar"
             :key="day"
             :class="{item: true, disable: day.isDisabled, 'is-active': day.isToday}"
        >
          {{day.date}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";

const month = ref((new Date()).getMonth());
const today = computed(() => {
  const day = new Date()
  day.setMonth(month.value)
  return day
})
const firstDayOfMonth = computed(() => new Date(today.value.getFullYear(), today.value.getMonth(), 1));
const lastDayOfMonth = computed(() => new Date(today.value.getFullYear(), today.value.getMonth() + 1, 0));

const firstDay = computed(() => firstDayOfMonth.value.getDay()); // 获取本月第一天是星期几
const daysInMonth = computed(() => lastDayOfMonth.value.getDate()); // 获取本月总天数
const lastDayOfLastMonth = computed(() => new Date(today.value.getFullYear(), today.value.getMonth(), 0).getDate());  // 获取上个月最后一天是几号
const dateToday = computed(() => today.value.getDate()); // 获取今天是几号
const weeksInMonth = computed(() => Math.ceil((firstDay.value + daysInMonth.value - 1) / 7)); // 计算本月跨越的周数
interface Calendar {
  date: number;
  isToday: boolean;
  isDisabled: boolean;
}
const calendar = computed(() => {
  const calendar_: Calendar[] = []  // Array sized 7 * number of weeks in month
  for (let i = 0; i <= weeksInMonth.value * 7; i++) {
    if (i + 1 - firstDay.value === 0) continue
    calendar_.push({
      date: (i + 1 - firstDay.value) < 0?
          (lastDayOfLastMonth.value + i + 2 - firstDay.value):
          (i + 1 - firstDay.value) > daysInMonth.value?
              (i + 1 - firstDay.value - daysInMonth.value):
              (i + 1 - firstDay.value),
      isToday: i + 1 - firstDay.value === dateToday.value,
      isDisabled: i + 1 - firstDay.value < 1 || i + 1 - firstDay.value > daysInMonth.value,
    })
  }

  return calendar_
})

</script>

<style scoped>
.card .days {
  display: flex;
  flex-wrap: nowrap;
}
:deep(.el-button) {
  border: none;
  --el-button-active-bg-color: transparent;
  --el-button-active-border-color: transparent;
  --el-button-hover-bg-color: transparent;
}
</style>
