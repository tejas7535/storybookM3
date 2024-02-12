import { MatIconModule } from '@angular/material/icon';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from '../../../../../tag/README.md';
import { TagComponent } from '@schaeffler/tag';
import { MatTooltipModule } from '@angular/material/tooltip';

export default {
  title: 'Atomic/Atoms/Tag',
  decorators: [
    moduleMetadata({
      imports: [TagComponent, MatIconModule, MatTooltipModule],
    }),
    withDesign,
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.InProgress],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=707%3A9',
    },
  },
} as Meta;

const Template: StoryFn = (args) => ({
  props: args,
  template: `
    <section>
    <div class=" flex flex-row gap-6 py-3">
        <schaeffler-tag [value]="'Info tag'" type="info" ></schaeffler-tag>
        <schaeffler-tag [value]="'Info tag with border'" type="info" withBorder="true" > </schaeffler-tag>
        
        <schaeffler-tag [value]="'Info tag small'" type="info" [size] ="'small'"></schaeffler-tag>
        <schaeffler-tag [value]="'Info tag with border small'" type="info" withBorder="true" [size] ="'small'"> </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
      <schaeffler-tag [value]="'Success tag'" type="success" withDot="false"></schaeffler-tag>
      <schaeffler-tag [value]="'Success tag with border'" type="success" withBorder="true" withDot="false"> </schaeffler-tag>

      <schaeffler-tag [value]="'Success tag small'" type="success" withDot="false" [size] ="'small'"></schaeffler-tag>
      <schaeffler-tag [value]="'Success tag with border small'" type="success" withBorder="true" withDot="false" [size] ="'small'"> </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
        <schaeffler-tag [value]="'Warning tag'" type="warning" withDot="false"></schaeffler-tag>
        <schaeffler-tag [value]="'Warning tag with border'" type="warning" withBorder="true" withDot="false"> </schaeffler-tag>

        <schaeffler-tag [value]="'Warning tag small'" type="warning" withDot="false" [size] ="'small'"></schaeffler-tag>
        <schaeffler-tag [value]="'Warning tag with border small'" type="warning" withBorder="true" withDot="false" [size] ="'small'"> </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
      <schaeffler-tag [value]="'Error tag'" type="error"></schaeffler-tag>
      <schaeffler-tag [value]="'Error tag with border'" type="error" withBorder="true"> </schaeffler-tag>

      <schaeffler-tag [value]="'Error tag small'" type="error" [size] ="'small'"></schaeffler-tag>
      <schaeffler-tag [value]="'Error tag with border small'" type="error" withBorder="true" [size] ="'small'"> </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
      <schaeffler-tag [value]="'Neutral tag'" type="neutral"></schaeffler-tag>
      <schaeffler-tag [value]="'Neutral tag with border'" type="neutral" withBorder="true"> </schaeffler-tag>

      <schaeffler-tag [value]="'Neutral tag'" type="neutral" [size] ="'small'"></schaeffler-tag>
      <schaeffler-tag [value]="'Neutral tag with border'" type="neutral" withBorder="true" [size] ="'small'"> </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
    <schaeffler-tag [value]="'Primary tag'" type="primary"></schaeffler-tag>
    <schaeffler-tag [value]="'Primary tag with border'" type="primary" withBorder="true"> </schaeffler-tag>

    <schaeffler-tag [value]="'Primary tag'" type="primary" [size] ="'small'"></schaeffler-tag>
    <schaeffler-tag [value]="'Primary tag with border'" type="primary" withBorder="true" [size] ="'small'"> </schaeffler-tag>
  </div>

    <div class="flex flex-row gap-6 py-3">
      <schaeffler-tag [value]="'Category 1 tag'" type="category1"></schaeffler-tag>
      <schaeffler-tag [value]="'Category 1 tag with border'" type="category1" withBorder="true"> </schaeffler-tag>

      <schaeffler-tag [value]="'Category 1 tag'" type="category1" [size] ="'small'"></schaeffler-tag>
      <schaeffler-tag [value]="'Category 1 tag with border'" type="category1" withBorder="true" [size] ="'small'" > </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
      <schaeffler-tag [value]="'Category 2 tag'" type="category2"></schaeffler-tag>
      <schaeffler-tag [value]="'Category 2 tag with border'" type="category2" withBorder="true"> </schaeffler-tag>

      <schaeffler-tag [value]="'Category 2 tag'" type="category2" [size] ="'small'"></schaeffler-tag>
      <schaeffler-tag [value]="'Category 2 tag with border'" type="category2" withBorder="true" [size] ="'small'"> </schaeffler-tag>
    </div>

    <div class="flex flex-row gap-6 py-3">
      <schaeffler-tag [value]="'Category 3 tag'" type="category3"></schaeffler-tag>
      <schaeffler-tag [value]="'Category 3 tag with border'" type="category3" withBorder="true"> </schaeffler-tag>

      <schaeffler-tag [value]="'Category 3 tag'" type="category3" [size] ="'small'"></schaeffler-tag>
      <schaeffler-tag [value]="'Category 3 tag with border'" type="category3" withBorder="true" [size] ="'small'"> </schaeffler-tag>
    </div>

    <h6>Custom tags</h6>
    <div class="flex flex-row gap-6 py-3">

    <schaeffler-tag [value]="'Info tag without dot'" type="info" [withDot]="false" withBorder="true"></schaeffler-tag>

    <schaeffler-tag [value]="'Info tag with icon'" type="info" withBorder="true" > <mat-icon
    class="cursor-help !h-4 !text-[16px] !w-5 !pl-1 text-icon-info"
    [inline]="inline"
    #tooltipRef="matTooltip"
    [matTooltip]="'text'"
    [matTooltipPosition]="tooltipPosition"
    [matTooltipClass]="tooltipClass"
    (click)="tooltipRef.toggle()"
  >
    info_outline
  </mat-icon> </schaeffler-tag>

  <schaeffler-tag [value]="'Tag with custom classes'" type="info" withBorder="true" [styleClass]="'uppercase font-bold border '" > 
  <mat-icon      
  [color]="'secondary'"
  class="cursor-help order-first mr-1 !h-4 !text-[16px] !w-5"
  [inline]="inline"
  #tooltipRef="matTooltip"
  [matTooltip]="'text'"
  [matTooltipPosition]="tooltipPosition"
  [matTooltipClass]="tooltipClass"
  (click)="tooltipRef.toggle()"
>
  tune
</mat-icon> </schaeffler-tag>

  
    </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  value: 'tag Label',
  withDot: true,
  size: {
    options: ['small', 'default'],
    default: 'default',
    control: 'select',
  },
  type: {
    options: [
      'info',
      'warning',
      'error',
      'success',
      'neutral',
      'primary',
      'category1',
      'category2',
      'category3',
    ],
    control: 'select',
  },
};
