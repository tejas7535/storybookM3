/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttachmentsComponent } from './attachments.component';

describe('AttachmentsComponent', () => {
  let component: AttachmentsComponent<any>;
  let spectator: Spectator<AttachmentsComponent<any>>;

  const createComponent = createComponentFactory({
    component: AttachmentsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      { provide: MatDialog, useValue: {} },
      provideMockStore({ initialState: {} }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
