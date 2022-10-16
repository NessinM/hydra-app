import { createApp } from 'vue'
import routers from './routes'
import Notifications from '@kyvg/vue3-notification'
import VueClickAway from "vue3-click-away";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import App from './App.vue'
import './tailwind.css'

library.add(fas, far)

createApp(App)
  // .use(vuetify)
  // .use(createPinia())
  .use(routers)
  .use(Notifications)
  .use(VueClickAway)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')