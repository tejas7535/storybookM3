export const findProperty = <T>(formValue: any, property: string): T => {
  const key = property as keyof typeof formValue;

  return formValue[key] as T;
};

export const mapProperty = <T = any, K = any>(
  formValue: any,
  property: string,
  fkt: (val: T) => K
): K => {
  const val = findProperty<T>(formValue, property);

  return val ? fkt(val) : undefined;
};
