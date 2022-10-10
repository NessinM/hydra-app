<template lang="pug">
.full
  print-pdf-invoice(:hash="hashRoute")
</template>
<script>
import { defineComponent, ref } from 'vue';
import printPdfInvoice from '../components/c_print_pdf_invoice.vue'

export default defineComponent({
  name      : 'Print_Invoice',
  components: {
    'print-pdf-invoice': printPdfInvoice
  },
  props : {
    file : {
      type   : String,
      default: ''
    }
  },
  setup(props) {
    const hashRoute = ref(props.file)
    return {
      hashRoute
    }
  }
})
</script>
<style>
.full {
  width: 100%;
  height: 100vh;
}
body {
  margin : 0px;
  /* overflow-y: hidden; */
}
</style>