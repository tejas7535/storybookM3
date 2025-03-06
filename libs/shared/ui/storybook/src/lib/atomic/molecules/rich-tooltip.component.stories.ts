import { Component, Input } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RichTooltipComponent } from '@schaeffler/rich-tooltip';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from '../../../../../rich-tooltip/README.md';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rich-tooltip-component-example',
  template: `
    <div class="flex ml-1 flex-shrink-0">
      <p>Hover over the icon to see tooltip</p>
      <mat-icon
        cdkOverlayOrigin
        #infoIcon="cdkOverlayOrigin"
        [inline]="true"
        color="inherit"
        class="cursor-help ml-3"
        >info_outline</mat-icon
      >
    </div>

    <schaeffler-rich-tooltip
      [tooltipOrigin]="infoIcon"
      [tooltipShowDelay]="tooltipShowDelayValue"
      [tooltipHideDelay]="tooltipHideDelayValue"
    >
      {{ 'Some Rich tooltip information Text' }}
      <a class="hover:cursor-pointer hover:underline ml-1"
        >{{ 'Read More'
        }}<mat-icon [inline]="true" class="ml-0.5 !h-3"
          >open_in_new</mat-icon
        ></a
      >
    </schaeffler-rich-tooltip>

    <div class="flex ml-1 flex-shrink-0 pt-3">
      <p class="cursor-help" cdkOverlayOrigin #infoText="cdkOverlayOrigin">
        Hover over the text to see tooltip
      </p>
    </div>

    <schaeffler-rich-tooltip
      [tooltipOrigin]="infoText"
      [tooltipShowDelay]="tooltipShowDelayValue"
      [tooltipHideDelay]="tooltipHideDelayValue"
    >
      {{ 'Some Rich tooltip information Text' }}
      <a class="hover:cursor-pointer hover:underline ml-1"
        >{{ 'Read More'
        }}<mat-icon [inline]="true" class="ml-0.5 !h-3"
          >open_in_new</mat-icon
        ></a
      >
    </schaeffler-rich-tooltip>
  `,
  standalone: false,
})
class RichTooltipExampleComponent {
  public tooltipOrigin = 'referenceToTriggerElement';
  public tooltipShowDelayValue = 200;
  public tooltipHideDelayValue = 200;

  @Input() public set tooltipShowDelay(value: number) {
    this.tooltipShowDelayValue = value;
  }
  @Input() public set tooltipHideDelay(value: number) {
    this.tooltipHideDelayValue = value;
  }
}

export default {
  title: 'Atomic/Molecules/Rich Tooltip',
  component: RichTooltipExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [RichTooltipComponent, MatIconModule, CdkOverlayOrigin],
    }),
    withDesign,
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.NeedsRevision],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=749%3A21',
    },
  },
} as Meta<RichTooltipExampleComponent>;

const Template: StoryFn<RichTooltipExampleComponent> = (
  args: RichTooltipExampleComponent
) => ({
  component: RichTooltipExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  tooltipOrigin: 'referenceToTriggerElement',
  tooltipShowDelay: 200,
  tooltipHideDelay: 200,
};
