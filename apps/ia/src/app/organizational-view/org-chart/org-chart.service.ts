import { Injectable } from '@angular/core';

import { ECActionEvent } from 'echarts/types/src/util/types';

import { FilterDimension, HeatType } from '../../shared/models';
import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
import { DimensionFluctuationData, OrgChartFluctuationRate } from '../models';
import { OrgChartNode } from './models/org-chart-node.model';
import { OrgChartTemplateService } from './org-chart-template.service';

@Injectable({
  providedIn: 'root',
})
export class OrgChartService {
  readonly ROOT_ID = 'ROOT';
  readonly HIGHLIGHT_COLOR = 'rgba(0, 0, 0, 0.87)';

  constructor(
    private readonly orgChartTemplateService: OrgChartTemplateService
  ) {}

  createAttritionDialogMeta(
    node: DimensionFluctuationData,
    timeRange: string,
    openPositionsAvailable: boolean
  ): AttritionDialogMeta {
    return {
      data: {
        fluctuationRate: node.fluctuationRate.fluctuationRate,
        unforcedFluctuationRate: node.fluctuationRate.unforcedFluctuationRate,
        forcedFluctuationRate: node.fluctuationRate.forcedFluctuationRate,
        remainingFluctuationRate: node.fluctuationRate.remainingFluctuationRate,
        employeesLost: node.attritionMeta.employeesLost,
        unforcedFluctuation: node.attritionMeta.unforcedFluctuation,
        forcedFluctuation: node.attritionMeta.forcedFluctuation,
        remainingFluctuation: node.attritionMeta.remainingFluctuation,
        resignationsReceived: node.attritionMeta.resignationsReceived,
        employeesAdded: node.attritionMeta.employeesAdded,
        openPositions: node.attritionMeta.openPositions,
        title: node.dimension,
        hideDetailedLeaverStats: node.attritionMeta.responseModified,
        avgHeadcount: node.attritionMeta.avgHeadcount,
        openPositionsAvailable,
        heatType: HeatType.NONE,
      },
      showAttritionRates: true,
      selectedTimeRange: timeRange,
    };
  }

  mapDimensionDataToNodes(
    data: DimensionFluctuationData[],
    translations: any,
    fluctuationType: FluctuationType
  ): OrgChartNode[] {
    const textDirectOverall = translations.directOverall;
    const textEmployees = translations.employees;
    const textFluctuation = translations.fluctuation;
    const textRelativeFluctuation = translations.relativeFluctuation;
    const textAbsoluteFluctuation = translations.absoluteFluctuation;
    const textWarningAbsoluteFluctuation =
      translations.absoluteFluctuationNoUserRights;
    const textWarningRelativeFluctuation =
      translations.relativeFluctuationTooLowHCO;
    const heatMapClass = 'bg-secondary-900';

    return data
      .map((elem: DimensionFluctuationData) => {
        let parentNodeId = elem.parentId;

        // check if current node is local root
        if (
          elem.parentId &&
          !data.map((empl) => empl.id).includes(elem.parentId)
        ) {
          // user has a parent that is out of scope -> local root
          parentNodeId = undefined;
        }

        const nodeId = elem.id;
        const dimensionKey = elem.dimensionKey;
        const name = elem.managerOfOrgUnit;
        const organization = elem.dimension;
        const organizationLongName = elem.dimensionLongName;
        const expanded = false;
        const directSubordinates = elem.directEmployees;
        const totalSubordinates = elem.totalEmployees;
        const fluctuationRate = this.createOrgChartFluctuationRate(
          elem.fluctuationRate
        );
        const directFluctuationRate = this.createOrgChartFluctuationRate(
          elem.directFluctuationRate
        );
        const absoluteFluctuation = this.createOrgChartFluctuationRate(
          elem.absoluteFluctuation
        );
        const directAbsoluteFluctuation = this.createOrgChartFluctuationRate(
          elem.directAbsoluteFluctuation
        );

        const displayedTotalFluctuationRate = this.getDisplayedValues(
          fluctuationType,
          fluctuationRate
        );
        const displayedDirectFluctuationRate = this.getDisplayedValues(
          fluctuationType,
          directFluctuationRate
        );
        const displayedAbsoluteFluctuation = this.getDisplayedValues(
          fluctuationType,
          absoluteFluctuation
        );
        const displayedDirectAbsoluteFluctuation = this.getDisplayedValues(
          fluctuationType,
          directAbsoluteFluctuation
        );

        return {
          nodeId,
          parentNodeId,
          dimensionKey,
          expanded,
          name,
          organizationLongName,
          organization,
          heatMapClass,
          directSubordinates,
          totalSubordinates,
          fluctuationRate,
          directFluctuationRate,
          absoluteFluctuation,
          directAbsoluteFluctuation,
          displayedTotalFluctuationRate,
          displayedDirectFluctuationRate,
          displayedAbsoluteFluctuation,
          displayedDirectAbsoluteFluctuation,
          textDirectOverall,
          textEmployees,
          textFluctuation,
          textRelativeFluctuation,
          textAbsoluteFluctuation,
          textWarningAbsoluteFluctuation,
          textWarningRelativeFluctuation,
          showUpperParentBtn:
            parentNodeId === undefined && elem.parentId !== this.ROOT_ID,
        };
      })
      .sort((a, b) => (a.organization > b.organization ? 1 : -1)); // sort alphabetically to ensure same order on every reload
  }

