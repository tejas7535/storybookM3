import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttritionDialogMetaComponent } from './attrition-dialog-meta.component';

describe('AttritionDialogMetaComponent', () => {
  let component: AttritionDialogMetaComponent;
  let spectator: Spectator<AttritionDialogMetaComponent>;

  const createComponent = createComponentFactory({
    component: AttritionDialogMetaComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} }), MatIconModule],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
