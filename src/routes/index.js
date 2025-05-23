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


export default router