  createOrgChartFluctuationRate(elem: OrgChartFluctuationRate) {
    return {
      fluctuationRate: elem.fluctuationRate,
      unforcedFluctuationRate: elem.unforcedFluctuationRate,
      forcedFluctuationRate: elem.forcedFluctuationRate,
      remainingFluctuationRate: elem.remainingFluctuationRate,
    };
  }

  getDisplayedValues(
    fluctuationType: FluctuationType,
    fluctuationRate: OrgChartFluctuationRate
  ): number {
    switch (fluctuationType) {
      case FluctuationType.TOTAL: {
        return fluctuationRate.fluctuationRate;
      }
      case FluctuationType.UNFORCED: {
        return fluctuationRate.unforcedFluctuationRate;
      }
      case FluctuationType.FORCED: {
        return fluctuationRate.forcedFluctuationRate;
      }
      case FluctuationType.REMAINING: {
        return fluctuationRate.remainingFluctuationRate;
      }
      default: {
        return fluctuationRate.fluctuationRate;
      }
    }
  }

  updateLinkStyles(links: any[]): void {
    links.forEach((elem: any) => {
      if (elem.__data__.data._upToTheRootHighlighted) {
        elem.setAttribute('stroke', this.HIGHLIGHT_COLOR);
        elem.setAttribute('stroke-width', '2px');
      } else {
        elem.setAttribute('stroke', 'rgba(0,0,0,0.11)');
        elem.setAttribute('stroke-width', '1px');
      }
    });
  }

  getButtonContent = (node: any): string =>
    this.orgChartTemplateService.getButtonContent(node);

  getNodeContent = (
    data: OrgChartNode,
    width: number,
    height: number,
    dimension: FilterDimension
  ): string =>
    dimension === FilterDimension.ORG_UNIT
      ? this.getOrgUnitNodeContent(data, width, height)
      : this.getGeneralNodeContent(data, width, height);

  getOrgUnitNodeContent = (
    data: OrgChartNode,
    width: number,
    height: number
  ): string =>
    this.orgChartTemplateService.getOrgUnitNodeContent(
      data,
      width,
      height,
      this.HIGHLIGHT_COLOR
    );

  getGeneralNodeContent = (
    data: OrgChartNode,
    width: number,
    height: number
  ): string =>
    this.orgChartTemplateService.getGeneralNodeContent(
      data,
      width,
      height,
      this.HIGHLIGHT_COLOR
    );

  setFluctuationRatesToDisplay(
    chartData: OrgChartNode[],
    fluctuationType: FluctuationType
  ) {
    chartData.forEach((node) => {
      node.displayedTotalFluctuationRate = this.getDisplayedValues(
        fluctuationType,
        node.fluctuationRate
      );
      node.displayedDirectFluctuationRate = this.getDisplayedValues(
        fluctuationType,
        node.directFluctuationRate
      );
      node.displayedAbsoluteFluctuation = this.getDisplayedValues(
        fluctuationType,
        node.absoluteFluctuation
      );
      node.displayedDirectAbsoluteFluctuation = this.getDisplayedValues(
        fluctuationType,
        node.directAbsoluteFluctuation
      );
    });
  }

  // Find the parent node (SVG element) of the event target
  findParentSVG(d3Selection: any, event: ECActionEvent) {
    let node = d3Selection.select(event.target).node();
    while (node && node.classList && !node.classList.contains('node')) {
      node = node.parentNode;
    }

    return node?.classList?.contains('node') ? node : undefined;
  }
}
