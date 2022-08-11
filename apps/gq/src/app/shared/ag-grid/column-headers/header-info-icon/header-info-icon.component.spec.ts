import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { IHeaderParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InfoIconModule } from '../../../components/info-icon/info-icon.module';
import { HeaderInfoIconComponent } from './header-info-icon.component';

describe('HeaderInfoIconComponent', () => {
  let component: HeaderInfoIconComponent;
  let spectator: Spectator<HeaderInfoIconComponent>;

  const createComponent = createComponentFactory({
    component: HeaderInfoIconComponent,
    imports: [InfoIconModule, provideTranslocoTestingModule({ en: {} })],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = { displayName: 'displayName' } as IHeaderParams;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
