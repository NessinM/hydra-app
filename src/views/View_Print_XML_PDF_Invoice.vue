

<template lang="pug">
.relative.z-10(v-if="showModalSunatStatus")
  .fixed.inset-0.bg-gray-700.bg-opacity-75.transition-opacity
  .fixed.inset-0.z-10.overflow-y-auto
    .flex.min-h-full.items-end.justify-center.p-4.text-center(class='sm:items-center sm:p-0')
      .relative.transform.overflow-hidden.rounded-lg.bg-white.text-left.shadow-xl.transition-all(class='sm:my-8 sm:w-full sm:max-w-lg' v-click-away="hideModalSunatStatus")
        .bg-white.px-4.pb-4.flex
          .text-center.flex-1
            //- h3.text-lg.font-bold.leading-6.text-gray-600 Estado de documento en SUNAT
            .mt-4.flex.items-center.justify-center
              .py-2.flex-1.flex.items-center(v-if="isLoadingStatusSunat")
                svg.mr-2.w-12.h-12.text-gray-200.animate-spin.fill-red-500.ml-8(aria-hidden='true' class='dark:text-gray-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg')
                  path(d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor')
                  path(d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill')
                span.text-sm.text-gray-500.font-semibold Consultando comprobante en SUNAT
              .w-full.bg-white.rounded-lg.py-4(v-else)
                .flex.flex-col.items-center
                  img.mb-3.w-20.h-20.rounded-full.shadow-lg.py-2.px-2(src='sunat.png' alt='Bonnie image')
                  h5.mb-1.text-xl.font-bold(:class="(dataStatusSunat.id === 1 || dataStatusSunat.id === 3) ? 'text-green-400' : 'text-red-400'") {{dataStatusSunat.titulo}}
                  span.text-sm.text-gray-500.font-semibold {{dataStatusSunat.subtitulo}}
                  .flex.mt-4.space-x-3(class='md:mt-6')
                    button.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-medium.rounded-lg.text-sm.px-5.text-center.mr-2.my-2(type='button' class='hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 py-2.5' @click="hideModalSunatStatus()")  Volver al visor del documento
.h-screen.overflow-y-auto.overflow-x-hidden
  nav.bg-white.px-1.rounded.shadow-lg.sticky.top-0
    .flex.flex-wrap.justify-between.items-center
      router-link.flex.items-center(:to="`/search-invoice?company=${empresaSelect}`")
        img.mx-3(src='https://flowbite.com/docs/images/logo.svg' class='sm:h-9' alt='Logo')
        span.self-center.text-xl.font-bold.whitespace-nowrap.text-gray-500 Hydra Storage
      #navbar-cta.hidden.justify-between.items-center.w-full(class='md:flex md:w-auto md:order-1')
        ul.flex.flex-col.p-2.mt-4.rounded-lg.border.items-center(class='md:flex-row  md:mt-0 md:text-sm md:font-medium md:border-0')
          li.mr-1.ml-1
            button.w-full.text-white.bg-gradient-to-r.from-gray-400.via-gray-500.to-gray-600.shadow-lg.font-bold.rounded-lg.text-sm.px-5.text-center(
              class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300  shadow-gray-500/50  py-2",
              @click="fetchGetStatusInvoiceSunat()"
            )
              font-awesome-icon.fa-1x.mr-2(icon='fa-solid fa-building-circle-check')
              | SUNAT
          li.mr-1.ml-1
            button.w-full.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-bold.rounded-lg.text-sm.px-5.text-center(
              class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300  shadow-red-500/50  py-2",
              @click="() => { typeViewRender = 'pdf' }"
            )
              font-awesome-icon.fa-1x.mr-2(icon='fas fa-code')
              | PDF
          li.mr-1.ml-1
            button.w-full.text-white.bg-gradient-to-r.from-yellow-400.via-yellow-500.to-yellow-600.shadow-lg.font-bold.rounded-lg.text-sm.px-5.text-center(
              class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300  shadow-yellow-500/50  py-2",
              @click="() => { typeViewRender = 'xml' }"
            )
              font-awesome-icon.fa-1x.mr-2(icon='fas fa-code')
              | XML
  .fixed.top-0.left-0.right-0.bottom-0.w-full.h-screen.z-50.overflow-hidden.bg-gray-50.flex.flex-col.items-center.justify-center(v-if="isLoading")
    .loader.ease-linear.rounded-full.border-4.border-t-4.border-gray-200.h-12.w-12.mb-4
    h2.text-center.text-md.font-bold.text-gray-500 {{hash}}
    p.text-center.font-semibold.text-gray-500.text-sm(class='w-1/3') Esto puede tardar unos segundos, por favor no cierre esta página.
  object(type='application/pdf' id="pdf_invoice" width='100%' height='95%' :data="dataBase64PDF" v-if="typeViewRender === 'pdf' && dataBase64PDF && !isLoading")
  pre.bg-gray-100.text-blue-600.px-4.py-4.text-xs.font-bold(v-if="typeViewRender === 'xml' && dataBaseXML && !isLoading")
    | {{dataBaseXML}}
  .fixed.top-0.left-0.right-0.bottom-0.w-full.h-screen.z-50.overflow-hidden.bg-gray-50.flex.flex-col.items-center.justify-center(v-if="!dataBase64PDF && !isLoading")
    img.my-2(src="document_not_found.png" width="100")
    h2.text-center.text-md.font-bold.text-gray-500.mt-2 {{hash ? hash : 'NUMERO NO IDENTIFICADO'}}
    p.text-center.font-semibold.text-gray-500.text-sm(class='w-1/3') No se encontrarón coincidencias para este documento
    router-link.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-medium.rounded-lg.text-sm.px-5.text-center.mr-2.my-2(:to="`/search-invoice?company=${empresaSelect}`" type='button' class='hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 py-2.5' to=`/search-invoice?company=${empresa}`)  Regresar a la pagina anterior
</template>
<script>
import moment from 'moment';
import { defineComponent, onMounted, ref } from 'vue';
import { directive } from "vue3-click-away";
import { apiGet, notificacion } from '../util/general'
export default defineComponent({
  name : 'View_Print_XML_PDF_Invoice',
  directives: {
    ClickAway: directive
  },
  props: {
    file : {
      type   : String,
      default: ''
    }
  },
  setup(props) {
    let   hash                 = ref(props.file || '')
    let   typeViewRender       = ref('xml')
    let   dataBase64PDF        = ref('')
    let   dataBaseXML          = ref()
    let   isLoading            = ref(true)
    let   isLoadingStatusSunat = ref(false)
    let   showModalSunatStatus = ref(false)
    let   dataStatusSunat      = ref()
    const storageInvoice       = JSON.parse(localStorage.getItem('invoice'))
    const empresaSelect        = ref(localStorage.getItem('empresaSelect'))
    onMounted(async () => {
      try {
        isLoading.value = true
        const { foundPDF, foundXML, base64PDF, baseXML } = await apiGet(`/invoice`, { hash : hash.value })
        if (foundPDF) dataBase64PDF.value =  `data:application/pdf;base64,${base64PDF}`
        if (foundXML) dataBaseXML.value   =  baseXML
        typeViewRender.value = hash.value.substring(0, 4) === 'INVP' ? 'pdf' : 'xml'
        if (!foundPDF && !foundXML)  notificacion('error', 'Error', 'El documento no se encontro en el repositorio')
      } catch (error) {
        notificacion('error', 'Error', error)
      } finally {
        isLoading.value = false
      }
    })

    const fetchGetStatusInvoiceSunat = async () => {
      try {
        showModalSunatStatus.value = true
        isLoadingStatusSunat.value = true;
        const response = await apiGet(`/invoice/status/sunat`, {
          empresa     : storageInvoice.empresa,
          numeroSerie : storageInvoice.folio,
          numero      : storageInvoice.numero,
          codComp     : storageInvoice.tipo,
          fechaEmision: storageInvoice.fecha
            ? moment(storageInvoice.fecha, "YYYYMMDD").format("DD/MM/YYYY")
            : "",
          monto: storageInvoice.monto,
        });
        dataStatusSunat.value = response.body
        console.log('datadatadata fetchGetStatusInvoiceSunat', response)
      } catch (error) {
        notificacion('error', 'Error', error.message)
        hideModalSunatStatus()
      } finally {
        isLoadingStatusSunat.value = false;
      }
    };

    const hideModalSunatStatus = () => {
      showModalSunatStatus.value = false
    };

    console.log('empresaSelect', empresaSelect)

    return {
      dataBase64PDF,
      isLoading,
      typeViewRender,
      dataBaseXML,
      fetchGetStatusInvoiceSunat,
      showModalSunatStatus,
      hideModalSunatStatus,
      isLoadingStatusSunat,
      dataStatusSunat,
      empresaSelect,
      hash
    }
  }
})
</script>
<style>
.loader {
  border-top-color: #f31d39  !important;
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