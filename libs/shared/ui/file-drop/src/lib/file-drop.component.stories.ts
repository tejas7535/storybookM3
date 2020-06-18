import { CommonModule } from '@angular/common';

import { action } from '@storybook/addon-actions';
import { array, boolean } from '@storybook/addon-knobs';

import READMEMd from '../../README.md';
import { FileDropComponent } from './file-drop.component';
import { FileDropModule } from './file-drop.module';

const moduleMetadata = {
  imports: [FileDropModule, CommonModule],
};

const baseComponent = {
  moduleMetadata,
  component: FileDropComponent,
  filesAdded: action('filesAdded'),
  fileOver: action('fileOver'),
  fileLeave: action('fileLeave'),
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'File Drop',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
});

export const multiple = () => ({
  ...baseComponent,
  props: {
    multiple: boolean('multiple', true),
  },
});

export const disabled = () => ({
  ...baseComponent,
  props: {
    disabled: boolean('disabled', true),
  },
});

export const acceptSpecificFileTypes = () => ({
  ...baseComponent,
  props: {
    accept: array('accept', ['.docx', '.pdf', '.txt']),
  },
});
