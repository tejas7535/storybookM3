import { Component, Input } from '@angular/core';

import { MainBearing } from '../../../core/store/reducers/bearing/models';

interface BearingProperties {
  name: string;
  property: string;
  unit?: string;
}

@Component({
  selector: 'goldwind-cm-equipment',
  templateUrl: './cm-equipment.component.html',
  styleUrls: ['./cm-equipment.component.scss'],
})
export class CmEquipmentComponent {
  @Input() mainBearing: MainBearing;
  bearingProperties: BearingProperties[] = [
    { name: 'designation', property: 'designation' },
    { name: 'shortDescription', property: 'model' },
    { name: 'manufacturer', property: 'manufacturer' },
    { name: 'outerDiameter', property: 'outerDiameter', unit: 'mm' },
    { name: 'innerDiameter', property: 'innerDiameter', unit: 'mm' },
    { name: 'overallWidth', property: 'overallWidth', unit: 'mm' },
    { name: 'mass', property: 'mass', unit: 'kg' },
  ];

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
