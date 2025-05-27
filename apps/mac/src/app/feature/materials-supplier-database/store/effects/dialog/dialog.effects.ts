/* eslint-disable max-lines */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  Co2Classification,
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { FileService } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/services';
import {
  asStringOption,
  asStringOptionOrUndefined,
  determineCo2ClassificationNew,
  determineCo2ClassificationNewSecondary,
} from '@mac/feature/materials-supplier-database/util';
import {
  CreateMaterialErrorState,
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
  SAPMaterial,
  SapMaterialsDatabaseUploadStatus,
  SapMaterialsDatabaseUploadStatusResponse,
  SapMaterialsUploadResponse,
} from '@mac/msd/models';
import { MsdDataService, MsdSapMaterialsExcelService } from '@mac/msd/services';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';
import { DataFacade } from '@mac/msd/store/facades/data';

import { DialogFacade } from '../../facades/dialog';

@Injectable()
export class DialogEffects {
  readonly SAP_MATERIALS_DATABASE_UPLOAD_STATUS_POLLING_INTERVAL = 5000;

  public materialDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.materialDialogOpened),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      map(([_action, materialClass]) => {
        const baseActions = [
          DialogActions.fetchMaterialStandards(),
          DialogActions.fetchCo2Classifications(),
          DialogActions.fetchManufacturerSuppliers(),
        ];
        switch (materialClass) {
          case MaterialClass.ALUMINUM: {
            return [...baseActions, DialogActions.fetchProductCategories()];
          }
          case MaterialClass.COPPER: {
            return [
              ...baseActions,
              DialogActions.fetchProductCategories(),
              DialogActions.fetchCastingModes(),
              DialogActions.fetchProductionProcesses(),
              DialogActions.fetchReferenceDocuments(),
            ];
          }
          case MaterialClass.STEEL: {
            return [
              ...baseActions,
              DialogActions.fetchProductCategories(),
              DialogActions.fetchRatings(),
              DialogActions.fetchCastingModes(),
              DialogActions.fetchReferenceDocuments(),
              DialogActions.fetchProductCategoryRules(),
              DialogActions.fetchCo2Standards(),
            ];
          }
          case MaterialClass.CERAMIC: {
            return [
              ...baseActions,
              DialogActions.fetchProductCategories(),
              DialogActions.fetchConditions(),
            ];
          }
          default: {
            return baseActions;
          }
        }
      }),
      switchMap((actions) => actions)
    );
  });

  public materialStandardDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.materialStandardDialogOpened),
      switchMap(() => [DialogActions.fetchMaterialStandards()])
    );
  });

  public manufacturersupplierDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.manufacturerSupplierDialogOpened),
      switchMap(() => [DialogActions.fetchManufacturerSuppliers()])
    );
  });

  public sapMaterialUploadDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.sapMaterialsUploadDialogOpened),
      switchMap(() => [DialogActions.fetchDataOwners()])
    );
  });

  public uploadSapMaterialsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.uploadSapMaterialsSuccess),
      switchMap(({ uploadId }) => [
        DialogActions.startPollingSapMaterialsDatabaseUploadStatus({
          uploadId,
        }),
      ])
    );
  });

  public fetchMaterialStandards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchMaterialStandards),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchMaterialStandards(materialClass).pipe(
          map((materialStandards: MaterialStandard[]) =>
            DialogActions.fetchMaterialStandardsSuccess({ materialStandards })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchMaterialStandardsFailure()))
        )
      )
    );
  });

  public fetchCo2Classifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCo2Classifications),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchCo2Classifications(materialClass).pipe(
          map((co2Classifications: StringOption[]) =>
            DialogActions.fetchCo2ClassificationsSuccess({ co2Classifications })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchCo2ClassificationsFailure()))
        )
      )
    );
  });

  public fetchManufacturerSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchManufacturerSuppliers),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchManufacturerSuppliers(materialClass).pipe(
          map((manufacturerSuppliers: ManufacturerSupplier[]) =>
            DialogActions.fetchManufacturerSuppliersSuccess({
              manufacturerSuppliers,
            })
          ),
          // TODO: implement proper error handling
          catchError(() =>
            of(DialogActions.fetchManufacturerSuppliersFailure())
          )
        )
      )
    );
  });

  public fetchRatings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchRatings),
      switchMap(() =>
        this.msdDataService.fetchRatings().pipe(
          map((ratings: string[]) =>
            DialogActions.fetchRatingsSuccess({ ratings })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchRatingsFailure()))
        )
      )
    );
  });

  public fetchProductionProcesses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchProductionProcesses),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchProductionProcesses(materialClass).pipe(
          map((productionProcesses) =>
            DialogActions.fetchProductionProcessesSuccess({
              productionProcesses,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchProductionProcessesFailure()))
        )
      )
    );
  });

  public fetchCastingModes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCastingModes),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchCastingModes(materialClass).pipe(
          map((castingModes: string[]) =>
            DialogActions.fetchCastingModesSuccess({ castingModes })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchCastingModesFailure()))
        )
      )
    );
  });

  public fetchCategoryOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchProductCategories),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.getProductCategories(materialClass).pipe(
          map((productCategories: StringOption[]) =>
            DialogActions.fetchProductCategoriesSuccess({ productCategories })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DialogActions.fetchProductCategoriesFailure())
          )
        )
      )
    );
  });

  public fetchConditions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchConditions),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.getConditions(materialClass).pipe(
          map((conditions: StringOption[]) =>
            DialogActions.fetchConditionsSuccess({ conditions })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DialogActions.fetchConditionsFailure())
          )
        )
      )
    );
  });

  public fetchDataOwners$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchDataOwners),
      concatLatestFrom(() => this.dataFacade.username$),
      switchMap(([_action, username]) =>
        this.msdDataService.getDistinctSapValues('owner').pipe(
          map((owners: string[]) => {
            const dataOwners = [...owners];
            const isUserDataOwner = dataOwners.some(
              (owner: string) => owner.toLowerCase() === username.toLowerCase()
            );

            if (!isUserDataOwner) {
              dataOwners.push(username);
            }

            return DialogActions.fetchDataOwnersSuccess({ dataOwners });
          }),
          catchError(() =>
            // TODO: implement proper error handling
            of(DialogActions.fetchDataOwnersFailure())
          )
        )
      )
    );
  });

  public fetchProductCategoryRules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchProductCategoryRules),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchProductCategoryRules(materialClass).pipe(
          map((productCategoryRules) =>
            DialogActions.fetchProductCategoryRulesSuccess({
              productCategoryRules,
            })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DialogActions.fetchProductCategoryRulesFailure())
          )
        )
      )
    );
  });

  public fetchCo2Standards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCo2Standards),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchCo2Standards(materialClass).pipe(
          map((co2Standards) =>
            DialogActions.fetchCo2StandardsSuccess({
              co2Standards:
                co2Standards.filter((standard: string) => !!standard) ?? [],
            })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DialogActions.fetchCo2StandardsFailure())
          )
        )
      )
    );
  });

  public materialDialogConfirmed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.materialDialogConfirmed),
      switchMap(({ standard, supplier, material, isBulkEdit }) =>
        // check if file has been uploaded
        this.fileService.getCo2UploadFile()
          ? [
              DialogActions.uploadPcrMaterialDocument({
                standard,
                supplier,
                material,
                isBulkEdit,
              }),
            ]
          : [
              DialogActions.checkForBulkEdit({
                standard,
                supplier,
                material,
                isBulkEdit,
              }),
            ]
      )
    );
  });

  public materialStandardDialogConfirmed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.materialStandardDialogConfirmed),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ standard }, materialClass]) =>
        this.msdDataService
          .createMaterialStandard(standard, materialClass)
          .pipe(
            map((response) =>
              DialogActions.createMaterialComplete({
                record: {
                  standard: {
                    ...standard,
                    id: response.id,
                  },
                  materialClass,
                  material: undefined,
                  supplier: undefined,
                },
              })
            ),
            catchError((e: HttpErrorResponse) =>
              of(
                DialogActions.createMaterialComplete({
                  record: {
                    standard,
                    materialClass,
                    material: undefined,
                    supplier: undefined,
                    error: {
                      code: e.status,
                      state:
                        CreateMaterialErrorState.MaterialStandardCreationFailed,
                    },
                  },
                })
              )
            )
          )
      )
    );
  });

  public manufacturersupplierDialogConfirmed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.manufacturerSupplierDialogConfirmed),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ supplier }, materialClass]) =>
        this.msdDataService
          .createManufacturerSupplier(supplier, materialClass)
          .pipe(
            map((response) =>
              DialogActions.createMaterialComplete({
                record: {
                  standard: undefined,
                  materialClass,
                  material: undefined,
                  supplier: {
                    ...supplier,
                    id: response.id,
                  },
                },
              })
            ),
            catchError((e: HttpErrorResponse) =>
              of(
                DialogActions.createMaterialComplete({
                  record: {
                    standard: undefined,
                    materialClass,
                    material: undefined,
                    supplier,
                    error: {
                      code: e.status,
                      state:
                        CreateMaterialErrorState.MaterialStandardCreationFailed,
                    },
                  },
                })
              )
            )
          )
      )
    );
  });

  public uploadPcrMaterialDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.uploadPcrMaterialDocument),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(
        ([{ standard, supplier, material, isBulkEdit }, materialClass]) =>
          this.msdDataService
            .uploadMaterialDocument(
              this.fileService.getCo2UploadFile(),
              'pcrMaterial',
              materialClass
            )
            .pipe(
              map((response) =>
                DialogActions.checkForBulkEdit({
                  standard,
                  supplier,
                  material: {
                    ...material,
                    co2UploadFileId: response.id,
                  },
                  isBulkEdit,
                })
              ),
              catchError((e: HttpErrorResponse) =>
                of(
                  DialogActions.createMaterialComplete({
                    record: {
                      standard,
                      supplier,
                      material,
                      materialClass,
                      error: {
                        code: e.status,
                        state:
                          CreateMaterialErrorState.MaterialProofCreationFailed,
                      },
                    },
                  })
                )
              )
            )
      )
    );
  });

  public checkForBulkEdit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.checkForBulkEdit),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(
        ([{ standard, supplier, material, isBulkEdit }, materialClass]) =>
          isBulkEdit
            ? [
                DialogActions.postBulkMaterial({
                  record: {
                    standard,
                    supplier,
                    material,
                    materialClass,
                  },
                }),
              ]
            : [
                DialogActions.postMaterialStandard({
                  record: {
                    standard,
                    supplier,
                    material,
                    materialClass,
                  },
                }),
              ]
      )
    );
  });

  public postMaterialStandard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postMaterialStandard),
      switchMap(({ record }) =>
        record.standard.id
          ? // material standard already exists
            of(DialogActions.postManufacturerSupplier({ record }))
          : // create new material standard entry
            this.msdDataService
              .createMaterialStandard(record.standard, record.materialClass)
              .pipe(
                map((response) =>
                  DialogActions.postManufacturerSupplier({
                    record: {
                      ...record,
                      material: {
                        ...record.material,
                        materialStandardId: response.id,
                      },
                    },
                  })
                ),
                catchError((e: HttpErrorResponse) =>
                  of(
                    DialogActions.createMaterialComplete({
                      record: {
                        ...record,
                        error: {
                          code: e.status,
                          state:
                            CreateMaterialErrorState.MaterialStandardCreationFailed,
                        },
                      },
                    })
                  )
                )
              )
      )
    );
  });

  public postManufacturerSupplier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postManufacturerSupplier),
      switchMap(({ record }) =>
        record.supplier.id
          ? // skip creating manufacturer
            of(DialogActions.postMaterial({ record }))
          : // create new manufacturer
            this.msdDataService
              .createManufacturerSupplier(record.supplier, record.materialClass)
              .pipe(
                map((response) =>
                  DialogActions.postMaterial({
                    record: {
                      ...record,
                      material: {
                        ...record.material,
                        manufacturerSupplierId: response.id,
                      },
                    },
                  })
                ),
                catchError((e: HttpErrorResponse) =>
                  of(
                    DialogActions.createMaterialComplete({
                      record: {
                        ...record,
                        error: {
                          code: e.status,
                          state:
                            CreateMaterialErrorState.ManufacturerSupplierCreationFailed,
                        },
                      },
                    })
                  )
                )
              )
      )
    );
  });

  public postMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postMaterial),
      switchMap(
        ({ record }) =>
          record.materialClass === MaterialClass.STEEL &&
          this.msdDataService
            .createMaterial(record.material, record.materialClass)
            .pipe(
              map(() => DialogActions.createMaterialComplete({ record })),
              catchError((e: HttpErrorResponse) =>
                of(
                  DialogActions.createMaterialComplete({
                    record: {
                      ...record,
                      error: {
                        code: e.status,
                        state: CreateMaterialErrorState.MaterialCreationFailed,
                      },
                    },
                  })
                )
              )
            )
      )
    );
  });

  public postBulkMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postBulkMaterial),
      // load selected table data
      concatLatestFrom(() => this.dataFacade.selectedMaterialData$),
      switchMap(([{ record }, { rows, combinedRows }]) => {
        // get data from dialog and remove all "undefined" fields, so only filled out fields are used
        const form = { ...record.material } as any;
        for (const property in form) {
          if (!form[property] && !combinedRows[property as keyof DataResult]) {
            delete form[property];
          }
        }

        // override row data with data from the dialog (only non-undefined values)
        const materials = rows.map((row) => {
          const newRow = {
            ...row,
            ...form,
          } as MaterialRequest;
          if (form.ratingChangeComment && row.rating === form.rating) {
            delete (newRow as any).ratingChangeComment;
          }

          return newRow;
        });

        return (
          record.materialClass === MaterialClass.STEEL &&
          this.msdDataService
            .bulkEditMaterial(materials, record.materialClass)
            .pipe(
              map(() => DialogActions.createMaterialComplete({ record })),
              catchError((e: HttpErrorResponse) =>
                of(
                  DialogActions.createMaterialComplete({
                    record: {
                      ...record,
                      error: {
                        code: e.status,
                        state: CreateMaterialErrorState.MaterialCreationFailed,
                        detail: this.parseBulkErrors(e.error, materials),
                      },
                    },
                  })
                )
              )
            )
        );
      })
    );
  });

  public createMaterialComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.createMaterialComplete),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([{ record }, { navigationLevel }]) => {
        const level = translate(
          `materialsSupplierDatabase.mainTable.dialog.level.${navigationLevel}`
        );
        if (record.error) {
          const err = record.error;

          return of(
            DataActions.errorSnackBar({
              message: translate(
                `materialsSupplierDatabase.mainTable.dialog.createFailure.${err.code}`,
                { level }
              ),
              detailMessage: err.detail?.message,
              items: err.detail?.items,
            })
          );
        }

        return [
          DataActions.fetchResult(),
          DataActions.infoSnackBar({
            message: translate(
              'materialsSupplierDatabase.mainTable.dialog.createSuccess',
              { level }
            ),
          }),
        ];
      })
    );
  });

  public materialDialogCanceled$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        DialogActions.materialStandardDialogCanceled,
        DialogActions.manufacturerSupplierDialogCanceled,
        DialogActions.materialDialogCanceled
      ),
      switchMap(() => [DialogActions.resetDialogOptions()])
    );
  });

  public resetMaterialDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.resetMaterialRecord),
      switchMap(({ error, createAnother }) => {
        if (!error && !createAnother) {
          return of(DialogActions.resetDialogOptions());
        }

        return [] as Action[];
      })
    );
  });

  public fetchCastingDiameters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCastingDiameters),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ supplierId, castingMode }, materialClass]) => {
        if (!supplierId || !castingMode) {
          return of(
            DialogActions.fetchCastingDiametersSuccess({ castingDiameters: [] })
          );
        }

        return this.msdDataService
          .fetchCastingDiameters(supplierId, castingMode, materialClass)
          .pipe(
            map((castingDiameters) =>
              DialogActions.fetchCastingDiametersSuccess({ castingDiameters })
            ),
            catchError(() => of(DialogActions.fetchCastingDiametersFailure()))
          );
      })
    );
  });

  public fetchReferenceDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchReferenceDocuments),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) => {
        return this.msdDataService.fetchReferenceDocuments(materialClass).pipe(
          map((referenceDocuments) => {
            const parsedDocuments: string[] = [];
            for (const documents of referenceDocuments) {
              // fetch will return some 'null' elements
              if (documents) {
                parsedDocuments.push(...documents);
              }
            }

            return parsedDocuments;
          }),
          map((parsedDocuments) =>
            parsedDocuments.filter(
              (document, index) => parsedDocuments.indexOf(document) === index
            )
          ),
          map((referenceDocuments) =>
            DialogActions.fetchReferenceDocumentsSuccess({
              referenceDocuments,
            })
          ),
          catchError(() => of(DialogActions.fetchReferenceDocumentsFailure()))
        );
      })
    );
  });

  public openEditDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.openEditDialog),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([{ row, isCopy = false }, { navigationLevel }]) => {
        switch (navigationLevel) {
          case NavigationLevel.STANDARD: {
            return [
              DialogActions.setMaterialFormValue({
                parsedMaterial: {
                  materialName: {
                    title: row.materialStandardMaterialName,
                  } as StringOption,
                  standardDocument: {
                    title: row.materialStandardStandardDocument,
                  } as StringOption,
                  materialNumber: row.materialNumbers?.join(', '),
                } as Partial<MaterialFormValue>,
              }),
            ];
          }
          case NavigationLevel.SUPPLIER: {
            return [
              DialogActions.setMaterialFormValue({
                parsedMaterial: {
                  supplier: {
                    title: row.manufacturerSupplierName,
                  } as StringOption,
                  supplierCountry: {
                    id: row.manufacturerSupplierCountry,
                    title: row.manufacturerSupplierCountry,
                  } as StringOption,
                  supplierPlant: {
                    title: row.manufacturerSupplierPlant,
                  } as StringOption,
                  businessPartnerIds:
                    row.manufacturerSupplierBusinessPartnerIds?.map(
                      (id) => ({ id, title: id.toString() }) as StringOption
                    ),
                  manufacturer: row.manufacturer,
                } as Partial<MaterialFormValue>,
              }),
            ];
          }
          case NavigationLevel.MATERIAL: {
            return isCopy
              ? [
                  DialogActions.fetchEditStandardDocumentData({
                    standardDocument: row.materialStandardStandardDocument,
                  }),
                  DialogActions.fetchEditMaterialNameData({
                    materialName: row.materialStandardMaterialName,
                  }),
                  DialogActions.fetchEditMaterialSuppliers({
                    supplierName: row.manufacturerSupplierName,
                  }),
                ]
              : [DialogActions.parseMaterialFormValue()];
          }
          default: {
            return [];
          }
        }
      })
    );
  });

  public fetchEditStandardDocumentData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchEditStandardDocumentData),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ standardDocument }, materialClass]) =>
        this.msdDataService
          .fetchMaterialNamesForStandardDocuments(
            standardDocument,
            materialClass
          )
          .pipe(
            map((materialNamesList) =>
              materialNamesList.sort((a, b) => a[0] - b[0])
            ),
            map((materialNamesList) => {
              const materialNames = [];
              for (const materialNameTuple of materialNamesList) {
                materialNames.push({
                  id: materialNameTuple[0],
                  materialName: materialNameTuple[1],
                });
              }

              return DialogActions.fetchEditStandardDocumentDataSuccess({
                materialNames,
              });
            }),
            catchError(() =>
              of(DialogActions.fetchEditStandardDocumentDataFailure())
            )
          )
      )
    );
  });

  public fetchEditMaterialNameData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchEditMaterialNameData),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ materialName }, materialClass]) =>
        this.msdDataService
          .fetchStandardDocumentsForMaterialName(materialName, materialClass)
          .pipe(
            map((standardDocumentsList) =>
              standardDocumentsList.sort((a, b) => a[0] - b[0])
            ),
            map((standardDocumentsList) => {
              const standardDocuments: {
                id: number;
                standardDocument: string;
              }[] = [];
              for (const standardDocumentTuple of standardDocumentsList) {
                standardDocuments.push({
                  id: standardDocumentTuple[0],
                  standardDocument: standardDocumentTuple[1],
                });
              }

              return DialogActions.fetchEditMaterialNameDataSuccess({
                standardDocuments,
              });
            }),
            catchError(() =>
              of(DialogActions.fetchEditMaterialNameDataFailure())
            )
          )
      )
    );
  });

  public fetchEditMaterialSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchEditMaterialSuppliers),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ supplierName }, materialClass]) =>
        this.msdDataService
          .fetchManufacturerSuppliersForSupplierName(
            supplierName,
            materialClass
          )
          .pipe(
            map((supplierIds) => supplierIds.sort((a, b) => a - b)),
            map((supplierIds) =>
              DialogActions.fetchEditMaterialSuppliersSuccess({ supplierIds })
            ),
            catchError(() =>
              of(DialogActions.fetchEditMaterialSuppliersFailure())
            )
          )
      )
    );
  });

  public editDialogLoaded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        DialogActions.fetchEditMaterialNameDataSuccess,
        DialogActions.fetchEditMaterialNameDataFailure,
        DialogActions.fetchEditStandardDocumentDataSuccess,
        DialogActions.fetchEditStandardDocumentDataFailure,
        DialogActions.fetchEditMaterialSuppliersSuccess,
        DialogActions.fetchEditMaterialSuppliersFailure
      ),
      map((_action) => {}),
      concatLatestFrom(() => this.dataFacade.editMaterial),
      filter(
        ([_nothing, editMaterial]) =>
          !!editMaterial &&
          !!editMaterial.row &&
          !editMaterial.materialNamesLoading &&
          !editMaterial.standardDocumentsLoading &&
          !editMaterial.supplierIdsLoading &&
          !editMaterial.loadingComplete
      ),
      map((_nothing) => DialogActions.parseMaterialFormValue())
    );
  });

  public parseMaterialFormValue$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.parseMaterialFormValue),
      concatLatestFrom(() => this.dataFacade.editMaterial),
      // eslint-disable-next-line complexity
      map(([_nothing, editMaterial]) => {
        const material: DataResult = editMaterial.row;

        const parsedMaterial: Partial<MaterialFormValue> = {
          manufacturerSupplierId: material.manufacturerSupplierId,
          materialStandardId: material.materialStandardId,
          productCategory: asStringOptionOrUndefined(
            material.productCategory,
            translate(
              `materialsSupplierDatabase.productCategoryValues.${material.productCategory}`
            )
          ),
          referenceDoc: material.referenceDoc?.map((document: string) =>
            asStringOptionOrUndefined(document)
          ),
          co2Scope1: material.co2Scope1,
          co2Scope2: material.co2Scope2,
          co2Scope3: material.co2Scope3,
          co2PerTon: material.co2PerTon,
          co2Classification: {
            id: material.co2Classification,
            title: translate(
              material.co2Classification
                ? `materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues.${material.co2Classification.toLowerCase()}`
                : 'materialsSupplierDatabase.mainTable.dialog.none'
            ),
          },
          releaseDate: material.releaseDate,
          releaseRestrictions: material.releaseRestrictions,
          blocked: material.blocked,
          castingMode: material.castingMode,
          castingDiameter: asStringOptionOrUndefined(material.castingDiameter),
          maxDimension: material.maxDimension,
          minDimension: material.minDimension,
          processTechnology: material.processTechnology,
          processTechnologyComment: material.processTechnologyComment,
          processJson: material.processJson,
          productionProcess: asStringOptionOrUndefined(
            material.productionProcess,
            translate(
              `materialsSupplierDatabase.productionProcessValues.${material.materialClass}.${material.productionProcess}`
            )
          ),
          minRecyclingRate: material.minRecyclingRate,
          maxRecyclingRate: material.maxRecyclingRate,
          rating: asStringOption(
            material.rating,
            material.rating ||
              translate('materialsSupplierDatabase.mainTable.dialog.none')
          ),
          ratingRemark: material.ratingRemark,
          ratingChangeComment: material.ratingChangeComment,
          materialNumber: material.materialNumbers
            ? material.materialNumbers.join(', ')
            : undefined,

          standardDocument: {
            id:
              editMaterial.materialNames?.length > 1
                ? editMaterial.materialNames[0].id
                : material.materialStandardId,
            title: material.materialStandardStandardDocument,
            data: editMaterial.materialNames
              ? {
                  materialNames: editMaterial.materialNames,
                }
              : undefined,
          },
          materialName: {
            id:
              editMaterial.standardDocuments?.length > 1
                ? editMaterial.standardDocuments[0].id
                : material.materialStandardId,
            title: material.materialStandardMaterialName,
            data: editMaterial.standardDocuments
              ? {
                  standardDocuments: editMaterial.standardDocuments,
                }
              : undefined,
          },
          supplier: {
            id:
              editMaterial.supplierIds?.length > 0
                ? editMaterial.supplierIds[0]
                : material.manufacturerSupplierId,
            title: material.manufacturerSupplierName,
          },
          supplierPlant: {
            id: material.manufacturerSupplierPlant,
            title: material.manufacturerSupplierPlant,
            data: {
              supplierId: material.manufacturerSupplierId,
              supplierName: material.manufacturerSupplierName,
              supplierCountry: material.manufacturerSupplierCountry,
            },
          },
          supplierCountry: asStringOptionOrUndefined(
            material.manufacturerSupplierCountry
          ),
          manufacturer: material.manufacturer,
          selfCertified: material.selfCertified,
          condition: asStringOptionOrUndefined(
            material.condition,
            translate(
              `materialsSupplierDatabase.condition.${material.materialClass}.${material.condition}`
            )
          ),
          co2Upstream: material.co2Upstream,
          co2Core: material.co2Core,
          co2ClassificationNew: determineCo2ClassificationNew(
            material.co2ClassificationNew as Co2Classification
          ),
          co2ClassificationNewSecondary: determineCo2ClassificationNewSecondary(
            material.co2ClassificationNew as Co2Classification
          ),
          co2Standard: asStringOptionOrUndefined(material.co2Standard),
          co2Comment: material.co2Comment,
          productCategoryRule: asStringOptionOrUndefined(
            material.productCategoryRuleId,
            material.productCategoryRuleTitle,
            material.productCategoryRuleTitle
          ),
          reportValidUntil: material.reportValidUntil,
          dataQualityRating: material.dataQualityRating,
          primaryDataShare: material.primaryDataShare,
          co2UploadFileId: material.co2UploadFileId,
          co2UploadFileFilename: material.co2UploadFileFilename,
        };

        return DialogActions.setMaterialFormValue({ parsedMaterial });
      })
    );
  });

  public setMaterialFormValue$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.setMaterialFormValue),
      map(() => DialogActions.editDialogLoadingComplete())
    );
  });

  public fetchProcessTechnologyComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchProcessTechnologyComments),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ technology }, materialClass]) =>
        this.msdDataService
          .fetchProcessTechnologyComments(technology, materialClass)
          .pipe(
            map((values) =>
              DialogActions.fetchProcessTechnologyCommentsSuccess({
                values,
              })
            ),
            catchError(() =>
              of(DialogActions.fetchProcessTechnologyCommentsFailure())
            )
          )
      )
    );
  });

  public fetchProcessJsonComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchProcessJsonComments),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ technology }, materialClass]) =>
        this.msdDataService
          .fetchProcessJsonComments(technology, materialClass)
          .pipe(
            map((comments: string[]) =>
              DialogActions.fetchProcessJsonCommentsSuccess({
                technology,
                comments,
              })
            ),
            catchError(() =>
              of(
                DataActions.errorSnackBar({
                  message: translate(
                    'materialsSupplierDatabase.mainTable.uploadDialog.uploadFailure'
                  ),
                })
              )
            )
          )
      )
    );
  });

  public uploadSapMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.uploadSapMaterials),
      switchMap(({ upload }) =>
        this.msdDataService.uploadSapMaterials(upload).pipe(
          mergeMap((httpEvent: HttpEvent<SapMaterialsUploadResponse>) => {
            if (httpEvent.type === HttpEventType.UploadProgress) {
              const progressEvent = httpEvent as HttpProgressEvent;
              const fileUploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              return of(
                DialogActions.setSapMaterialsFileUploadProgress({
                  fileUploadProgress,
                })
              );
            } else if (httpEvent.type === HttpEventType.Response) {
              const uploadId = (
                httpEvent as HttpResponse<SapMaterialsUploadResponse>
              ).body.uploadId;

              this.msdDataService.storeSapMaterialsUploadId(uploadId);

              return of(
                DialogActions.uploadSapMaterialsSuccess({
                  uploadId,
                })
              );
            }

            return of();
          }),
          catchError(() => {
            return of(
              DataActions.errorSnackBar({
                message: translate(
                  'materialsSupplierDatabase.mainTable.uploadDialog.uploadFailure'
                ),
              }),
              DialogActions.uploadSapMaterialsFailure()
            );
          })
        )
      )
    );
  });

  startPollingSapMaterialsDatabaseUploadStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.startPollingSapMaterialsDatabaseUploadStatus),
      switchMap(({ uploadId }) =>
        timer(
          // we don't need to start the polling immediately as the data will not be saved in the DB immediately after the file has been uploaded.
          this.SAP_MATERIALS_DATABASE_UPLOAD_STATUS_POLLING_INTERVAL,
          this.SAP_MATERIALS_DATABASE_UPLOAD_STATUS_POLLING_INTERVAL
        ).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(DialogActions.stopPollingSapMaterialsDatabaseUploadStatus)
            )
          ),
          switchMap(() =>
            this.msdDataService
              .getSapMaterialsDatabaseUploadStatus(uploadId)
              .pipe(
                map(
                  (
                    databaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse
                  ) =>
                    DialogActions.getSapMaterialsDatabaseUploadStatusSuccess({
                      databaseUploadStatus,
                    })
                ),
                catchError(() => {
                  this.dataFacade.errorSnackBar(
                    translate(
                      'materialsSupplierDatabase.mainTable.uploadStatusDialog.getDatabaseUploadStatusFailure'
                    )
                  );

                  return of(
                    DialogActions.getSapMaterialsDatabaseUploadStatusFailure(),
                    DialogActions.stopPollingSapMaterialsDatabaseUploadStatus() // stop polling on failure
                  );
                })
              )
          )
        )
      )
    );
  });

  public getSapMaterialsDatabaseUploadStatusSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.getSapMaterialsDatabaseUploadStatusSuccess),
      filter(
        ({ databaseUploadStatus }) =>
          databaseUploadStatus.status !==
          SapMaterialsDatabaseUploadStatus.RUNNING
      ),
      switchMap(() =>
        of(DialogActions.stopPollingSapMaterialsDatabaseUploadStatus())
      )
    );
  });

  public sapMaterialsUploadStatusReset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.sapMaterialsUploadStatusReset),
      switchMap(() => {
        this.msdDataService.removeSapMaterialsUploadId();

        return [] as Action[];
      })
    );
  });

  downloadRejectedSapMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.downloadRejectedSapMaterials),
      switchMap(() =>
        this.msdDataService
          .getRejectedSapMaterials(
            this.msdDataService.getSapMaterialsUploadId()
          )
          .pipe(
            mergeMap((rejectedSapMaterials: SAPMaterial[]) => {
              this.msdSapMaterialsExcelService.downloadRejectedSapMaterialsAsExcel(
                rejectedSapMaterials
              );

              return of(DialogActions.downloadRejectedSapMaterialsSuccess());
            }),
            catchError(() => {
              return of(
                DataActions.errorSnackBar({
                  message: translate(
                    'materialsSupplierDatabase.mainTable.uploadStatusDialog.downloadRejectedSapMaterialsFailure'
                  ),
                }),
                DialogActions.downloadRejectedSapMaterialsFailure()
              );
            })
          )
      )
    );
  });

  clearRejectedSapMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.clearRejectedSapMaterials),
      concatLatestFrom(
        () => this.dialogFacade.sapMaterialsDatabaseUploadStatus$
      ),
      switchMap(([_, { rejectedCount }]) => {
        if (rejectedCount) {
          return this.msdDataService
            .deleteRejectedSapMaterials(
              this.msdDataService.getSapMaterialsUploadId()
            )
            .pipe(
              mergeMap(() =>
                of(DialogActions.clearRejectedSapMaterialsSuccess())
              ),
              catchError(() => {
                return of(
                  DataActions.errorSnackBar({
                    message: translate(
                      'materialsSupplierDatabase.mainTable.uploadStatusDialog.clearRejectedSapMaterialsFailure'
                    ),
                  }),
                  DialogActions.clearRejectedSapMaterialsFailure()
                );
              })
            );
        }

        return of();
      })
    );
  });

  public bulkEditMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.bulkEditMaterials),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ materials }, materialClass]) =>
        this.msdDataService.bulkEditMaterial(materials, materialClass).pipe(
          mergeMap(() =>
            of(
              DialogActions.bulkEditMaterialsSuccess(),
              DataActions.fetchResult()
            )
          ),
          catchError(() => {
            return of(
              DataActions.errorSnackBar({
                message: translate(
                  'materialsSupplierDatabase.mainTable.referenceDocumentBulkEditDialog.failure'
                ),
              }),
              DialogActions.bulkEditMaterialsFailure()
            );
          })
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly fileService: FileService,
    private readonly msdDataService: MsdDataService,
    private readonly dataFacade: DataFacade,
    private readonly dialogFacade: DialogFacade,
    private readonly msdSapMaterialsExcelService: MsdSapMaterialsExcelService
  ) {}

  private parseBulkErrors(error: any, materials: MaterialRequest[]) {
    interface ErrorDef {
      id: number;
      message: string;
    }
    const ed = (Array.isArray(error) ? error[0] : error) as ErrorDef;

    return {
      message: ed.message,
      items: this.convertToProperties(materials.find((mr) => mr.id === ed.id)),
    };
  }

  private convertToProperties(dataObj: any) {
    return dataObj
      ? Object.keys(dataObj)
          .map((key) => ({
            key: this.translateKey(key),
            value: dataObj[key],
          }))
          .filter((item) => item.key && (item.value || item.value === 0))
      : [];
  }

  private translateKey(key: string) {
    const longKey = `materialsSupplierDatabase.mainTable.columns.${key}`;
    const result = translate(longKey);

    return result === longKey ? undefined : result;
  }
}
