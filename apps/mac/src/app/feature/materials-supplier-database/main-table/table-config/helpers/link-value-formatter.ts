import { ValueFormatterParams } from 'ag-grid-community';

export const MATERIALSTANDARD_LINK_FORMATTER = (
  params: ValueFormatterParams
) => {
  const val = params.value?.replace(/\s/g, '') || '';

  const RE_DIN = /^DIN(EN)?\d+(-\d)?$/;
  const RE_SSTD = /^S\d+(-\d+)?$/;
  const RE_0812 = /^0_812_\w+$/;

  if (RE_SSTD.test(val) || RE_0812.test(val)) {
    return `${params.value}|http://sapdms.schaeffler.com:8080/jsf/dd.faces?sap=EP4&dokar=ASI&doknr=${val}&doktl=EN`;
  }
  if (RE_DIN.test(val)) {
    return `${params.value}|http://sapdms.schaeffler.com:8080/jsf/dd.faces?sap=EP1&dokar=ASP&doknr=${val}&doktl=EN`;
  }

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined;
};

export const MATERIALSTOFFID_LINK_FORMATTER = (params: ValueFormatterParams) =>
  params.value
    ? `${params.value}|https://wiamp.schaeffler.com:8443/rdc/de.wiam.ext.schaeffler.rdc/sheets/raw?parameters=x[0,0,0[i1267680281-1673865505844-76_xEN3${params.data.materialStandardWiamId}-1011`
    : undefined;
