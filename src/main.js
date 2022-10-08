import { createApp } from 'vue'
import routers from './routes'
import App from './App.vue'

// createApp(App).mount('#app')

createApp(App)
  // .use(vuetify)
  // .use(createPinia())
  .use(routers)
  .mount('#app')