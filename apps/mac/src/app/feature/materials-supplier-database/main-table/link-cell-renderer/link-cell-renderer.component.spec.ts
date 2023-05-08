import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';

import { MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { LinkCellRendererComponent } from './link-cell-renderer.component';

describe('LinkCellRendererComponent', () => {
  let component: LinkCellRendererComponent;
  let spectator: Spectator<LinkCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: LinkCellRendererComponent,
    imports: [PushModule],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          dispatch: jest.fn(),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openDialog: jest.fn(),
        },
      },
    ],
  });

  const mockparams = {
    value: 'A',
    valueFormatted: 'A|B',
    hasEditorRole: false,
  } as EditCellRendererParams;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockparams);
  });

  describe('agInit', () => {
    it('should assign params', () => {
      const mockParams = {} as EditCellRendererParams;

      component.agInit(mockParams);

      expect(component.params).toEqual(mockParams);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('setHovered', () => {
    it('should assign hovered', () => {
      component.setHovered(true);

      expect(component.hovered).toBe(true);
    });
  });

  describe('getHref', () => {
    it('should give href', () => {
      expect(component.getHref()).toEqual('B');
    });
  });
  describe('getName', () => {
    it('should give name', () => {
      expect(component.getName()).toEqual('A');
    });
  });
});
