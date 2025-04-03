import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';

export const parseSelectableValueIfPossible =
  (options: SelectableValue[]) =>
  (value: any): string => {
    const clean: (input: string) => string = (input: string): string =>
      (input || '').includes('\u00A0')
        ? input.replaceAll('\u00A0', ' ')
        : input;

    if (value) {
      // eslint-disable-next-line no-param-reassign
      value = clean(value.trim());
    }

    const found = options.find(
      (option) =>
        clean(option.id || '').trim() === value ||
        (clean(option.text || '').trim() === value && value !== '')
    )?.id;

    return found === undefined ? value : found;
  };
