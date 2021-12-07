import { FormControl, FormGroup } from '@angular/forms';

import { ChartState } from '../chart.state';
/**
 * dynamically generates a form group from a passed initial state
 * @param _initialState a state of a display chart
 * @returns a FormGroup used by tree components
 */
export const getFormGroupFromDisplay = (
  _initialState: ChartState<any>
): FormGroup =>
  new FormGroup(
    // eslint-disable-next-line unicorn/no-array-reduce
    Object.keys(_initialState.display).reduce<any>((acc, curr) => {
      acc[curr] = new FormControl('');

      return acc;
    }, {})
  );
