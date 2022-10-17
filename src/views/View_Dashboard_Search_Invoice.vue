<template lang="pug">
.relative(v-if="!empresa")
  .flex-1.w-full.h-screen.text-white.antialiased.relative(style="background-image: url('wallpaper_start.jpg');background-repeat: no-repat;background-size: cover;background-blend-mode: multiply")
  section.w-full.h-screen.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.h-screen.opacity-90.absolute.top-0
  section.absolute.top-0.w-full.h-screen.items-center.justify-center.flex-col.flex.px-4
    h5.tracking-tight.text-white.my-20.font-extrabold(class='text-5xl '  ) Consulta de comprobantes de pago
    .p-6.w-full.max-w-sm.bg-white.rounded-lg.border.shadow-md(class='sm:p-6' )
      p.text-xs.font-normal.text-gray-500(class='') Selecione una empresa para poder iniciar el proceso de consulta de comprobantes de pago.
      ul.my-8.space-y-4
        li(v-for="(e, index) in empresas" :key="index")
          a.flex.items-center.p-3.text-base.text-gray-900.bg-gray-100.rounded-lg.group.cursor-pointer(@click="seleccionarEmpresa(e)" class='hover:bg-gray-100 hover:shadow  ')
            img.w-8.h-8.mr-2(:src="`logo_${e.name}.png`", alt="datacont")
            .flex.flex-col.flex-1
              span.ml-3.whitespace-nowrap.text-gray-600.font-bold {{e.descripcion}}
              small.ml-3.whitespace-nowrap.text-gray-300 {{e.ruc}}
            font-awesome-icon.text-2xl.inline-flex.items-center.justify-center(icon='fa fa-check-circle' :class="empresaSelect === e.name ? 'text-green-400' : 'text-gray-200'" )
      div
        button.w-full.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-medium.rounded-lg.text-xs.px-5.text-center.mr-2.mb-2(
          class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300  shadow-red-500/50  py-2.5",
          @click="continuarConLaEmpresaSeleccionado()"
        ) continuar
        a.inline-flex.items-center.text-xs.font-normal.text-gray-500.cursor-pointer( class='hover:underline' )
          svg.mr-2.w-3.h-3(aria-hidden='true' focusable='false' data-prefix='far' data-icon='question-circle' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512')
            path(fill='currentColor' d='M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z')
          |  No encuentro la empresa que estoy buscando
section.flex(v-else)
  .flex-1.w-full.h-screen.text-white.antialiased.relative(style="background-image: url('https://img.freepik.com/free-photo/serious-ethnic-female-ceo-wears-round-spectacles-tries-reach-decision-with-colleague-via-cell-phone_273609-44870.jpg?w=1380&t=st=1665582242~exp=1665582842~hmac=9552239dda1a9df9eaa4fbec90a02ef408c27dbb854c19e9162cadb0c54fae77');background-repeat: no-repat;background-size: cover;background-blend-mode: multiply")
    .bg-gradient-to-r.from-red-400.via-red-500.to-red-600.h-full.flex.items-center.justify-center.opacity-90(class="md:px-20 lg:px-40")
      .flex.flex-col
        .flex-1
          h5.text-5xl.tracking-tight.text-white.my-20.font-extrabold.tracking-tight Consulta de comprobantes de pago
        .flex-1
          .flex.items-center.my-7
            font-awesome-icon.fa-2x.mr-4(icon='fa fa-magnifying-glass-arrow-right')
            .flex.flex-col
              small.text-1xl.font-semibold Sistema de consulta optimizado
              small.text-1xl para encontrar tu comprobante de manera mas rapida.
          .flex.items-center.my-7
            font-awesome-icon.fa-2x.mr-4(icon='fa fa-file-pdf')
            .flex.flex-col
              small.text-1xl.font-semibold Previsualiza tu comprobante
              small.text-1xl electronico en dispositivos moviles
          .flex.items-center.my-7
            font-awesome-icon.fa-2x.mr-4(icon='fa fa-download')
            .flex.flex-col
              small.text-1xl.font-semibold Descarga tu comprobante
              small.text-1xl electronico en formato PDF y XML con total seguridad
  .flex-1.w-full.h-screen.items-center.justify-center.flex-col.mx-auto.flex
    .w-full(
      class=" md:mt-0 sm:max-w-sm xl:p-0  -gray-700"
    )
      .p-6.space-y-4(class="md:space-y-6 sm:p-8",)
        .flex-1.flex.items-center.justify-center
          a(
            href="#",
            class=""
          )
            img.w-60.h-20(src="logo_completo_datacont.svg", alt="datacont" v-if="empresa === 'datacont'")
            img.w-60.h-20(src="logo_completo_reprodata.svg", alt="reprodata" v-if="empresa === 'reprodata'")
        .space-y-4(class="md:space-y-6")
          .flex
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="tipo",
              ) Tipo de comprobante
              select.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#tipo(
                v-model="tipo",
                name="tipo",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5   ",
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
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#folio(
                v-model="folio",
                type="text",
                name="folio",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5",
                placeholder="F079"
              )
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="numero",

              ) Numero
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#numero(
                v-model="numero",
                type="number",
                name="numero",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5   ",
                placeholder="0004524"
              )
          .flex
            .flex-1.mr-4
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="fecha",

              ) Fecha de emisión
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#fecha(
                v-model="fecha",
                type="date",
                name="fecha",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5   ",
                placeholder="09/10/2022"
              )
            .flex-1
              label.block.mb-2.text-xs.font-medium.text-gray-600(
                for="monto",

              ) Importe total
              input.bg-gray-50.border.border-gray-200.text-gray-900.rounded-lg.block.w-full.placeholder-gray-300#monto(
                v-model="monto",
                type="text",
                name="monto",
                class="sm:text-xs focus:ring-primary-600 focus:border-primary-600 p-2.5   ",
                placeholder="45257.01"
              )

          button.w-full.text-white.bg-gradient-to-r.from-red-400.via-red-500.to-red-600.shadow-lg.font-medium.rounded-lg.text-xs.px-5.text-center.mr-2.mb-2(
            class="hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300  shadow-red-500/50  py-2.5",
            @click="fetchGetInvoice()"
          ) Buscar comprobante
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
    let   empresaSelect = ref("");
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
        ruc        : '20100131359',
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

    const continuarConLaEmpresaSeleccionado = () => {
      if (!empresaSelect.value) {
        notificacion('error', 'Error', 'Seleccione alguna empresa para continuar')
      } else {
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
      continuarConLaEmpresaSeleccionado
    };
  },
});
</script>
