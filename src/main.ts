import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from "@element-plus/icons-vue"

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlight.js
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});

const app = createApp(App)
app.use(ElementPlus)
app.use(VMdEditor)
for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}
app.use(store).use(router).mount('#app')
