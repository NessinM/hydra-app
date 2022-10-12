<template lang="pug">
.flex
  .flex-1
  .flex-1
section.bg-gray-50(class="dark:bg-gray-900")
  .flex.flex-col.items-center.justify-center.px-6.py-8.mx-auto(
    class="md:h-screen lg:py-0"
  )
    a.flex.items-center.mb-6.text-2xl.font-semibold.text-gray-900(
      href="#",
      class="dark:text-white"
    )
      img.w-20.h-20.mr-2(src="logo_datacont.png", alt="datacont")
      //- img.w-14.h-14.mr-2(src='/public/logo_reprodata.png' alt='reprodata')
      //- | Datacont
    .w-full.bg-white.rounded-lg.shadow(
      class="dark:border md:mt-0 sm:max-w-sm xl:p-0 dark:bg-gray-800 dark:border-gray-700"
    )
      .p-6.space-y-4(class="md:space-y-6 sm:p-8")
        h1.text-xl.font-bold.leading-tight.tracking-tight.text-gray-900(
          class="md:text-1xl dark:text-white"
        )
          | Consulta de comprobantes electronicos
        .space-y-4(class="md:space-y-6")
          .flex
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-900(
                for="tipo",
                class="dark:text-white"
              ) Tipo de documento
              select.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#tipo(
                v-model="tipo",
                name="tipo",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                placeholder="seleccionar..."
              )
                option(value="01") BOLETA
                option(value="03") FACTURA
                option(value="07") NOTA DE CREDITO
                option(value="08") NOTA DE DEBITO
                option(value="09") GUIA REMISION
          .flex
            .flex-1.mr-4
              label.block.mb-2.text-xs.font-medium.text-gray-900(
                for="folio",
                class="dark:text-white"
              ) Folio
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#folio(
                v-model="folio",
                type="text",
                name="folio",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                placeholder="F079"
              )
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-900(
                for="numero",
                class="dark:text-white"
              ) Numero
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#numero(
                v-model="numero",
                type="number",
                name="numero",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                placeholder="0004524"
              )
          .flex
            .flex-1.mr-4
              label.block.mb-2.text-xs.font-medium.text-gray-900(
                for="fecha",
                class="dark:text-white"
              ) Fecha de emisión
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#fecha(
                v-model="fecha",
                type="date",
                name="fecha",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                placeholder="09/10/2022"
              )
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-900(
                for="monto",
                class="dark:text-white"
              ) Monto Total
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#monto(
                v-model="monto",
                type="number",
                name="monto",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                placeholder="Ej. 45257.01"
              )

          button.w-full.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-medium.rounded-lg.text-sm.px-5.text-center.mr-2.mb-2(
            class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 py-2.5",
            @click="fetchGetInvoice()"
          ) Buscar comprobante

//- div
//-   h1(class='text-3xl font-bold underline')
//-     | Hello world!
//-   router-link(to="/V01?file=INV20222010013135907F07989255") Documento visualizar
</template>
<script>
import moment from "moment";
import { defineComponent, ref } from "vue";
import { apiGet, notificacion } from "../util/general";
export default defineComponent({
  name: "c_print_pdf_invoice",
  props: {
    company: {
      type: String,
      required: true,
      default: "",
    },
  },
  setup({ company }) {
    let empresa = ref("datacont");
    let folio = ref(""); // F010
    let numero = ref(""); // 3062
    let tipo = ref("01"); // 01
    let fecha = ref(""); // 20200804
    let monto = ref(""); // 31487.12
    let urlDocument = ref(""); // 31487.12
    let isLoading = ref(false);

    const fetchGetInvoice = async () => {
      try {
        isLoading.value = true;
        const { data } = await apiGet(`/invoice/search`, {
          empresa: empresa.value,
          folio: folio.value,
          numero: numero.value,
          tipo: tipo.value,
          fecha: fecha.value
            ? moment(fecha.value, "YYYY-MM-DD").format("YYYYMMDD")
            : "",
          monto: monto.value,
        });

        if (data.length) {
          window.open(data[0].PDF, '_self')
        } else notificacion('error', 'Error', 'Los datos ingresados no coinciden con ningun documento electronico')
      } catch (error) {
        notificacion('error', 'Error', error.message)
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      fetchGetInvoice,
      folio,
      numero,
      tipo,
      fecha,
      monto,
    };
  },
});
</script>
