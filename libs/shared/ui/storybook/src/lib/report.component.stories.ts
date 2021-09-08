import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReportComponent, ReportModule } from '@schaeffler/report';

import READMEMd from '../../../picture-card/README.md';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

export default {
  title: 'Report',
  component: ReportComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReportModule,
        MatButtonModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<ReportComponent>;

const props = {
  title: 'Report Title',
  subtitle: 'Report Subtitle',
  displayReport:
    'https://mountingmanager-cae.schaeffler.com/api/v1/bearing-calculation/body/8c8a9bb8c41745e9baf9200e656b0e05',
  downloadReport:
    'https://mountingmanager-cae.schaeffler.com/api/v1/bearing-calculation/pdf/8c8a9bb8c41745e9baf9200e656b0e05',
};

const Template: Story<ReportComponent> = (args: ReportComponent) => ({
  component: ReportComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  ...props,
};

const TemplateWithButtons: Story<ReportComponent> = (
  args: ReportComponent
) => ({
  component: ReportComponent,
  props: args,
  template: `
    <schaeffler-report
      [title]="title"
      [subtitle]="subtitle"
      [displayReport]="displayReport"
      [downloadReport]="downloadReport">
      <div class="flex flex-col md:flex-row">
          <a
          mat-raised-button
          color="primary"
          class="text-button uppercase flex-grow m-2"
          [href]="downloadReport"
          >
              Download Report
          </a>
          <button
          mat-button
          class="
            text-button uppercase text-primary flex-grow m-2
          ">
              Do Something Else
          </button>
      </div>
    </schaeffler-report>
  `,
});

export const WithButtons = TemplateWithButtons.bind({});
WithButtons.args = {
  ...props,
};
