import {createStore} from 'vuex'

import {User, UserParticipationData} from '@/types'
import {ElNotification} from "element-plus";
import {getUserParticipationData} from "@/api/fetchData";

export const SET_USER = 'setUser'
export const LOG_OUT = 'logOut'
export const CLEAR_USER = 'clearUser'
export const TOGGLE_DARK_MODE = 'toggleDarkMode'

export const UPDATE_USER_PARTICIPATION_DATA = 'updateUserParticipationData'

export const initDefaultUserInfo = (): User => {
  let user = {
    id: 0,
    username: "",
    email: '',
    is_active: false,
    is_superuser: false,
    is_scuer: false,
    avatar: 'http://img.yougi.top/default.png',
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

export const store = createStore({
  state: {
    user: initDefaultUserInfo(),  // 用户数据
    userParticipation: initUserParticipationData(),
    isDark: initDarkMode()
  },
  getters: {
  },
  mutations: {
    setUser(state: object | any, userInfo: object | any) {
      for (const prop in userInfo) {
        state[prop] = userInfo[prop];
      }
    },
    async logOut(state: object | any) {
      // use await to make sure the localStorage is cleared before we log out
      await window.localStorage.setItem("userInfo", '')
      state.user = initDefaultUserInfo()
      ElNotification({
        title: '成功',
        message: '登出成功！',
        type: 'success',
      })
    },
    async clearUser(state: object | any) {
      // use await to make sure the localStorage is cleared before we log out
      await window.localStorage.setItem("userInfo", '')
      state.user = initDefaultUserInfo()
      ElNotification({
        title: '登录异常',
        message: '您的登录信息已过期或出现异常，请重新登录',
        type: 'warning',
      })
    },
    async updateUserParticipationData(state: object | any) {
      state.userParticipation = await getUserParticipationData()
    },
    toggleDarkMode(state: object | any, isDark: boolean) {
      state.isDark = isDark
    }
  },
  actions: {
  },
  modules: {
  }
})
