import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../test/stub.class';
import { ValueBadgeCellRendererComponent } from './value-badge-cell-renderer.component';

describe('ValueBadgeCellRendererComponent', () => {
  let component: ValueBadgeCellRendererComponent;

  beforeEach(() => {
    component = Stub.get({ component: ValueBadgeCellRendererComponent });
  });

  it('should set the value', () => {
    component['setValue']({ value: 100 } as ICellRendererParams);

    expect(component.value).toBe(100);
  });
});
