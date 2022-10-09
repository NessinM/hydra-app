<template lang="pug">
div
  div(v-if="hash")
    div(v-if="isLoading") verificando validez del hash...
    div(v-else)
      div(v-if="path")
        | Mostrar el pdf en el iframe {{path}}
        div hash : {{hash}}
      div(v-else)
        | El hash enviado no corresponde a ningun docuemnto
  div(v-else)
    | No se puede representar ningun documento por que no existe el hash correspondiente
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
      let path      = ref('')
      let isLoading = ref(false)
      onMounted(async () => {
        try {
          isLoading.value = true
          const { data } = await apiGet(`/invoice`, { hash })
          path.value = data.document.path
        } catch (error) {
          console.log('error', error)
        } finally {
          isLoading.value = false
        }
      })

      return {
        path,
        isLoading,
        hash
      }
    }
  })
  </script>