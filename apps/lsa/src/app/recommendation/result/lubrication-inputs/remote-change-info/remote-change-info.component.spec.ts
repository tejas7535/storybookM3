import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RemoteChangeInfoComponent } from './remote-change-info.component';

describe('RemoteChangeInfoComponent', () => {
  let spectator: Spectator<RemoteChangeInfoComponent>;
  let translateSpy: jest.SpyInstance;

  const createComponent = createComponentFactory({
    component: RemoteChangeInfoComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(MatIconModule),
      MockModule(MatTooltipModule),
    ],
    providers: [
      MockProvider(TranslocoService, {
        translate: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        original: 'Yes',
        new: 'No',
      },
    });
    translateSpy = jest.spyOn(spectator.component['transloco'], 'translate');
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should fetch the proper translation', () => {
    expect(translateSpy).toHaveBeenCalled();
  });
});
