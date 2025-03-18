import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { MatIconModule } from '@angular/material/icon';
import READMEMd from './color/README.md';
import { BackgroundColorDirective } from './color/background-color.directive';
import { Component, Input, OnInit } from '@angular/core';
import { TextColorDirective } from './color/text-color.directive';
import { BorderColorDirective } from './color/border-color.directive';
const colors = require('../../../../../styles/src/lib/tailwind/colors');

@Component({
  selector: 'color-component-example',
  template: `
    <section class="bg-surface p-4">
      <h4 class="text-on-surface text-h6 p-4 ">{{ m3SectionTitle }}</h4>
      <p class="text-on-surface p-2 ">
        Colors based of the M3 color palette. All colors are available with
        prefixes: 'text-', 'bg-' and 'border-' eg. bg-primary for container and
        text-on-primary for text color.
      </p>

      <div
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:gap-2 lg:grid-cols-4 "
      >
        <!-- Primary colors-->
        <div class="flex flex-col gap-2">
          <div class="bg-primary h-10 p-3">
            <p
              class="text-on-primary"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-primary p-3">
            <p
              class="text-primary"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-primary-container h-20 p-3">
            <p
              class="text-on-primary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-primary-container h-20 p-3">
            <p
              class="text-primary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="grid grid-cols-2 h-fit">
            <div class="bg-primary-fixed h-full p-3">
              <p
                class="text-on-primary-fixed"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-primary-fixed-dim h-full p-3">
              <p
                class="text-on-primary-fixed"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>
          <div class="bg-on-primary-fixed h-fit p-3">
            <p
              class="text-primary-fixed"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-on-primary-fixed-variant h-20 p-3">
            <p
              class="text-primary-fixed-dim"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-surface-dim h-fit p-3">
            <p
              class="text-on-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="grid grid-cols-2 h-fit">
            <div class="bg-surface-container-lowest h-full p-3">
              <p
                class="text-on-surface"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-surface-container-low h-full p-3">
              <p
                class="text-on-surface"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>

          <div class="grid grid-cols-2 h-">
            <div class="bg-on-surface h-full p-3">
              <p
                class="text-surface-container-lowest"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-on-surface-variant h-full p-3">
              <p
                class="text-surface-container-lowest"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>
        </div>

        <!-- Secondary colors-->
        <div class="flex flex-col gap-2">
          <div class="bg-secondary h-10 p-3">
            <p
              class="text-on-secondary"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-secondary p-3">
            <p
              class="text-secondary"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-secondary-container h-20 p-3">
            <p
              class="text-on-secondary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-secondary-container h-20 p-3">
            <p
              class="text-secondary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="grid grid-cols-2 h-fit">
            <div class="bg-secondary-fixed h-full p-3">
              <p
                class="text-on-secondary-fixed"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-secondary-fixed-dim h-full p-3">
              <p
                class="text-on-secondary-fixed"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>
          <div class="bg-on-secondary-fixed h-fit p-3">
            <p
              class="text-secondary-fixed"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-on-secondary-fixed-variant h-20 p-3">
            <p
              class="text-secondary-fixed-dim"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-surface h-10 p-3">
            <p
              class="text-on-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="grid grid-cols-2 h-fit">
            <div class="bg-surface-container h-full p-3">
              <p
                class="text-on-surface"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-surface-container-high h-full p-3">
              <p
                class="text-on-surface"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>
          <div class="bg-outline h-20 p-3">
            <p
              class="text-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>

        <!-- Tertiary colors -->
        <div class="flex flex-col gap-2">
          <div class="bg-tertiary h-10 p-3">
            <p
              class="text-on-tertiary"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-tertiary p-3">
            <p
              class="text-tertiary"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-tertiary-container h-20 p-3">
            <p
              class="text-on-tertiary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-tertiary-container h-20 p-3">
            <p
              class="text-tertiary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="grid grid-cols-2 h-20">
            <div class="bg-tertiary-fixed h-full p-3">
              <p
                class="text-on-tertiary-fixed"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-tertiary-fixed-dim h-full p-3">
              <p
                class="text-on-tertiary-fixed"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>
          <div class="bg-on-tertiary-fixed h-fit p-3">
            <p
              class="text-tertiary-fixed"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-on-tertiary-fixed-variant h-20 p-3">
            <p
              class="text-tertiary-fixed-dim"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-surface-bright h-fit p-3">
            <p
              class="text-on-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-surface-container-highest h-20 p-3">
            <p
              class="text-on-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-outline-variant h-20 p-3">
            <p
              class="text-inverse-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>

        <!-- Error colors-->
        <div class="flex flex-col gap-2">
          <div class="bg-error h-10 p-3">
            <p
              class="text-on-error"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-error p-3">
            <p
              class="text-error"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-error-container h-fit  p-3">
            <p
              class="text-on-error-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-on-error-container h-fit p-3">
            <p
              class="text-error-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div
            class="bg-surface-variant h-fit p-3 mt-[9.5rem] border-border border"
          >
            <p
              class="text-on-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-inverse-surface h-20 p-3 ">
            <p
              class="text-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-inverse-on-surface h-fit p-3">
            <p
              class="text-inverse-surface"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-inverse-primary h-20 p-3">
            <p
              class="text-on-primary-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="grid grid-cols-2 h-20 gap-2">
            <div class="bg-scrim h-full p-3">
              <p
                class="text-white"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
            <div class="bg-shadow h-full p-3">
              <p
                class="text-white"
                colorBackgroundText
                [isDarkModeEnabled]="isDarkMode"
              ></p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-surface p-4">
      <h4 class="text-on-surface text-h6 p-4 ">Special colors</h4>
      <div
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:gap-2 lg:grid-cols-3"
      >
        <div class="flex flex-col gap-2">
          <div class="bg-warning h-10 p-3">
            <p
              class="text-surface-container-lowest"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-warning-container p-3">
            <p
              class="text-on-warning-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="bg-info h-10 p-3">
            <p
              class="text-surface-container-lowest"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-info-container p-3">
            <p
              class="text-on-info-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="bg-success h-10 p-3">
            <p
              class="text-success-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-success-container p-3">
            <p
              class="text-on-success-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="bg-category-1 h-10 p-3">
            <p
              class="text-surface-container-lowest"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>

          <div class="bg-category-1-container  p-3">
            <p
              class="text-on-category-1-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="bg-category-2 h-10 p-3">
            <p
              class="text-surface-container-lowest"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-category-2-container  p-3">
            <p
              class="text-on-category-2-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="bg-category-3 h-10 p-3">
            <p
              class="text-surface-container-lowest"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
          <div class="bg-category-3-container p-3">
            <p
              class="text-on-category-3-container"
              colorBackgroundText
              [isDarkModeEnabled]="isDarkMode"
            ></p>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-surface p-4">
      <h4 class="text-on-surface text-h6 p-4 ">Special text colors</h4>
      <div class="flex flex-wrap flex-col sm:flex-row gap-4">
        <p
          class="text-on-warning-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>

        <p
          class="text-on-info-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>

        <p
          class="text-on-success-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>
        <p
          class="text-on-error-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>
        <p
          class="text-on-category-1-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>

        <p
          class="text-on-category-2-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>
        <p
          class="text-on-category-3-container"
          colorText
          [isDarkModeEnabled]="isDarkMode"
        ></p>

        <p class="text-link" colorText [isDarkModeEnabled]="isDarkMode"></p>
      </div>

      <h4 class="text-on-surface text-h6 p-4 ">Text emphasis colors</h4>
      <div class="bg-surface flex flex-col sm:flex-row flex-wrap p-4 gap-6">
        <p
          class="text-low-emphasis h-10"
          colorText
          [isDarkModeEnabled]="isDarkMode"
          [withRgbValue]="true"
        ></p>
        <p
          class="text-medium-emphasis h-10"
          colorText
          [isDarkModeEnabled]="isDarkMode"
          [withRgbValue]="true"
        ></p>
        <p
          class="text-high-emphasis h-10"
          colorText
          [isDarkModeEnabled]="isDarkMode"
          [withRgbValue]="true"
        ></p>
      </div>
      <h4 class="text-on-surface text-h6 p-4 ">Special border colors</h4>
      <div
        class="flex flex-wrap flex-col sm:flex-row gap-4 mb-1 text-on-surface "
      >
        <div
          class="border-info content-center p-1 mat-elevation-z0  border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
        <div
          class="border-success content-center p-1 mat-elevation-z0  border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
        <div
          class="border-warning content-center p-1 mat-elevation-z0 border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
        <div
          class="border-error content-center p-1 mat-elevation-z0 border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
        <div
          class="border-category-1 content-center p-1 mat-elevation-z0 border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
        <div
          class="border-category-2 content-center p-1 mat-elevation-z0 border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
        <div
          class="border-category-3 content-center p-1 mat-elevation-z0 border-4 h-20"
          colorBorder
          [isDarkModeEnabled]="isDarkMode"
        ></div>
      </div>
    </section>
    <section class="bg-background-dark p-4">
      <h3>Colors below are m2 legacy colors</h3>
      <h4>Foundational colors</h4>
      <div class="mat-elevation-z0 bg-white">
        <div class="p-4 pt-[60px]">bg-white {{ colors.white }}</div>
      </div>
      <div class="mat-elevation-z0 bg-disabled">
        <div class="p-4 pt-[60px]">bg-disabled {{ colors.disabled }}</div>
      </div>
      <div class="mat-elevation-z0 bg-inactive">
        <div class="p-4 pt-[60px]">bg-inactive {{ colors.inactive }}</div>
      </div>
      <div class="mat-elevation-z0 bg-active text-white-low-emphasis">
        <div class="p-4 pt-[60px]">bg-active {{ colors.active }}</div>
      </div>
      <div class="mat-elevation-z0 bg-default">
        <div class="p-4 pt-[60px]">bg-default {{ colors.default }}</div>
      </div>

      <h4>Text colors</h4>
      <div class="mat-elevation-z0 text-white-low-emphasis bg-secondary-900">
        <div class="p-4 pt-[60px]">
          text-white-low-emphasis {{ colors['white-low-emphasis'] }}
        </div>
      </div>
      <div class="mat-elevation-z0 text-white-medium-emphasis bg-secondary-900">
        <div class="p-4 pt-[60px]">
          text-white-medium-emphasis {{ colors['white-medium-emphasis'] }}
        </div>
      </div>
      <div class="mat-elevation-z0 text-white-high-emphasis bg-secondary-900">
        <div class="p-4 pt-[60px]">
          text-white-high-emphasis {{ colors['white-high-emphasis'] }}
        </div>
      </div>

      <h4 class="mt-20">Functional Text Colors</h4>
      <div
        class="mat-elevation-z0 bg-secondary-legacy flex flex-row justify-between"
      >
        <div class="p-4 pt-[60px] text-error">
          text-error {{ colors['text-error'] }}
        </div>
      </div>

      <section class="bg-surface p-4">
        <h4 class="mt-20 text-on-surface">Text Icon Colors</h4>
        <div class="mat-elevation-z0 ">
          <div class="p-4 pt-[60px] flex gap-4 text-icon-link">
            <mat-icon>link</mat-icon>
            <span
              class="text-icon-link"
              colorText
              [isDarkModeEnabled]="isDarkMode"
            >
            </span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-success">
            <mat-icon>done</mat-icon>
            <span
              class="text-icon-success"
              colorText
              [isDarkModeEnabled]="isDarkMode"
            >
            </span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-info">
            <mat-icon>info</mat-icon>
            <span
              class="text-icon-info"
              colorText
              [isDarkModeEnabled]="isDarkMode"
            >
            </span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-warning">
            <mat-icon>warning</mat-icon>
            <span
              class="text-icon-warning"
              colorText
              [isDarkModeEnabled]="isDarkMode"
            >
            </span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-error">
            <mat-icon>error</mat-icon>
            <span
              class="text-icon-error"
              colorText
              [isDarkModeEnabled]="isDarkMode"
            >
            </span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-disabled">
            <mat-icon>edit-off</mat-icon>
            <span>text-icon-disabled</span>
            <span>{{ colors.disabled }}</span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-inactive">
            <mat-icon>toggle_off</mat-icon>
            <span>text-icon-inactive</span>
            <span>{{ colors.inactive }}</span>
          </div>
          <div class="p-4 pt-[60px] flex gap-4 text-icon-active">
            <mat-icon>toggle_on</mat-icon>
            <span>text-icon-active</span>
            <span>{{ colors.active }}</span>
          </div>
        </div>
      </section>

      <h4 class="mt-20">Color Schema</h4>
      <div class="mat-elevation-z0 bg-primary-variant">
        <div class="p-4 pt-[60px]">
          bg-primary-variant {{ colors['primary-variant'] }} (called
          secondary-variant in design)
        </div>
      </div>
      <div class="mat-elevation-z0 bg-secondary-legacy">
        <div class="p-4 pt-[60px]">
          bg-secondary-legacy {{ colors['secondary-legacy'] }}
        </div>
      </div>
      <div class="mat-elevation-z0 bg-secondary-variant">
        <div class="p-4 pt-[60px]">
          bg-secondary-variant {{ colors['secondary-variant'] }} (called
          primary-variant in design)
        </div>
      </div>
      <div class="mat-elevation-z0 bg-secondary-900 text-white-low-emphasis">
        <div class="p-4 pt-[60px]">
          bg-secondary-900 {{ colors['secondary-900'] }} (called grey/900 in
          design)
        </div>
      </div>
      <div class="mat-elevation-z0 bg-background-dark">
        <div class="p-4 pt-[60px]">
          bg-background-dark {{ colors['background-dark'] }}
        </div>
      </div>
      <div class="mat-elevation-z0 bg-surface-legacy">
        <div class="p-4 pt-[60px]">
          bg-surface-legacy {{ colors['surface-legacy'] }}
        </div>
      </div>
    </section>
  `,
  standalone: false,
})
class ColorComponentExample implements OnInit {
  @Input() public colors: any;

  public isDarkMode = false;

  public m3SectionTitle = '';

  ngOnInit(): void {
    const htmlElement = document.getElementsByTagName('html')[0];
    this.isDarkMode = htmlElement.classList.contains('dark');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkMode = htmlElement.classList.contains('dark');
          this.m3SectionTitle = this.isDarkMode
            ? 'Dark Scheme'
            : 'Light Scheme';
        }
      });
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
}

export default {
  title: 'Atomic/Foundations/Color',
  component: ColorComponentExample,
  decorators: [
    withDesign,
    moduleMetadata({
      imports: [
        MatIconModule,
        BackgroundColorDirective,
        TextColorDirective,
        BorderColorDirective,
      ],
    }),
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
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=152%3A944',
    },
  },
} as Meta<ColorComponentExample>;

const Template: StoryFn<ColorComponentExample> = (
  args: ColorComponentExample
) => ({
  component: ColorComponentExample,
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  colors: {
    ...colors,
  },
};
