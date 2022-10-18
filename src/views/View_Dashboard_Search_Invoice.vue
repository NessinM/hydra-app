<template lang="pug">
.relative(v-if="!empresa")
  section.w-full.h-screen.bg-datacont-600.h-screen.opacity-90(style="background-image: url('lima-san-isidro.jpg');background-repeat: no-repat;background-size: cover;background-blend-mode: multiply")
  section.absolute.top-0.w-full.h-screen.items-center.justify-center.flex-col.flex.px-4
    h1.mb-10.text-4xl.font-extrabold.tracking-tight.leading-none.text-white(class='md:text-5xl lg:text-6xl') Consulta de comprobantes electronicos
    .p-6.w-full.max-w-sm.bg-white.rounded-lg.border.shadow-md(class='sm:p-6' )
      p.text-xs.font-semibold.text-gray-500 Selecione una empresa para poder iniciar el proceso de consulta de comprobantes de pago.
      ul.my-8.space-y-4
        li(v-for="(e, index) in empresas" :key="index")
          a.flex.items-center.p-3.text-base.text-gray-900.bg-gray-100.rounded-lg.group.cursor-pointer(@click="seleccionarEmpresa(e)" class='hover:bg-gray-100 hover:shadow  ')
            img.w-8.h-8.mr-2(:src="`logo_${e.name}.png`", alt="datacont")
            .flex.flex-col.flex-1
              span.ml-3.whitespace-nowrap.text-gray-600.font-bold.text-sm {{e.descripcion}}
              small.ml-3.whitespace-nowrap.text-gray-400.text-xs  {{e.ruc}}
            font-awesome-icon.text-2xl.inline-flex.items-center.justify-center(icon='fa fa-check-circle' :class="empresaSelect === e.name ? 'text-green-500' : 'text-gray-200'" )
      div
        button.w-full.text-white.bg-gradient-to-r.from-datacont-400.via-datacont-500.to-datacont-600.shadow-lg.font-medium.rounded-lg.text-xs.px-5.text-center.mr-2.mb-2(
          class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-datacont-300  shadow-datacont-500/50  py-2.5",
          @click="continuarConLaEmpresaSeleccionado()"
        ) Continuar
.flex(v-else)
  section.text-white.flex-1.w-full.h-screen.bg-datacont-400.opacity-90.relative.flex.items-center.justify-center.hidden(class="lg:block md:block"  style="background-image: url('lima-san-isidro.jpg');background-repeat: no-repat;background-size: cover;background-blend-mode: multiply")
    a.inline-flex.justify-center.items-center.p-3.text-xs.font-medium.rounded-lg.absolute.top-0.left-0.mx-10.my-5.cursor-pointer(@click="volverASeleccionarEmpresa"  class='hover:bg-datacont-600 font-bold hover:text-white')
      font-awesome-icon.text-md.mr-2(icon='fa fa-arrow-left')
      span.w-full Volver a seleccionar una empresa
    .flex.flex-col.mx-10
      .flex-1.mb-10
        h1.text-3xl.font-extrabold.tracking-tight.leading-none.text-white(class='md:text-4xl lg:text-5xl') Consulta de comprobantes electronicos
      .flex-1
        .flex.items-center.my-7
          font-awesome-icon.fa-2x.mr-4(icon='fa fa-magnifying-glass-arrow-right')
          .flex.flex-col.leading-tight
            small.text-1xl.font-bold Sistema de consulta optimizado
            small.text-1xl para encontrar tu comprobante de manera mas rapida.
        .flex.items-center.my-7
          font-awesome-icon.fa-2x.mr-4(icon='fa fa-file-pdf')
          .flex.flex-col.leading-tight
            small.text-1xl.font-bold Previsualiza tu comprobante
            small.text-1xl electronico en dispositivos moviles
        .flex.items-center.my-7
          font-awesome-icon.fa-2x.mr-4(icon='fa fa-download')
          .flex.flex-col.leading-tight
            small.text-1xl.font-bold Descarga tu comprobante
            small.text-1xl electronico en formato PDF y XML con total seguridad
  .flex-1.w-full.h-screen.items-center.justify-center.flex-col.mx-auto.flex.bg-gray-100
    .w-full(
      class=" md:mt-0 sm:max-w-sm xl:p-0"
    )
      .p-6.space-y-4(class="md:space-y-6 sm:p-8",)
        .flex-1.flex.items-center.justify-center
          a
            img.w-60.h-20(src="logo_completo_datacont.svg", alt="datacont" v-if="empresa === 'datacont'")
            img.w-60.h-20(src="logo_completo_reprodata.svg", alt="reprodata" v-if="empresa === 'reprodata'")
        .space-y-4(class="md:space-y-6")
          .flex
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="tipo",
              ) Tipo de comprobante
              select.bg-gray-200.border.border-gray-300.text-gray-500.rounded-lg.block.w-full.placeholder-gray-300.font-bold#tipo(
                v-model="tipo",
                name="tipo",
                class="sm:text-xs focus:ring-datacont-500 focus:border-datacont-600 p-2.5   ",
                placeholder="seleccionar..."
              )
                option(value="01") FACTURA
                option(value="03") BOLETA
                option(value="07") NOTA DE CREDITO
                option(value="08") NOTA DE DEBITO
                option(value="09") GUIA REMISION
          .flex
            .flex-1.mr-4
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="folio",

              ) Folio
              input.bg-gray-200.border.border-gray-300.text-gray-500.rounded-lg.block.w-full.placeholder-gray-300.font-bold#folio(
                v-model="folio",
                type="text",
                name="folio",
                class="sm:text-xs focus:ring-datacont-500 focus:border-datacont-600 p-2.5",
                placeholder="F079"
              )
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="numero",

              ) Numero
              input.bg-gray-200.border.border-gray-300.text-gray-500.rounded-lg.block.w-full.placeholder-gray-300.font-bold#numero(
                v-model="numero",
                type="number",
                name="numero",
                class="sm:text-xs focus:ring-datacont-500 focus:border-datacont-600 p-2.5   ",
                placeholder="0004524"
              )
          .flex
            .flex-1.mr-4
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="fecha",

              ) Fecha de emisión
              input.bg-gray-200.border.border-gray-300.text-gray-500.rounded-lg.block.w-full.placeholder-gray-300.font-bold#fecha(
                v-model="fecha",
                type="date",
                name="fecha",
                class="sm:text-xs focus:ring-datacont-500 focus:border-datacont-600 p-2.5 ",
              )
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="monto",

              ) Importe total
              input.bg-gray-200.border.border-gray-300.text-gray-500.rounded-lg.block.w-full.placeholder-gray-300.font-bold#monto(
                v-model="monto",
                type="text",
                name="monto",
                class="sm:text-xs focus:ring-datacont-500 focus:border-datacont-600 p-2.5   ",
                placeholder="45257.01"
              )

          button.w-full.text-white.bg-gradient-to-r.from-datacont-400.via-datacont-500.to-datacont-600.shadow-lg.font-medium.rounded-lg.text-xs.px-5.text-center.mr-2.mb-2(
            class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-datacont-300  shadow-datacont-500/50  py-2.5"
            @click="fetchGetInvoice()"
          )
            | Buscar comprobante
