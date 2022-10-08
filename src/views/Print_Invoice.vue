<template lang="pug">
div
  h1 Invoice
  router-link(to="/") Regresar al dashboard
  print-pdf-invoice(:hash="hashRoute")
</template>
<script>
import { defineComponent, ref } from 'vue';
import printPdfInvoice from '../components/c_print_pdf_invoice.vue'

export default defineComponent({
  name      : 'Print_Invoice',
  props: {
    hash : {
      type    : String,
      required: false,
      default : ''
    }
  },
  components: {
    'print-pdf-invoice' : printPdfInvoice
  },
  setup({ hash }) {
    const hashRoute = ref(hash || '')
    return {
      hashRoute
    }
  }
})
</script>