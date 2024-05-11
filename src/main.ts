import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueTheMask from "vue-the-mask"
import App from './App.vue'
import './assets/index.css'
import Navigator from './layouts/Navigator.vue'
import router from './router'
const app = createApp(App);

app.use(VueTheMask)
const pinia = createPinia();
app.component("Navigator", Navigator)
app.use(pinia); 
app.use(router);

app.mount('#app')