import { createRouter, createWebHistory } from 'vue-router'
import DashboardView    from '../views/Dashboard.vue'
import PrintInvoiceView from '../views/Print_Invoice.vue'

const routes = [
  {
    path     : '/',
    name     : 'Home',
    component: DashboardView
  },
  {
    path     : '/invoice-print/:hash?',
    name     : 'Print',
    props    : true,
    component: PrintInvoiceView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// router.beforeEach(async (to, from, next) => {
//   const isAuthenticated = await canUserAccessToRouter(to)
//   console.log('isAuthenticated', isAuthenticated)
//   if (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Forgot' && !isAuthenticated) next({ name: 'Login' })
//   else next()
// })


// const canUserAccessToRouter = (to) => {
//   return new Promise ((resolve, reject) => {
//     console.log('to', to)
//     resolve(false)
//   })
// }

export default router