import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal/global-search-advanced-modal.component';
import { GlobalSearchBarComponent } from './global-search-bar.component';

describe('GlobalSearchBarComponent', () => {
  let component: GlobalSearchBarComponent;
  let spectator: Spectator<GlobalSearchBarComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: GlobalSearchBarComponent,
    imports: [
      SharedDirectivesModule,
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      MatDialogModule,
    ],
    providers: [],
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
    test('should open matDialog with extendedSearchbar', () => {
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
