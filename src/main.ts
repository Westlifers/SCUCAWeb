import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from "@element-plus/icons-vue"

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlight.js
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

const app = createApp(App)
app.use(ElementPlus)
app.use(VMdEditor)
app.use(VMdPreview)
for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}
app.use(store).use(router).mount('#app')
