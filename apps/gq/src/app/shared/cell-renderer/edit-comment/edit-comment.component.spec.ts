import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { EditingCommentModalComponent } from '../../../process-case-view/quotation-details-table/editing-comment-modal/editing-comment-modal.component';
import { EditCommentComponent } from './edit-comment.component';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let spectator: Spectator<EditCommentComponent>;

  const createComponent = createComponentFactory({
    component: EditCommentComponent,
    imports: [MatIconModule, MatDialogModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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
      component['dialog'] = {
        open: jest.fn(),
      } as any;

      component.onIconClick();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EditingCommentModalComponent,
        {
          width: '50%',
          height: '300px',
          data: QUOTATION_DETAIL_MOCK,
          disableClose: true,
        }
      );
    });
  });
});
