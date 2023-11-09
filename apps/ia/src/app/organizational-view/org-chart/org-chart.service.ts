import { Injectable } from '@angular/core';

import * as d3Selection from 'd3-selection';

import { FilterDimension } from '../../shared/models';
import { DimensionFluctuationData } from '../models';
import { OrgChartNode } from './models/org-chart-node.model';

@Injectable({
  providedIn: 'root',
})
export class OrgChartService {
  public static readonly ROOT_ID = 'ROOT';

  mapDimensionDataToNodes(
    data: DimensionFluctuationData[],
    translations: any
  ): OrgChartNode[] {
    const textColumnDirect = translations.columnDirect;
    const textRowEmployees = translations.rowEmployees;
    const textRowAttrition = translations.rowAttrition;
    const textColumnOverall = translations.columnOverall;

    // TODO: calculate heat
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
        const name = elem.managerOfOrgUnit;
        const organization = elem.dimension;
        const organizationLongName = elem.dimensionLongName;
        const expanded = false;
        const directSubordinates = elem.directEmployees;
        const totalSubordinates = elem.totalEmployees;
        const directAttrition = elem.directAttrition;
        const totalAttrition = elem.totalAttrition;

        return {
          nodeId,
          parentNodeId,
          expanded,
          name,
          organizationLongName,
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

  getNodeContent(
    data: OrgChartNode,
    width: number,
    height: number,
    dimension: FilterDimension
  ): string {
    const isOrgUnit = dimension === FilterDimension.ORG_UNIT;
    const marginBottom = isOrgUnit ? '0.5' : '1.5';
    const arrowMarginTopClass = isOrgUnit ? '-mt-14' : '-mt-12';
    const upwardsButton = `
            <div class="pointer-events-auto cursor-pointer text-low-emphasis group
                absolute mx-auto right-0 left-0 w-6 h-6 text-[24px] ${arrowMarginTopClass}">
              <span id="show-parent" data-id="${data.nodeId}" 
                class="w-6 h-6 rounded-full before:content-['\\e5d8'] before:font-materiaIcons group-hover:text-[#00893d]">
              </span>
            </div>
          `;

    return `
            <div style="padding-left:70px;width:${
              width - 70
            }px;height:${height}px">
            ${data.showUpperParentBtn ? upwardsButton : ''}

              <div class="-ml-[70px] px-2 border-2 border-border rounded-md" style="height:${height}px;width:${width}px;">
                <div class="py-2 rounded-full bg-gray-300 ${
                  isOrgUnit ? '-mt-8' : '-mt-5'
                }"
                   style="margin-bottom:${marginBottom}rem;">
                  <span class="block text-body-2 text-high-emphasis text-center">
                    ${data.organization}
                  </span>
                  <span class="${
                    data.organizationLongName ? 'block' : 'hidden'
                  } text-body-2 text-medium-emphasis text-center">
                  ${data.organizationLongName}
                </span>
                </div>
              ${
                isOrgUnit
                  ? this.getOrgUnitTable(data)
                  : this.getGeneralDimensionGrid(data)
              }
                <div class="grid grid-cols-2 gap-2 text-center flex-1 mt-3">
                  <span id="employee-node-people" data-id="${
                    data.nodeId
                  }" class="before:content-['people'] before:font-materiaIcons self-center cursor-pointer text-[24px] text-low-emphasis hover:text-medium-emphasis"></span>
                  <span id="employee-node-attrition" data-id="${
                    data.nodeId
                  }" class="before:content-['\\e24b'] before:font-materiaIcons self-center cursor-pointer text-[24px] text-low-emphasis hover:text-medium-emphasis"></span>
                </div>
              </div>
            </div>
            `;
  }

  getGeneralDimensionGrid(data: OrgChartNode): string {
    return `
      <div class="grid grid-cols-2 gap-2 text-center flex-1">
        <div class="flex flex-col gap-2 justify-center">
          <div class="flex text-body-2 text-low-emphasis gap-1 items-center justify-center">
            <span class="text-[16px] before:font-materiaIcons before:content-['person'] before:block text-link"></span>
            <span>${data.textRowEmployees}</span>
          </div>
          <div class="text-body-2">${data.directSubordinates}</div>
        </div>
        <div class="flex flex-col gap-2 justify-center">
          <div class="flex text-body-2 text-low-emphasis gap-1 items-center justify-center">
            <span class="text-[16px] before:font-materiaIcons before:content-['\\e26a'] before:block text-link"></span>
            <span>${data.textRowAttrition}</span>
          </div>
          <div class="text-body-2">${data.directAttrition}</div>
        </div>
      </div>
    `;
  }

  getOrgUnitTable(data: OrgChartNode): string {
    return `
      <div class="text-high-emphasis text-body-1 mt-2 mb-2 text-center">${data.name}</div>
      <table class="table-fixed">
        <thead>
          <tr class="font-semibold uppercase text-low-emphasis divide-x divide-border">
            <th class="w-1/3">&nbsp;</th>
            <th class="w-1/3 tracking-widest">${data.textColumnDirect}</th>
            <th class="w-1/3 tracking-widest">${data.textColumnOverall}</th>
          </tr>
        </thead>
      <tbody>
        <tr class="text-center h-9 divide-x divide-border">
          <td class="flex text-body-2 text-low-emphasis gap-1 mr-1 items-center h-full">
            <span class="text-[16px] before:font-materiaIcons before:content-['person'] before:block text-link"></span>
            <span>${data.textRowEmployees}</span>
          </td>
          <td class="text-body-2 h-9">${data.directSubordinates}</td>
          <td class="text-body-2">${data.totalSubordinates}</td>
        </tr>
        <tr class="text-center h-9 divide-x divide-border">
          <td class="flex text-body-2 text-low-emphasis gap-1 mr-1 items-center h-full">
            <span class="text-[16px] before:font-materiaIcons before:content-['\\e26a'] before:block text-link"></span>
            <span>${data.textRowAttrition}</span>
          </td>
          <td class="text-body-2">${data.directAttrition}</td> 
          <td class="text-body-2">${data.totalAttrition}</td>
        </tr>
      </tbody>
    </table>
    `;
  }
}
