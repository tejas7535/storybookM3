import { APP_INITIALIZER, NgModule } from '@angular/core';

import {
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
  TranslocoService,
} from '@ngneat/transloco';

import { Story } from '@storybook/angular';

import {
  STORYBOOK_DEFAULT_LANGUAGE,
  STORYBOOK_SUPPORTED_LANGUAGES,
} from './storybook-transloco.constants';
import { distinctUntilChanged } from 'rxjs';

let translocoServiceInstance: TranslocoService | null;

export const getMultiLanguageStoryTemplate: Story = (
  args,
  { globals, ...rest }
) => {
  if (globals.language) {
    translocoServiceInstance?.setActiveLang(globals.language);
  }

  return {
    globals,
    props: {
      ...args,
    },
    ...rest,
  };
};

const translocoStorybookInitializer =
  (translocoService: TranslocoService) => () => {
    const subscription = translocoService.langChanges$
      .pipe(distinctUntilChanged())
      .subscribe();

    translocoServiceInstance = translocoService;

    const onDestroyCb = translocoService.ngOnDestroy.bind(translocoService);
    translocoService.ngOnDestroy = () => {
      onDestroyCb();
      subscription?.unsubscribe();
    };
  };

@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        reRenderOnLangChange: true,
        availableLangs: STORYBOOK_SUPPORTED_LANGUAGES.map((l) => ({
          id: l.code,
          label: l.title,
        })),
        defaultLang: STORYBOOK_DEFAULT_LANGUAGE.code,
        fallbackLang: STORYBOOK_DEFAULT_LANGUAGE.code,
        prodMode: false,
      }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translocoStorybookInitializer,
      multi: true,
      deps: [TranslocoService],
    },
  ],
  exports: [TranslocoModule],
})
export class StorybookTranslocoModule {}
