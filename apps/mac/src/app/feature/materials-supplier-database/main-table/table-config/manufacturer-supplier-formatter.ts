export const manufacturerSupplierFormatter = (params: any) =>
  params.value === 1
    ? 'Manufacturer'
    : // eslint-disable-next-line unicorn/no-nested-ternary
    params.value === 0
    ? 'Supplier'
    : undefined;
