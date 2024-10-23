import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

// needed to display leading zeros
export const DATE_FORMATS = {
  parse: { ...MAT_MOMENT_DATE_FORMATS.parse },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'L',
  },
};
