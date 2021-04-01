import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ToggleChartsComponent } from './toggle-charts.component';

describe('ToggleChartsComponent', () => {
  let component: ToggleChartsComponent;
  let spectator: Spectator<ToggleChartsComponent>;

  const createComponent = createComponentFactory({
    component: ToggleChartsComponent,
    detectChanges: false,
    imports: [
      MatButtonToggleModule,
      IconsModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
      MatTooltipModule,
    ],
    providers: [],
    declarations: [ToggleChartsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('valueChanged', () => {
    test('should emit value', () => {
      component.changed.emit = jest.fn();
      const event: MatButtonToggleChange = ({
        value: 'test',
      } as unknown) as MatButtonToggleChange;

      component.valueChanged(event);

      expect(component.changed.emit).toHaveBeenCalledWith(event.value);
    });
  });
});
