import { CommonModule } from '@angular/common';

import { FileDropComponent, FileDropModule } from '@schaeffler/file-drop';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../dropdown-input/README.md';

export default {
  title: 'Components/File Drop',
  component: FileDropComponent,
  decorators: [
    moduleMetadata({
      imports: [FileDropModule, CommonModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<FileDropComponent>;

const Template: Story<FileDropComponent> = (args: FileDropComponent) => ({
  component: FileDropComponent,
  props: args,
});

export const Primary = Template.bind({});

export const Multiple = Template.bind({});
Multiple.args = {
  multiple: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const AcceptSpecificFileTypes = Template.bind({});
AcceptSpecificFileTypes.args = {
  accept: ['.docx', '.pdf', '.txt'],
};
