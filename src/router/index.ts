import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import layout from "@/layout/index.vue"
import aboutUs from "@/views/about/AboutUs.vue";
import overView from "@/views/overview/OverViewSuspense.vue";
import loginRegister from "@/views/login/LoginRegister.vue";
import scuRecord from '@/views/record/RecordSuspense.vue'
import specialSuspense from "@/views/special/SpecialSuspense.vue";
import historyListSuspense from "@/views/history/list/HistoryListSuspense.vue";
import historyDetailSuspense from "@/views/history/detail/HistoryDetailSuspense.vue";
import rankSuspense from "@/views/rank/RankSuspense.vue";
import weekCubingSuspense from "@/views/cubing/WeekCubingSuspense.vue";
import specialCubingSuspense from "@/views/cubing/SpecialCubingSuspense.vue";
import createCompetitionSuspense from "@/views/createComp/createCompetitionSuspense.vue";
import announcementSuspense from "@/views/announcement/announcementSuspense.vue";
import createAnnouncementForm from "@/views/createAnnouncement/createAnnouncementForm.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'login/index/',
  },


  {
    path: '/index',
    component: layout,
    children: [
      {
        path: 'index',
        component: announcementSuspense,
        name: 'index'
      }
    ]
  },


  {
    path: '/thisWeek',
    component: layout,
    children: [
      {
        path: 'overview',
        component: overView,
        name: 'overview'
      },
      {
        path: 'cubing',
        component: weekCubingSuspense,
        name: 'weekCubing'
      }
    ]
  },


  {
    path: '/special',
    component: layout,
    children: [
      {
        path: 'index',
        component: specialSuspense,
        name: 'special'
      },
      {
        path: 'cubing',
        component: specialCubingSuspense,
        name: 'specialCubing'
      }
    ]
  },


  {
    path: '/history',
    component: layout,
    children: [
      {
        path: 'index',
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
        path: 'index',
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
        path: 'index',
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
        path: 'index',
        component: createCompetitionSuspense,
        name: 'create'
      }
    ]
  },


  {
    path: '/about',
    component: layout,
    children: [
      {
        path: 'index',
        component: aboutUs,
        name: 'about'
      }
    ]
  },

  {
    path: '/login',
    component: layout,
    children: [
      {
        path: 'index',
        component: loginRegister,
        name: 'login'
      }
    ]
  },

  {
    path: '/post',
    component: layout,
    children: [
      {
        path: 'index',
        component: createAnnouncementForm,
        name: 'post'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
