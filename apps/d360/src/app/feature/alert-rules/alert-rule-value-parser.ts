import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';

export const valueParserForSelectableOptions =
  (options: SelectableValue[]) =>
  (params: any): string => {
    const value = options.find(
      (option) =>
        option.id === params.newValue ||
        (option.text === params.newValue && params.newValue !== '')
    )?.id;

    return value === undefined ? params.newValue : value;
  };
