/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { combineLatest, map } from 'rxjs';

import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';

@Injectable({
  providedIn: 'root',
})
export class ResultDataService {
  private readonly selectionFacade = inject(CalculationSelectionFacade);
  private readonly calculationResultFacade = inject(CalculationResultFacade);

  public readonly selectedBearingOption = toSignal(
    this.selectionFacade.selectedBearingOption$
  );

  public readonly reportSelectionTypes = toSignal(
    this.calculationResultFacade.reportSelectionTypes$
  );

  public selectedBearing = computed(() => this.selectedBearingOption()?.title);

  public isResultAvailable = toSignal(
    this.calculationResultFacade.isResultAvailable$
  );

  public readonly inputs = toSignal(
    this.calculationResultFacade.getCalculationInputs$
  );

  public readonly mountingRecommendations = toSignal(
    this.calculationResultFacade.mountingRecommendations$
  );

  public readonly radialClearance = toSignal(
    this.calculationResultFacade.radialClearance$
  );

  public readonly clearanceClasses = toSignal(
    this.calculationResultFacade.radialClearanceClasses$
  );

  public readonly startPositions = toSignal(
    this.calculationResultFacade.startPositions$
  );

  public readonly endPositions = toSignal(
    this.calculationResultFacade.endPositions$
  );

  public readonly hasMountingTools = toSignal(
    this.calculationResultFacade.hasMountingTools$
  );

  public readonly mountingTools = toSignal(
    this.calculationResultFacade.mountingTools$
  );

  public readonly alternativePumps = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools.pumps.items.filter((pump) => !pump.isRecommended);
  });

  public readonly recommendedPump = computed(() => {
    const mountingTools = this.mountingTools();
    const firstRecommendedPump = mountingTools.pumps.items.find(
      (pump) => pump.isRecommended
    );

    return firstRecommendedPump;
  });

  public readonly allPumps = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools.pumps.items;
  });

  public additionalTools = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools.additionalTools;
  });

  public readonly pumpsTile = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools.pumps.title;
  });

  public readonly nutItem = computed(() => {
    const mountingTools = this.mountingTools();

    const hydraulicNut = mountingTools.hydraulicNut?.[0];
    const lockNut = mountingTools.locknut?.[0];

    return hydraulicNut ?? lockNut;
  });

  public readonly sleeveConnectors = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools?.sleeveConnectors || [];
  });

  public readonly imageProductsIds = computed(() => {
    const ids = [];

    const nut = this.nutItem();
    if (nut?.value) {
      ids.push(nut.value);
    }

    const allPumps = this.allPumps();
    if (allPumps?.length) {
      const allPumpIds = allPumps
        .filter((pump) => pump?.value)
        .map((pump) => pump.value);

      ids.push(...allPumpIds);
    }

    const additionalTools = this.additionalTools();
    if (additionalTools?.length) {
      const toolIds = additionalTools
        .filter((tool) => tool?.value)
        .map((tool) => tool.value);

      ids.push(...toolIds);
    }

    return ids;
  });

  public readonly productsLinksWithQrCodeIds = computed(() => {
    const ids = [];

    ids.push(...this.imageProductsIds());

    const sleeveConnectors = this.sleeveConnectors();

    if (sleeveConnectors?.length === 2) {
      const connectorId = sleeveConnectors[0].value;
      ids.push(connectorId);
    }

    return ids;
  });

  public readonly categorizedMessages = toSignal(
    combineLatest([
      this.calculationResultFacade.getCalulationMessages$,
      this.calculationResultFacade.bearinxVersions$,
    ]).pipe(
      map(([reportMessages, bearinxVersion]) => {
        const errors = reportMessages?.errors || [];
        const warnings = reportMessages?.warnings || [];
        // Merge original notes with BearinX version
        const notes = [...(reportMessages?.notes || [])];

        if (bearinxVersion) {
          notes.push(bearinxVersion);
        }

        return { errors, warnings, notes };
      })
    )
  );

  public readonly messages = toSignal(
    combineLatest([
      this.calculationResultFacade.getCalulationMessages$,
      this.calculationResultFacade.bearinxVersions$,
    ]).pipe(
      map(([reportMessages, bearinxVersion]) => {
        const messages = [];

        if (reportMessages) {
          messages.push(
            ...(reportMessages.errors || []),
            ...(reportMessages.warnings || []),
            ...(reportMessages.notes || [])
          );
        }

        if (bearinxVersion) {
          messages.push(bearinxVersion);
        }

        return messages;
      })
    )
  );
}
