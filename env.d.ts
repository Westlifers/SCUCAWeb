/// <reference types="vite/client" />

// 解决ts服务无法识别vue文件的问题
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
