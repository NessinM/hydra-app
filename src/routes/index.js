import { createRouter, createWebHistory } from 'vue-router'
import DashboardSearchInvoiceView    from '../views/View_Dashboard_Search_Invoice.vue'
import PrintPDFXMLInvoiceView from '../views/View_Print_XML_PDF_Invoice.vue'

const routes = [
  {
    path     : '/',
    redirect: '/search-invoice',
  },
  {
    path     : '/search-invoice',
    name     : 'Home',
    component: DashboardSearchInvoiceView,
    props    : route => ({
      company: route.query.company
    })
  },
  {
    path     : '/v01',
    name     : 'Print',
    component: PrintPDFXMLInvoiceView,
    props    : route => ({
      file: route.query.file
    })
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