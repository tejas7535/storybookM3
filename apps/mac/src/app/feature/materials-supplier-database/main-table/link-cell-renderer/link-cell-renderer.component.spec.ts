import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { LinkCellRendererComponent } from './link-cell-renderer.component';

jest.mock('../edit-cell-renderer/edit-cell-renderer.component', () => ({
  EditCellRendererComponent: jest.fn(),
}));

describe('LinkCellRendererComponent', () => {
  let component: LinkCellRendererComponent;
  let spectator: Spectator<LinkCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: LinkCellRendererComponent,
    imports: [MockPipe(PushPipe)],
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

    component.params = mockparams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
