<template lang="pug">
object(type='application/pdf' id="pdf_invoice" width='100%' height='96%' :data="dataBase64PDF" v-if="dataBase64PDF")
//- div
//-   div(v-if="hash")
//-     div(v-if="isLoading") verificando validez del hash...
//-     div(v-else)
//-       div(v-if="dataBase64PDF")
//-         | ddskfdsjk
//-       div(v-else)
//-         | El hash enviado no corresponde a ningun docuemnto
//-   div(v-else)
//-     | No se puede representar ningun documento por que no existe el hash correspondiente
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import { apiGet } from '../util/general'
export default defineComponent({
  name : 'c_print_pdf_invoice',
  props: {
    hash : {
      type    : String,
      required: true,
      default : ''
    }
  },
  setup({ hash }) {
    let dataBase64PDF = ref('')
    let isLoading     = ref(false)
    onMounted(async () => {
      try {
        isLoading.value = true
        const { data } = await apiGet(`/invoice`, { hash })
        if (data.found) dataBase64PDF.value =  `data:application/pdf;base64,${data.base64PDF}`
      } catch (error) {
        console.log('error', error)
      } finally {
        isLoading.value = false
      }
    })

    return {
      dataBase64PDF,
      isLoading,
      hash
    }
  }
})
</script>