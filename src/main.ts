import { createApp } from 'vue'
import { createPinia } from 'pinia'
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

import './styles/dark/dark-style.css'
import './styles/style.css'

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
    // @ts-ignore
    app.component(name, ElIcons[name]);
}

app.mount('#app')
