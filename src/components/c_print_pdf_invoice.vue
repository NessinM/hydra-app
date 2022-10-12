<template lang="pug">
.fixed.top-0.left-0.right-0.bottom-0.w-full.h-screen.z-50.overflow-hidden.bg-gray-50.flex.flex-col.items-center.justify-center(v-if="isLoading")
  .loader.ease-linear.rounded-full.border-4.border-t-4.border-gray-200.h-12.w-12.mb-4
  h2.text-center.text-md.font-bold.text-gray-500 {{hash}}
  p.text-center.font-semibold.text-gray-500.text-sm(class='w-1/3') Esto puede tardar unos segundos, por favor no cierre esta página.
object(type='application/pdf' id="pdf_invoice" width='100%' height='100%' :data="dataBase64PDF" v-if="dataBase64PDF && !isLoading")
.fixed.top-0.left-0.right-0.bottom-0.w-full.h-screen.z-50.overflow-hidden.bg-gray-50.flex.flex-col.items-center.justify-center(v-if="!dataBase64PDF && !isLoading")
  img.my-2(src="/public/document_not_found.png" width="100")
  h2.text-center.text-md.font-bold.text-gray-500.mt-2 {{hash ? hash : 'NUMERO NO IDENTIFICADO'}}
  p.text-center.font-semibold.text-gray-500.text-sm(class='w-1/3') No se encontrarón coincidencias para este documento
  button.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-medium.rounded-lg.text-sm.px-5.text-center.mr-2.my-2(type='button' class='hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 py-2.5')  Regresar a la pagina anterior
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
    let isLoading     = ref(true)
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
<style>
.loader {
	border-top-color: #db34cd  !important;
	-webkit-animation: spinner 1.5s linear infinite;
	animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
	0% {
		-webkit-transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
	}
}

@keyframes spinner {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>