import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { REFERENCE_DOCUMENT } from '@mac/feature/materials-supplier-database/constants';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { ReferenceDocumentBulkEditDialogComponent } from './reference-document-bulk-edit-dialog.component';

describe('ReferenceDocumentBulkEditDialogComponent', () => {
  let component: ReferenceDocumentBulkEditDialogComponent;
  let spectator: Spectator<ReferenceDocumentBulkEditDialogComponent>;

  const createComponent = createComponentFactory({
    component: ReferenceDocumentBulkEditDialogComponent,
    imports: [provideTranslocoTestingModule({ en })],
    declarations: [ReferenceDocumentBulkEditDialogComponent],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: { selectedRows: [{ id: 1 }, { id: 2 }] },
      },
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      mockProvider(DataFacade),
      mockProvider(DialogFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should emit on destroy', () => {
    component['destroy$'].next = jest.fn();
    component['destroy$'].complete = jest.fn();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    test('should close dialog on bulkEditMaterialsSucceeded', () => {
      component['determineAllReferenceDocuments'] = jest.fn();
      component['determineSelectedReferenceDocumentsSummary'] = jest.fn();
      component['handleSearchExpressionChanges'] = jest.fn();
      component.close = jest.fn();
      component['dialogFacade'].bulkEditMaterialsSucceeded$ = of(true as any);

      component.ngOnInit();

      expect(component.close).toHaveBeenCalledTimes(1);
    });

    test('should determine all reference documents', () => {
      component['determineSelectedReferenceDocumentsSummary'] = jest.fn();
      component['handleSearchExpressionChanges'] = jest.fn();
      component['dialogFacade'].bulkEditMaterialsSucceeded$ = of();
      component['dataFacade'].result$ = of([
        { [REFERENCE_DOCUMENT]: ['AS 003569', 'AS 22222'] },
        { [REFERENCE_DOCUMENT]: ['AS 003569'] },
        { [REFERENCE_DOCUMENT]: ['AS 00000'] },
      ] as any);

      component.ngOnInit();

      expect(component['allReferenceDocuments']).toEqual(
        new Set(['AS 003569', 'AS 22222', 'AS 00000'])
      );

      expect(component.allReferenceDocumentsFiltered).toEqual([
        'AS 00000',
        'AS 003569',
        'AS 22222',
      ]);
    });

    test('should determine selected reference documents summary', () => {
      component['determineAllReferenceDocuments'] = jest.fn();
      component['handleSearchExpressionChanges'] = jest.fn();
      component['dialogFacade'].bulkEditMaterialsSucceeded$ = of();

      const dialogData = {
        selectedRows: [
          { [REFERENCE_DOCUMENT]: ['AS 003569', 'AS 003599'] },
          { [REFERENCE_DOCUMENT]: ['AS 003599'] },
          { [REFERENCE_DOCUMENT]: ['AS 001111'] },
        ],
      };

      Object.defineProperty(component, 'dialogData', {
        value: dialogData,
      });

      component.ngOnInit();

      expect(component.selectedReferenceDocumentToEntriesCount).toEqual({
        'AS 003569': 1,
        'AS 003599': 2,
        'AS 001111': 1,
      });

      expect(component.selectedReferenceDocuments).toEqual([
        'AS 001111',
        'AS 003569',
        'AS 003599',
      ]);
    });

    test('should handle search expression changes', () => {
      component['determineAllReferenceDocuments'] = jest.fn();
      component['determineSelectedReferenceDocumentsSummary'] = jest.fn();
      component['dialogFacade'].bulkEditMaterialsSucceeded$ = of();

      Object.defineProperty(component, 'allReferenceDocuments', {
        value: new Set(['AS 00000', 'AS 003569', 'AS 22222']),
      });

      component.ngOnInit();

      component.searchControl.setValue('22');

      expect(component.allReferenceDocumentsFiltered).toEqual(['AS 22222']);
    });

    test('should reset list when search expression is empty', () => {
      component['determineAllReferenceDocuments'] = jest.fn();
      component['determineSelectedReferenceDocumentsSummary'] = jest.fn();
      component['dialogFacade'].bulkEditMaterialsSucceeded$ = of();

      Object.defineProperty(component, 'allReferenceDocuments', {
        value: new Set(['AS 22222', 'AS 00000', 'AS 003569']),
      });

      component.ngOnInit();

      component.searchControl.setValue('22');
      component.searchControl.setValue('');

      expect(component.allReferenceDocumentsFiltered).toEqual([
        'AS 00000',
        'AS 003569',
        'AS 22222',
      ]);
    });
  });

  test('should close the dialog', () => {
    component.close();

    expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
  });

  test('should trigger update', () => {
    component['dialogFacade'].bulkEditMaterials = jest.fn();

    const dialogData = {
      selectedRows: [
        { [REFERENCE_DOCUMENT]: ['AS 003569'] },
        { [REFERENCE_DOCUMENT]: ['AS 003599'] },
      ],
    };

    Object.defineProperty(component, 'dialogData', {
      value: dialogData,
    });

    component.updateMaterials();

    expect(component['dialogFacade'].bulkEditMaterials).toHaveBeenCalledWith(
      dialogData.selectedRows
    );
  });

  test('should confirm add entry', () => {
    Object.defineProperty(component, 'allReferenceDocuments', {
      value: new Set(['AS 22222', 'AS 00000', 'AS 003569']),
    });
    component.allReferenceDocumentsFiltered = [
      'AS 00000',
      'AS 003569',
      'AS 22222',
    ];

    component.onConfirmAddEntry('AS 00111 ');

    expect(component['allReferenceDocuments']).toEqual(
      new Set(['AS 22222', 'AS 00000', 'AS 003569', 'AS 00111'])
    );
    expect(component['allReferenceDocumentsFiltered']).toEqual([
      'AS 00000',
      'AS 00111',
      'AS 003569',
      'AS 22222',
    ]);
    expect(component.addingEntry).toBe(false);
  });

  describe('handleCheckboxChange', () => {
    test('should handle reference document checked', () => {
      component.selectedReferenceDocuments = ['AS 00000', 'AS 003569'];

      component.selectedReferenceDocumentToEntriesCount = {
        'AS 00000': 1,
        'AS 003569': 2,
      };

      const dialogData = {
        selectedRows: [
          { id: 1, [REFERENCE_DOCUMENT]: ['AS 00000', 'AS 003569'] },
          { id: 2, [REFERENCE_DOCUMENT]: ['AS 003569'] },
          { id: 3 },
        ],
      };

      Object.defineProperty(component, 'dialogData', {
        value: dialogData,
      });

      component.handleCheckboxChange(true, 'AS 0022222');

      expect(component.selectedReferenceDocuments).toEqual([
        'AS 00000',
        'AS 0022222',
        'AS 003569',
      ]);
      expect(component.selectedReferenceDocumentToEntriesCount).toEqual({
        'AS 00000': 1,
        'AS 003569': 2,
        'AS 0022222': 3,
      });
      expect(component.dialogData.selectedRows).toEqual([
        {
          id: 1,
          [REFERENCE_DOCUMENT]: ['AS 00000', 'AS 003569', 'AS 0022222'],
        },
        { id: 2, [REFERENCE_DOCUMENT]: ['AS 003569', 'AS 0022222'] },
        { id: 3, [REFERENCE_DOCUMENT]: ['AS 0022222'] },
      ]);
    });

    test('should handle reference document unchecked', () => {
      component.selectedReferenceDocuments = ['AS 00000', 'AS 003569'];

      component.selectedReferenceDocumentToEntriesCount = {
        'AS 00000': 1,
        'AS 003569': 2,
      };

      const dialogData = {
        selectedRows: [
          { [REFERENCE_DOCUMENT]: ['AS 00000', 'AS 003569'] },
          { [REFERENCE_DOCUMENT]: ['AS 003569'] },
        ],
      };

      Object.defineProperty(component, 'dialogData', {
        value: dialogData,
      });

      component.handleCheckboxChange(false, 'AS 003569');

      expect(component.selectedReferenceDocuments).toEqual(['AS 00000']);
      expect(component.selectedReferenceDocumentToEntriesCount).toEqual({
        'AS 00000': 1,
        'AS 003569': 0,
      });
      expect(component.dialogData.selectedRows).toEqual([
        {
          [REFERENCE_DOCUMENT]: ['AS 00000'],
        },
        { [REFERENCE_DOCUMENT]: [] },
      ]);
    });
  });
});
