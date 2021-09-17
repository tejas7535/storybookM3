import { CommonModule } from '@angular/common';
import {
  HorizontalSeparatorComponent,
  HorizontalSeparatorModule,
} from '@schaeffler/horizontal-separator';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import READMEMd from '../../../horizontal-separator/README.md';

export default {
  title: 'Components/Horizontal separator',
  component: HorizontalSeparatorComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, HorizontalSeparatorModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<HorizontalSeparatorComponent>;

const Template: Story<HorizontalSeparatorComponent> = (
  args: HorizontalSeparatorComponent
) => ({
  component: HorizontalSeparatorComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  text: 'Sample Separator Text',
  alwaysCentered: true,
};
