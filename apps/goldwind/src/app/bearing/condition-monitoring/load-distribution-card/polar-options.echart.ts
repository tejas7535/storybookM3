/* istanbul ignore file */
import { EChartsOption } from 'echarts';

export const config: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    formatter: (d: any) =>
      /* istanbul ignore next */
      d[2]?.value || d[3]?.value
        ? getBearingAndLSPFormat(d)
        : getBearingOnlyFormat(d),
  },
  polar: {},
  yAxis: {
    show: false,
  },
  angleAxis: {
    type: 'category',
    data: Array.from({ length: 123 }).map((_v, i) => String(i + 1)),
    min: 1,
    clockwise: true,
    splitLine: {
      show: false,
    },
  },
  radiusAxis: {
    type: 'value',
  },
};

export const getBearingAndLSPFormat = (
  d: any
): string | HTMLElement | HTMLElement[] =>
  `
<div class="flex flex-col">
  <p>Roller ${d[0].name}<p>
  <hr class="text-muted" />
  <div class="grid grid-cols-2 space-between gap-2 my-2">
    <span>RE</span>
    <span>${d[0].value.toFixed(2)} kN</span>

    <span>NRE</span>
    <span>${d[1].value.toFixed(2)} kN</span>

    <span>LSP #${
      reformatLSPkey(d[3]?.data?.key) || reformatLSPkey(d[2]?.data?.key)
    }</span>
    <span>${
      d[3]?.value?.toFixed(2) || d[2]?.value?.toFixed(2) || 'n.A.'
    } kN</span>

</div>`;

export const getBearingOnlyFormat = (
  d: any
): string | HTMLElement | HTMLElement[] => `
    <div class="flex flex-col">
      <p>Bearing ${d[0].name}<p>
      <hr class="text-muted" />
      <div class="grid grid-cols-2 space-between gap-2 my-2">
        <span>Rotor Load</span>
        <span>${d[0].value.toFixed(2)} kN</span>

        <span>Generator Load</span>
        <span>${d[1].value.toFixed(2)} kN</span>

    </div>`;

export const reformatLSPkey = (keystring: string) =>
  keystring ? keystring.match(/lsp(\d\d)Strain/)[1] : '';
