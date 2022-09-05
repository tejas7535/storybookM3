import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import * as d3Selection from 'd3-selection';

import { DimensionFluctuationData } from '../models/dimension-fluctuation-data.model';
import { OrgChartNode } from './models/org-chart-node.model';

@Injectable({
  providedIn: 'root',
})
export class OrgChartService {
  public static readonly ROOT_ID = 'ROOT';

  mapOrgUnitsToNodes(data: DimensionFluctuationData[]): OrgChartNode[] {
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
        const name = elem.managerOfOrgUnit;
        const organization = elem.dimension;
        const expanded = false;
        const directSubordinates = elem.directEmployees;
        const totalSubordinates = elem.totalEmployees;
        const directAttrition = elem.directAttrition;
        const totalAttrition = elem.totalAttrition;
        const textColumnDirect = translate(
          'organizationalView.orgChart.table.columnDirect'
        );
        const textColumnOverall = translate(
          'organizationalView.orgChart.table.columnOverall'
        );
        const textRowEmployees = translate(
          'organizationalView.orgChart.table.rowEmployees'
        );
        const textRowAttrition = translate(
          'organizationalView.orgChart.table.rowAttrition'
        );

        // TODO: calculate heat
        const heatMapClass = 'bg-secondary-900';

        // switch (elem.attritionMeta?.heatType) {
        //   case HeatType.GREEN_HEAT:
        //     heatMapClass = 'bg-primary';
        //     break;
        //   case HeatType.ORANGE_HEAT:
        //     heatMapClass = 'bg-sunny-yellow';
        //     break;
        //   case HeatType.RED_HEAT:
        //     heatMapClass = 'bg-error';
        //     break;
        //   default:
        //     heatMapClass = 'bg-selected-overlay';
        // }

        return {
          nodeId,
          parentNodeId,
          expanded,
          name,
          organization,
          heatMapClass,
          directSubordinates,
          totalSubordinates,
          directAttrition,
          totalAttrition,
          textColumnDirect,
          textColumnOverall,
          textRowEmployees,
          textRowAttrition,
          showUpperParentBtn:
            parentNodeId === undefined &&
            elem.parentId !== OrgChartService.ROOT_ID,
        };
      })
      .sort((a, b) => (a.organization > b.organization ? 1 : -1)); // sort alphabetically to ensure same order on every reload
  }

  updateLinkStyles(): void {
    d3Selection
      .select('.svg-chart-container')
      .attr('stroke', 'rgba(0,0,0,0.11)')
      .attr('stroke-width', 1);
  }

  getButtonContent(node: any): string {
    return `
    <div class="pointer-events-auto cursor-pointer w-full
              bg-surface border border-border hover:ring-1 hover:ring-medium-emphasis
                rounded-full flex flex-col items-center justify-center
              text-low-emphasis hover:text-medium-emphasis">
      <span>${node.data._directSubordinates}</span>
      <span class="${
        node.children
          ? "before:content-['\\e313']"
          : "before:content-['\\e316']"
      } before:font-materiaIcons"></span>
    </div>
  `;
  }

  getNodeContent(data: OrgChartNode): string {
    const upwardsButton = `
      <div class="
          pointer-events-auto cursor-pointer bg-surface text-low-emphasis rounded-full
          flex flex-col items-center justify-center
          absolute left-1/2 transform -translate-x-1/2 w-6 h-6 text-[24px] -top-11
          hover:text-medium-emphasis hover:ring-1 hover:ring-mediumEmphasis">
        <span id="show-parent" data-id="${data.nodeId}" class="before:content-['\\e5d8'] before:font-materiaIcons"></span>
      </div>
    `;

    return `
          <div class="relative border border-border rounded-sm h-full flex flex-col px-2">
            ${data.showUpperParentBtn ? upwardsButton : ''}
            <div class="flex justify-center rounded-2xl py-2 -my-4
              ${data.heatMapClass}">
                <span class="text-body-2 ${
                  data.heatMapClass !== undefined
                    ? 'text-high-emphasis-dark-bg'
                    : 'text-high-emphasis'
                }">${data.organization}</span>
            </div>
            <div class="text-high-emphasis text-body-1 mt-6 mb-2 text-center">${
              data.name
            }</div>

            <table class="table-fixed">
              <thead>
                <tr class="font-semibold uppercase text-low-emphasis divide-x divide-border">
                  <th class="w-1/3">&nbsp;</th>
                  <th class="w-1/3 tracking-widest">${
                    data.textColumnDirect
                  }</th>
                  <th class="w-1/3 tracking-widest">${
                    data.textColumnOverall
                  }</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center h-9 divide-x divide-border">
                  <td class="flex text-body-2 text-low-emphasis gap-1 items-center h-full">
                    <span class="text-[16px] before:font-materiaIcons before:content-['person'] before:block text-link"></span>
                    <span>${data.textRowEmployees}</span>
                  </td>
                  <td class="text-body-2 h-9">${data.directSubordinates}</td>
                  <td class="text-body-2">${data.totalSubordinates}</td>
                </tr>
                <tr class="text-center h-9 divide-x divide-border">
                  <td class="flex text-body-2 text-low-emphasis gap-1 items-center h-full">
                    <span class="text-[16px] before:font-materiaIcons before:content-['\\e26a'] before:block text-link"></span>
                    <span>${data.textRowAttrition}</span>
                  </td>
                  <td class="text-body-2">${data.directAttrition}</td>
                  <td class="text-body-2">${data.totalAttrition}</td>
                </tr>
              </tbody>
            </table>
            <div class="flex-1 flex justify-between items-center px-4">
                <span id="employee-node-people" data-id="${
                  data.nodeId
                }" class="before:content-['people'] before:font-materiaIcons cursor-pointer text-[24px] text-low-emphasis hover:text-medium-emphasis"></span>
                <span id="employee-node-attrition" data-id="${
                  data.nodeId
                }" class="before:content-['\\e24b'] before:font-materiaIcons cursor-pointer text-[24px] text-low-emphasis hover:text-medium-emphasis"></span>
            </div>
          </div>
        `;
  }
}
