import {defineStore} from 'pinia'

import type {User, UserParticipationData} from '@/types'
import {ElNotification} from "element-plus";
import {getProfile, getUserParticipationData} from "@/api/fetchData";

export const initDefaultUserInfo = (): User => {
  let user = {
    id: 0,
    username: "",
    email: '',
    is_active: false,
    is_superuser: false,
    is_scuer: false,
    avatar: 'http://img.yougi.top/default.png',
    description: '',
  }
  if (window.localStorage.getItem("userInfo")) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user = JSON.parse(window.localStorage.getItem("userInfo"));
  }
  return user
}

export const initUserParticipationData = (): UserParticipationData => {
  return {
    week: {
      events_all: [],
      events_finished: []
    },
    special: {
      events_all: [],
      events_finished: []
    }
  }
}

const initDarkMode = (): boolean => {
    const darkMode = window.localStorage.getItem("vueuse-color-scheme")
    return darkMode === 'dark';
}

export const localStore = defineStore('store', {
  state: () => ({
    user: initDefaultUserInfo(),  // 用户数据
    userParticipation: initUserParticipationData(),
    isDark: initDarkMode()
  }),

  actions: {
    setUser(userInfo: object | any) {
      for (const prop in userInfo) {
        this[prop] = userInfo[prop];
      }
    },
    async logOut() {
      // use await to make sure the localStorage is cleared before we log out
      await window.localStorage.setItem("userInfo", '')
      this.user = initDefaultUserInfo()
      ElNotification({
        title: '成功',
        message: '登出成功！',
        type: 'success',
      })
    },
    async clearUser() {
      // use await to make sure the localStorage is cleared before we log out
      await window.localStorage.setItem("userInfo", '')
      this.user = initDefaultUserInfo()
      ElNotification({
        title: '登录异常',
        message: '您的登录信息已过期或出现异常，请重新登录',
        type: 'warning',
      })
    },
    async updateUserParticipationData() {
      this.userParticipation = await getUserParticipationData()
    },
    toggleDarkMode(isDark: boolean) {
      this.isDark = isDark
    },
    async updateUserProfile() {
      this.user = await getProfile(this.user.username)
      await window.localStorage.setItem("userInfo", JSON.stringify(this.user))
    }
  },

})