</template>
<script>
import moment from "moment";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
import { apiGet, notificacion } from "../util/general";
export default defineComponent({
  name: "Dashboard_Search_Invoice",
  props: {
    company: {
      type   : String,
      default: "",
    },
  },
  setup({ company }) {
    let   router        = useRouter()
    let   empresaSelect = ref("datacont");
    let   empresa       = ref("");
    let   folio         = ref("F020");     // F010
    let   numero        = ref("53304");     // 3062
    let   tipo          = ref("01");   // 01
    let   fecha         = ref("2022-08-29");     // 20200804
    let   monto         = ref("41223.00");     // 31487.12
    let   isLoading     = ref(false);
    const empresas      = ref([
      {
        ruc        : '20100131359',
        name       : 'datacont',
        descripcion: 'DATACONT SAC'
      },
      {
        ruc        : '20100340438',
        name       : 'reprodata',
        descripcion: 'REPRODATA SAC'
      },
    ]);

    onMounted(() => {
      if (company && (company === 'datacont' || company === 'reprodata')) {
        empresaSelect.value = company
        empresa.value       = empresaSelect.value
      } else {
        localStorage.removeItem('empresaSelect')
      }
    })

    const fetchGetInvoice = async () => {
      try {
        isLoading.value = true;
        const payload = {
          empresa: empresa.value,
          folio  : folio.value,
          numero : numero.value,
          tipo   : tipo.value,
          fecha  : fecha.value
            ? moment(fecha.value, "YYYY-MM-DD").format("YYYYMMDD")
            : "",
          monto: monto.value,
        }

        const { data } = await apiGet(`/invoice/search`, payload);

        if (data.length) {
          if (data[0]?.PDF || data[0]?.XML) {
            localStorage.setItem('invoice', JSON.stringify(payload))
            localStorage.setItem('empresaSelect', empresaSelect.value)
            if (data[0].PDF) window.open(data[0].PDF, '_self')
            else if (data[0].XML) window.open(data[0].XML, '_self')
          } else notificacion('error', 'Error', 'El documento no cuenta con representacion grafica (pdf, xml)')
        } else notificacion('error', 'Error', 'Los datos ingresados no coinciden con ningun comprobante electronico')
      } catch (error) {
        notificacion('error', 'Error', 'Existen inconvenientes para realizar la consulta por favor vuelva a intentarlo')
      } finally {
        isLoading.value = false;
      }
    };

    const seleccionarEmpresa = (e) => {
      empresaSelect.value = e.name
      router.push(`/search-invoice?company=${empresaSelect.value}`)
    }

    const volverASeleccionarEmpresa = () => {
      empresaSelect.value = 'datacont'
      empresa.value = ''
      localStorage.removeItem('invoice')
      localStorage.removeItem('empresaSelect')
      router.push(`/search-invoice`)
    }

    const continuarConLaEmpresaSeleccionado = () => {
      if (!empresaSelect.value) {
        notificacion('error', 'Error', 'Seleccione alguna empresa para continuar')
      } else {
        router.push(`/search-invoice?company=${empresaSelect.value}`)
        empresa.value = empresaSelect.value
      }
    }

    return {
      isLoading,
      fetchGetInvoice,
      folio,
      numero,
      tipo,
      fecha,
      monto,
      empresa,
      empresas,
      empresaSelect,
      seleccionarEmpresa,
      continuarConLaEmpresaSeleccionado,
      volverASeleccionarEmpresa
    };
  },
});
  </script>
