import {createApp} from 'vue'
import {createPinia} from 'pinia'
import router from "@/router";
import App from "@/App.vue";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from "@element-plus/icons-vue"
import 'element-plus/theme-chalk/dark/css-vars.css'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';

import "@cubing/icons";

import './styles/dark/dark-style.css'
import './styles/style.css'
import './styles/chat-style.css'

// highlight.js
import hljs from 'highlight.js';


VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdEditor.use(createKatexPlugin());
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(createKatexPlugin());

const app = createApp(App)
app.use(ElementPlus)
app.use(VMdEditor)
app.use(VMdPreview)

app.use(createPinia())
app.use(router)
for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}

// 修复移动端浏览器地址栏导致的视口高度问题
// 使用 dvh (dynamic viewport height) 作为主要方案，vh 作为回退方案
const setViewportHeight = () => {
    // 对于支持 dvh 的浏览器，直接使用 CSS
    // 对于不支持的浏览器，使用 JavaScript 计算
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
};

// 初始化
setViewportHeight();

// 监听窗口大小变化（方向改变、键盘弹出等）
let resizeTimer: number;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(setViewportHeight, 100);
});

app.mount('#app')
