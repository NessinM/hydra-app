import { createApp } from 'vue'
import routers from './routes'
import Notifications from '@kyvg/vue3-notification'
import App from './App.vue'
import './tailwind.css'

// createApp(App).mount('#app')

createApp(App)
  // .use(vuetify)
  // .use(createPinia())
  .use(routers)
  .use(Notifications)
  .mount('#app')