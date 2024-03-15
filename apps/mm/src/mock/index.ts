import { BearinxDialogDescription } from '@caeonline/dynamic-forms';

import { environment } from '../environments/environment';
import * as dialog from './dialog.json';

const envDialogString = JSON.stringify(dialog).replaceAll(
  'OPTIONS_URL',
  environment.baseUrl
);

const envDialog = JSON.parse(envDialogString);

export const DIALOG = (envDialog as any).default as BearinxDialogDescription;
