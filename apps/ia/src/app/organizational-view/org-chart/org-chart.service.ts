import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import * as d3Selection from 'd3-selection';

import { Employee, HeatType } from '../../shared/models';
import * as OrgChartConfig from './models/org-chart-config';
import { OrgChartNode } from './models/org-chart-node.model';

@Injectable({
  providedIn: 'root',
})
export class OrgChartService {
  mapEmployeesToNodes(data: Employee[]): OrgChartNode[] {
    return data.map((elem: Employee) => {
      const nodeId = elem.employeeId;
      const parentNodeId = elem.parentEmployeeId;
      const name = elem.employeeName;
      const organization = elem.orgUnit;
      const expanded = elem.level < 2;
      const directSubordinates = elem.directSubordinates;
      const totalSubordinates = elem.totalSubordinates;
      const directAttrition = elem.directAttrition;
      const totalAttrition = elem.totalAttrition;
      const textColumnDirect = translate<string>(
        'organizationalView.orgChart.table.columnDirect'
      );
      const textColumnOverall = translate<string>(
        'organizationalView.orgChart.table.columnOverall'
      );
      const textRowEmployees = translate<string>(
        'organizationalView.orgChart.table.rowEmployees'
      );
      const textRowAttrition = translate<string>(
        'organizationalView.orgChart.table.rowAttrition'
      );

      let heatMapClass = '';

      switch (elem.attritionMeta?.heatType) {
        case HeatType.GREEN_HEAT:
          heatMapClass = 'bg-success';
          break;
        case HeatType.ORANGE_HEAT:
          heatMapClass = 'bg-warning';
          break;
        case HeatType.RED_HEAT:
          heatMapClass = 'bg-error';
          break;
        default:
          heatMapClass = '';
      }

      // TODO: determination of root elem needs be done otherwise after PoC
      const rootOfAllEmployees = OrgChartConfig.COMPANY_ROOT;
      let showUpperParentBtn = false;

      // if root and there is a possibility to load upper parent
      if (!parentNodeId && organization !== rootOfAllEmployees) {
        showUpperParentBtn = true;
      }

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
        showUpperParentBtn,
      };
    });
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
              bg-white border border-lightBg hover:ring-1 hover:ring-mediumEmphasis 
                rounded-full flex flex-col items-center justify-center 
              text-labels hover:text-mediumEmphasis"> 
      <span>${node.data._directSubordinates}</span>   
      <span class="${
        node.children
          ? "before:content-['keyboard_arrow_down']"
          : "before:content-['keyboard_arrow_up']"
      } before:font-materiaIcons"></span>
    </div>
  `;
  }

  getNodeContent(data: OrgChartNode): string {
    const upwardsButton = `
      <div class="
          pointer-events-auto cursor-pointer bg-white text-labels rounded-full 
          flex flex-col items-center justify-center
          absolute left-1/2 transform -translate-x-1/2 w-6 h-6 text-[24px] -top-11
          hover:text-mediumEmphasis hover:ring-1 hover:ring-mediumEmphasis">
        <span id="show-parent" data-id="${data.nodeId}" class="before:content-['arrow_upward'] before:font-materiaIcons"></span>
      </div>
    `;

    return `
          <div class="relative border border-lightBg rounded-sm h-full flex flex-col px-2">
            ${data.showUpperParentBtn ? upwardsButton : ''}
            <div class="flex bg-lightBg justify-center rounded-2xl py-2 -my-4 ${
              data.heatMapClass
            }">
              <span class="text-body-2 ${
                data.heatMapClass !== undefined ? 'text-white' : 'text-dark'
              }">${data.organization}</span>
            </div>
            <div class="text-dark text-body-1 mt-6 mb-2 text-center">${
              data.name
            }</div>
            
            <table class="table-fixed">
              <thead>
                <tr class="font-semibold uppercase text-labels divide-x divide-lightBg">
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
                <tr class="text-center h-9 divide-x divide-lightBg">
                  <td class="flex text-body-2 text-labels gap-1 items-center h-full">
                    <span class="text-[16px] before:font-materiaIcons before:content-['person'] before:block text-success"></span>
                    <span>${data.textRowEmployees}</span>
                  </td>
                  <td class="text-body-2 h-9">${data.directSubordinates}</td>
                  <td class="text-body-2">${data.totalSubordinates}</td>
                </tr>
                <tr class="text-center h-9 divide-x divide-lightBg">
                  <td class="flex text-body-2 text-labels gap-1 items-center h-full">
                    <span class="text-[16px] before:font-materiaIcons before:content-['insert_chart_outlined'] before:block text-success"></span>
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
                }" class="before:content-['people'] before:font-materiaIcons cursor-pointer text-[24px] text-labels hover:text-light"></span>
                <span id="employee-node-attrition" data-id="${
                  data.nodeId
                }" class="before:content-['insert_chart'] before:font-materiaIcons cursor-pointer text-[24px] text-labels hover:text-light"></span>
            </div>
          </div>  
        `;
  }
}
