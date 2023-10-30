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
    const textDirectOverall = translations.directOverall;
    const textEmployees = translations.employees;
    const textFluctuation = translations.fluctuation;

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
          textDirectOverall,
          textEmployees,
          textFluctuation,
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
    return dimension === FilterDimension.ORG_UNIT
      ? this.getOrgUnitNodeContent(data, width, height)
      : this.getGeneralNodeContent(data, width, height);
  }

  getOrgUnitNodeContent(
    data: OrgChartNode,
    width: number,
    height: number
  ): string {
    const peopleNodeId = `id="employee-node-people" data-id="${data.nodeId}"`;
    const fluctuationNodeId = `id="employee-node-attrition" data-id="${data.nodeId}"`;
    const showParentId = `id="show-parent" data-id="${data.nodeId}"`;
    const peopleIconSvg = this.getPeopleIconSvg(peopleNodeId);
    const fluctuationIconSvg = this.getFluctuationIconSvg(fluctuationNodeId);

    const parentArrow = data.showUpperParentBtn
      ? `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
          style="position: absolute; margin-left: auto; margin-right: auto; right: 0; left: 0; text-align: center;"
          class="-top-[48px] group" ${showParentId}>
        <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" fill="rgba(0, 0, 0, 0.32)" 
          class="group-hover:fill-primary" ${showParentId}/>
      </svg>`
      : '';

    return `
      ${parentArrow}
      <div style="height: ${height}px; width: ${width}px; border: 1px solid rgba(0, 0, 0, 0.32); border-radius: 6px;">
        <div style="border-radius: 100px; background: #F0F0F0; padding-top: 4px; padding-bottom: 4px;
         position: absolute; top: -20px; width: 95%; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;">
          <div>
            <span style="line-height: 20px; letter-spacing: 0.25px;">${data.organization}</span>
          </div>
          <div>
            <span style="color: rgba(0, 0, 0, 0.6)">${data.organizationLongName}</span>
          </div>
        </div>
        <div style="padding-top: 32px; text-align: center;">
          <span style="line-height: 20px; letter-spacing: 0.25px;">${data.name}<span/>
        </div>
        <div style="display: flex; justify-content: space-evenly; padding-top: 8px;">
          <div ${peopleNodeId} style="display: flex; flex-direction: column; gap: 4px; padding-top: 4px; padding-bottom: 4px;
              padding-left: 8px; padding-right: 8px;" class="hover:bg-gray-300 rounded group">
            <span ${peopleNodeId} style="display: flex; align-items: center;">
              ${peopleIconSvg}
              <span ${peopleNodeId} style="margin-left: 4px;">${data.textEmployees}</span>
            </span>
            <span ${peopleNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">
              ${data.directSubordinates}&nbsp;/&nbsp;${data.totalSubordinates}
            </span>
            <span ${peopleNodeId} style="color: rgba(0, 0, 0, 0.6)">${data.textDirectOverall}</span>
          </div>
          <div style="width: 1px; background-color: #F0F0F0;"></div>
          <div ${fluctuationNodeId} style="display: flex; flex-direction: column; gap: 4px; padding-top: 4px; padding-bottom: 4px;
              padding-left: 8px; padding-right: 8px;" class="hover:bg-gray-300 rounded group">
            <span ${fluctuationNodeId} style="display: flex; align-items: center;">
              ${fluctuationIconSvg}
              <span ${fluctuationNodeId} style="margin-left: 4px;">${data.textFluctuation}</span>
            </span>
            <span ${fluctuationNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">
              ${data.directAttrition}&nbsp;/&nbsp;${data.totalAttrition}
            </span>
            <span ${fluctuationNodeId} style="color: rgba(0, 0, 0, 0.6)">${data.textDirectOverall}<span>
          </div>
        </div>
      </div>
    `;
  }

  getGeneralNodeContent(
    data: OrgChartNode,
    width: number,
    height: number
  ): string {
    const peopleNodeId = `id="employee-node-people" data-id="${data.nodeId}"`;
    const fluctuationNodeId = `id="employee-node-attrition" data-id="${data.nodeId}"`;
    const showParentId = `id="show-parent" data-id="${data.nodeId}"`;
    const peopleIconSvg = this.getPeopleIconSvg(peopleNodeId);
    const fluctuationIconSvg = this.getFluctuationIconSvg(fluctuationNodeId);

    const parentArrow = data.showUpperParentBtn
      ? `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
          style="position: absolute; margin-left: auto; margin-right: auto; right: 0; left: 0; text-align: center;"
          class="-top-[40px] group" ${showParentId}>
        <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" fill="rgba(0, 0, 0, 0.32)" 
          class="group-hover:fill-primary" ${showParentId}/>
      </svg>`
      : '';

    return `
      ${parentArrow}
      <div style="height: ${height}px; width: ${width}px; border: 1px solid rgba(0, 0, 0, 0.32); border-radius: 6px;">
        <div style="border-radius: 100px; background: #F0F0F0; text-align: center; margin-left: 4px; margin-right: 4px; padding-top: 4px; padding-bottom: 4px;
         position: absolute; top: -14px; width: 95%; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;">
          <span style="line-height: 20px; letter-spacing: 0.25px">${data.organization}</span>
        </div>
        <div style="height: 100%; display: flex; justify-content: space-evenly; align-items: center; padding-top: 10px;">
          <div ${peopleNodeId} style="display: flex; flex-direction: column; gap: 4px; padding-top: 4px; padding-bottom: 4px;
              padding-left: 8px; padding-right: 8px;" class="hover:bg-gray-300 rounded group">
            <span ${peopleNodeId} style="display: flex; align-items: center;">
              ${peopleIconSvg}
              <span ${peopleNodeId} style="margin-left: 4px;">${data.textEmployees}</span>
            </span>
            <span ${peopleNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">${data.totalSubordinates}</span>
          </div>
          <div style="height: 50%; width: 1px; background-color: #F0F0F0;"></div>
          <div ${fluctuationNodeId} style="display: flex; flex-direction: column; gap: 4px; padding-top: 4px; padding-bottom: 4px;
              padding-left: 8px; padding-right: 8px;" class="hover:bg-gray-300 rounded group">
            <span ${fluctuationNodeId} style="display: flex; align-items: center;">
              ${fluctuationIconSvg}
              <span ${fluctuationNodeId} style="margin-left: 4px;">${data.textFluctuation}</span>
            </span>
            <span ${fluctuationNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">${data.totalAttrition}</span>
          </div>
        </div>
      </div>
    `;
  }

  getPeopleIconSvg(nodeId: string): string {
    return `
    <svg ${nodeId} xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
      <path ${nodeId} class="group-hover:fill-primary" fill-rule="evenodd" clip-rule="evenodd" d="M7.82663 5.33331C7.82663 6.43998 6.93996 7.33331 5.83329 7.33331C4.72663 7.33331 3.83329 6.43998 3.83329 5.33331C3.83329 4.22665 4.72663 3.33331 5.83329 3.33331C6.93996 3.33331 7.82663 4.22665 7.82663 5.33331ZM13.16 5.33331C13.16 6.43998 12.2733 7.33331 11.1666 7.33331C10.06 7.33331 9.16663 6.43998 9.16663 5.33331C9.16663 4.22665 10.06 3.33331 11.1666 3.33331C12.2733 3.33331 13.16 4.22665 13.16 5.33331ZM5.83329 8.66665C4.27996 8.66665 1.16663 9.44665 1.16663 11V12.6666H10.5V11C10.5 9.44665 7.38663 8.66665 5.83329 8.66665ZM10.52 8.69998C10.7533 8.67998 10.9733 8.66665 11.1666 8.66665C12.72 8.66665 15.8333 9.44665 15.8333 11V12.6666H11.8333V11C11.8333 10.0133 11.2933 9.25998 10.52 8.69998Z" fill="black"/>
    </svg>
    `;
  }

  getFluctuationIconSvg(nodeId: string): string {
    return `
    <svg ${nodeId} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path ${nodeId} class="group-hover:fill-primary" fill-rule="evenodd" clip-rule="evenodd" d="M3.33333 2H12.6667C13.4 2 14 2.6 14 3.33333V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.6 14 2 13.4 2 12.6667V3.33333C2 2.6 2.6 2 3.33333 2ZM4.66667 11.3333H6V6.66667H4.66667V11.3333ZM8.66667 11.3333H7.33333V4.66667H8.66667V11.3333ZM10 11.3333H11.3333V8.66667H10V11.3333Z" fill="black" fill-opacity="0.6"/>
    </svg>
    `;
  }
}
