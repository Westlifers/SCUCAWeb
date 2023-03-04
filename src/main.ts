import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from "@element-plus/icons-vue";

const app = createApp(App)
app.use(ElementPlus)
for (const name in ElIcons) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.component(name, ElIcons[name]);
}
app.use(store).use(router).mount('#app')
