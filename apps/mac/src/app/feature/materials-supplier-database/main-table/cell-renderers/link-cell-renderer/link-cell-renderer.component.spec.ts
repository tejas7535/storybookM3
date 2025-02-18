import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { LinkCellRendererComponent } from './link-cell-renderer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('LinkCellRendererComponent', () => {
  let component: LinkCellRendererComponent;
  let spectator: Spectator<LinkCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: LinkCellRendererComponent,
    imports: [MockPipe(PushPipe)],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          materialClass$: of(MaterialClass.STEEL),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {},
      },
    ],
    detectChanges: false,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getHref', () => {
    it('should give href', () => {
      expect(component.href).toEqual('B');
    });
  });
  describe('getName', () => {
    it('should give name', () => {
      expect(component.name).toEqual('A');
    });
  });
});
