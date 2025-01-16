import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EditingCommentModalComponent } from '@gq/process-case-view/quotation-details-table/editing-comment-modal/editing-comment-modal.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { provideMockStore } from '@ngrx/store/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { EditCommentComponent } from './edit-comment.component';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let spectator: Spectator<EditCommentComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EditCommentComponent,
    imports: [MatIconModule, MatDialogModule],
    mocks: [MatDialog],
    providers: [
      provideMockStore(),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    matDialogSpyObject = spectator.inject(MatDialog);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params = { data: QUOTATION_DETAIL_MOCK } as any;
      component.agInit(params);

      expect(component.detail).toEqual(QUOTATION_DETAIL_MOCK);
    });
  });

  describe('onIconClick', () => {
    test('should open dialog', () => {
      component.detail = QUOTATION_DETAIL_MOCK;

      component.onIconClick();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingCommentModalComponent,
        {
          width: '684px',
          data: QUOTATION_DETAIL_MOCK,
        }
      );
    });
  });
});
