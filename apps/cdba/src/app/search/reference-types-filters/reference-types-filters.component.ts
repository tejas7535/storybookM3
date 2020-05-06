import { Component } from '@angular/core';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
})
export class ReferenceTypesFiltersComponent {
  productLineOptions = [
    { id: '01', description: 'PL-01' },
    { id: '02', description: 'PL-02' },
    { id: '03', description: 'PL-03' },
  ];

  plantOptions = [
    { id: '01', description: 'Plant-01' },
    { id: '02', description: 'Plant-02' },
    { id: '03', description: 'Plant-03' },
  ];

  customerOptions = [
    { id: '01', description: 'Audi AG' },
    { id: '02', description: 'BMW AG' },
    { id: '03', description: 'Daimler AG' },
  ];
}
