import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject, of } from 'rxjs';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal/global-search-advanced-modal.component';
import { GlobalSearchBarComponent } from './global-search-bar.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';

describe('GlobalSearchBarComponent', () => {
  let component: GlobalSearchBarComponent;
  let spectator: Spectator<GlobalSearchBarComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;
  const featureSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  const createComponent = createComponentFactory({
    component: GlobalSearchBarComponent,
    imports: [
      SharedDirectivesModule,
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      MatDialogModule,
    ],
    providers: [
      MockProvider(FeatureToggleConfigService, {
        isEnabled: jest.fn(() => featureSubject.value),
      }),
    ],
    declarations: [GlobalSearchBarComponent],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openGlobalSearchModal', () => {
    test('should open matDialog with standardSearchbar', () => {
      component.extendedSearchBar = false;
      component.openGlobalSearchModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledTimes(1);
      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        GlobalSearchModalComponent,
        {
          panelClass: 'global-search-modal',
          width: '880px',
          position: {
            top: '20vh',
          },
        }
      );
    });

    test('should open matDialog with extendedSearchbar', () => {
      component.extendedSearchBar = true;
      component.openGlobalSearchModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledTimes(1);
      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        GlobalSearchAdvancedModalComponent,
        {
          panelClass: 'global-search-advanced-modal',
          width: '1100px',
        }
      );
    });
  });
});
