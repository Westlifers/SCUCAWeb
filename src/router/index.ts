import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import layout from "@/layout/index.vue"
import aboutUs from "@/views/about/AboutUs.vue";
import loginRegister from "@/views/login/LoginRegister.vue";
import scuRecord from '@/views/record/RecordSuspense.vue'
import specialSuspense from "@/views/special/SpecialSuspense.vue";
import historyListSuspense from "@/views/history/list/HistoryListSuspense.vue";
import historyDetailSuspense from "@/views/history/detail/HistoryDetailSuspense.vue";
import rankSuspense from "@/views/rank/RankSuspense.vue";
import createCompetitionSuspense from "@/views/createComp/createCompetitionSuspense.vue";
import indexSuspense from "@/views/index/indexSuspense.vue";
import createAnnouncementForm from "@/views/createAnnouncement/createAnnouncementForm.vue";
import discussionGiscus from "@/views/discussion/discussionGiscus.vue";
import profileEditSuspense from "@/views/profile/profileEditSuspense.vue";
import weekSuspense from "@/views/week/WeekSuspense.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'login/',
  },


  {
    path: '/index',
    component: layout,
    children: [
      {
        path: '',
        component: indexSuspense,
        name: 'index'
      }
    ]
  },


  {
    path: '/comp',
    component: layout,
    children: [
      {
        path: 'week',
        component: weekSuspense,
        name: 'week'
      },
      {
        path: 'special',
        component: specialSuspense,
        name: 'special'
      }
    ]
  },


  {
    path: '/history',
    component: layout,
    children: [
      {
        path: '',
        component: historyListSuspense,
        name: 'history'
      },
      {
        path: 'detail/:compId',
        component: historyDetailSuspense
      }
    ]
  },


  {
    path: '/record',
    component: layout,
    children: [
      {
        path: '',
        component: scuRecord,
        name: 'record'
      }
    ]
  },


  {
    path: '/rank',
    component: layout,
    children: [
      {
        path: '',
        component: rankSuspense,
        name: 'rank'
      }
    ]
  },


  {
    path: '/create',
    component: layout,
    children: [
      {
        path: '',
        component: createCompetitionSuspense,
        name: 'create'
      }
    ]
  },


  {
    path: '/discussion',
    component: layout,
    children: [
      {
        path: '',
        component: discussionGiscus,
        name: 'discussion'
      }
    ]
  },


  {
    path: '/about',
    component: layout,
    children: [
      {
        path: '',
        component: aboutUs,
        name: 'about'
      }
    ]
  },

  {
    path: '/login',
    component: loginRegister,
    name: 'login'
  },

  {
    path: '/post',
    component: layout,
    children: [
      {
        path: '',
        component: createAnnouncementForm,
        name: 'post'
      }
    ]
  },

  {
    path: '/profile',
    component: layout,
    children: [
      {
        path: '',
        component: profileEditSuspense,
        name: 'profile'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
