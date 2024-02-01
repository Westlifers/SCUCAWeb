import type {apiUsedEventName} from "@/types";

export const SPECIAL_EVENTS = ['333bld', '444bld', '555bld', '666', '777']
export const ALL_EVENTS: apiUsedEventName[] = ['333', '222', '444', '555', '666', '777', '333bld', '333oh', 'clock', 'minx', 'pyra', 'skewb', 'sq1', '444bld', '555bld']
export const isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
export const QUICK_MESSAGES: string[] = [
  '运气真好', '运气真差', '厚实', '不好意思', '真不要脸', 'sigma'
]
type tourGuide = {
  target: string | (() => Element | Element[])
  title: string
  description: string
  placement: string
}[]
export const TOUR_GUIDE_LIST: { [key: string]: tourGuide } = {
  'index': [
    {
      target: '#nav-user',
      title: '用户主页',
      description: '点击此处进入用户主页，可修改头像等个人信息、查看pb与个人统计数据等',
      placement: 'bottom'
    },
    {
      target: () => document.querySelectorAll('.el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger')[0],
      title: '参加比赛',
      description: '点击此处进入比赛页面，可参加周赛、特殊比赛，并查看排名信息等',
      placement: 'right'
    },
    {
      target: () => document.querySelectorAll('.el-menu-tooltip__trigger.el-tooltip__trigger.el-tooltip__trigger')[3],
      title: '实时pk',
      description: '点击此处进入实时pk页面，可与其他用户进行实时pk',
      placement: 'right'
    }
  ],
}
