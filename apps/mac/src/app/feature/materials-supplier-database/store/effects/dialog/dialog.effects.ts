/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { catchError, filter, map, of, switchMap } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  CreateMaterialState,
  ManufacturerSupplierV2,
  MaterialFormValue,
  MaterialFormValueV2,
  MaterialStandardV2,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable()
export class DialogEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService,
    private readonly dataFacade: DataFacade
  ) {}

  public materialDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.materialDialogOpened),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      map(([_action, materialClass]) => {
        const baseActions = [
          DialogActions.fetchMaterialStandards(),
          DialogActions.fetchCo2Classifications(),
          DialogActions.fetchManufacturerSuppliers(),
          DialogActions.fetchProductCategories(),
        ];
        switch (materialClass) {
          case MaterialClass.ALUMINUM:
            return baseActions;
          case MaterialClass.STEEL:
            return [
              ...baseActions,
              DialogActions.fetchRatings(),
              DialogActions.fetchSteelMakingProcesses(),
              DialogActions.fetchCastingModes(),
            ];
          default:
            return baseActions;
        }
      }),
      switchMap((actions) => actions)
    );
  });

  public fetchMaterialStandards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchMaterialStandards),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchMaterialStandards(materialClass).pipe(
          map((materialStandards: MaterialStandardV2[]) =>
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
          map((manufacturerSuppliers: ManufacturerSupplierV2[]) =>
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

  public fetchSteelMakingProcesses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchSteelMakingProcesses),
      switchMap(() =>
        this.msdDataService.fetchSteelMakingProcesses().pipe(
          map((steelMakingProcesses: string[]) =>
            DialogActions.fetchSteelMakingProcessesSuccess({
              steelMakingProcesses,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchSteelMakingProcessesFailure()))
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

  public materialDialogConfirmed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.materialDialogConfirmed),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ standard, supplier, material }, materialClass]) => [
        DialogActions.postMaterialStandard({
          record: {
            standard,
            supplier,
            material,
            materialClass,
            state: CreateMaterialState.Initial,
            error: false,
          },
        }),
      ])
    );
  });

  public postMaterialStandard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postMaterialStandard),
      switchMap(({ record }) =>
        record.standard.id
          ? // material standard already exists
            of(
              DialogActions.postManufacturerSupplier({
                record: {
                  ...record,
                  state: CreateMaterialState.MaterialStandardSkipped,
                },
              })
            )
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
                      state: CreateMaterialState.MaterialStandardCreated,
                    },
                  })
                ),
                // TODO: implement proper error handling
                catchError(() =>
                  of(
                    DialogActions.createMaterialComplete({
                      record: {
                        ...record,
                        state:
                          CreateMaterialState.MaterialStandardCreationFailed,
                        error: true,
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
            of(
              DialogActions.postMaterial({
                record: {
                  ...record,
                  state: CreateMaterialState.ManufacturerSupplierSkipped,
                },
              })
            )
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
                      state: CreateMaterialState.ManufacturerSupplierCreated,
                    },
                  })
                ),
                // TODO: implement proper error handling
                catchError(() =>
                  of(
                    DialogActions.createMaterialComplete({
                      record: {
                        ...record,
                        state:
                          CreateMaterialState.ManufacturerSupplierCreationFailed,
                        error: true,
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
      switchMap(({ record }) =>
        this.msdDataService
          .createMaterial(record.material, record.materialClass)
          .pipe(
            map(() =>
              DialogActions.createMaterialComplete({
                record: {
                  ...record,
                  // there is currently no place in Material to store the ID...
                  state: CreateMaterialState.MaterialCreated,
                },
              })
            ),
            // TODO: implement proper error handling
            catchError(() =>
              of(
                DialogActions.createMaterialComplete({
                  record: {
                    ...record,
                    state: CreateMaterialState.MaterialCreationFailed,
                    error: true,
                  },
                })
              )
            )
          )
      )
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
      switchMap(([{ materialStandardId }, materialClass]) => {
        if (!materialStandardId) {
          return of(
            DialogActions.fetchReferenceDocumentsSuccess({
              referenceDocuments: [],
            })
          );
        }

        return this.msdDataService
          .fetchReferenceDocuments(materialStandardId, materialClass)
          .pipe(
            map((referenceDocuments) => {
              const parsedDocuments: string[] = [];
              for (const documents of referenceDocuments) {
                // TODO: can be removed as soon as it is guaranteed that we have only parsable options in the db (not during we still work on the modification of materials)
                try {
                  JSON.parse(documents).map((document: string) =>
                    parsedDocuments.push(document)
                  );
                } catch {
                  parsedDocuments.push(documents);
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
      switchMap(({ row }) => [
        DialogActions.fetchEditStandardDocumentData({
          standardDocument: row.materialStandardStandardDocument,
        }),
        DialogActions.fetchEditMaterialNameData({
          materialName: row.materialStandardMaterialName,
        }),
        DialogActions.fetchEditMaterialSuppliers({
          supplierName: row.manufacturerSupplierName,
        }),
      ])
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
      map(([_nothing, editMaterial]) => {
        const material = editMaterial.row;

        let referenceDocValue;
        try {
          referenceDocValue = JSON.parse(material.referenceDoc || '[]').map(
            (document: string) => ({ id: document, title: document })
          );
        } catch {
          referenceDocValue = [
            { id: material.referenceDoc, title: material.referenceDoc },
          ];
        }

        const parsedMaterial: Partial<MaterialFormValue | MaterialFormValueV2> =
          {
            manufacturerSupplierId: material.manufacturerSupplierId,
            materialStandardId: material.materialStandardId,
            productCategory: {
              id: material.productCategory,
              title: translate(
                `materialsSupplierDatabase.productCategoryValues.${material.productCategory}`
              ),
            },
            referenceDoc: referenceDocValue,
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
            releaseDateYear: material.releaseDateYear,
            releaseDateMonth: material.releaseDateMonth,
            releaseRestrictions: material.releaseRestrictions,
            blocked: material.blocked,
            castingMode: material.castingMode,
            castingDiameter: material.castingDiameter
              ? {
                  id: material.castingDiameter,
                  title: material.castingDiameter,
                }
              : undefined,
            maxDimension: material.maxDimension,
            minDimension: material.minDimension,
            steelMakingProcess: material.steelMakingProcess
              ? {
                  id: material.steelMakingProcess,
                  title: material.steelMakingProcess,
                }
              : undefined,
            rating: material.rating
              ? { id: material.rating, title: material.rating }
              : {
                  id: undefined,
                  title: translate(
                    'materialsSupplierDatabase.mainTable.dialog.none'
                  ),
                },
            ratingRemark: material.ratingRemark,
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
            supplierCountry: {
              id: material.manufacturerSupplierCountry,
              title: material.manufacturerSupplierCountry,
            },
            manufacturer: material.manufacturer,
            selfCertified: material.selfCertified,
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

  public fetchSteelMakingProcessesInUse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchSteelMakingProcessesInUse),
      switchMap(({ supplierId, castingMode, castingDiameter }) =>
        this.msdDataService
          .fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter(
            supplierId,
            castingMode,
            castingDiameter
          )
          .pipe(
            map((steelMakingProcessesInUse) =>
              DialogActions.fetchSteelMakingProcessesInUseSuccess({
                steelMakingProcessesInUse,
              })
            ),
            catchError(() =>
              of(DialogActions.fetchSteelMakingProcessesInUseFailure())
            )
          )
      )
    );
  });

  public fetchCo2ValuesForSupplierSteelMakingProcess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCo2ValuesForSupplierSteelMakingProcess),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([{ supplierId, steelMakingProcess }, materialClass]) =>
        this.msdDataService
          .fetchCo2ValuesForSupplierPlantProcess(
            supplierId,
            materialClass,
            steelMakingProcess
          )
          .pipe(
            map((co2Values) =>
              DialogActions.fetchCo2ValuesForSupplierSteelMakingProcessSuccess({
                co2Values,
              })
            ),
            catchError(() =>
              of(
                DialogActions.fetchCo2ValuesForSupplierSteelMakingProcessFailure()
              )
            )
          )
      )
    );
  });
}
