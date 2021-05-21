import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Employee } from '../../shared/models/employee.model';
import { HeatType } from '../models/heat-type.enum';
import { OrgChartNode } from './models/org-chart-node.model';

@Injectable({
  providedIn: 'root',
})
export class OrgChartService {
  public mapEmployeesToNodes(data: Employee[]): OrgChartNode[] {
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
      const columnDirect = translate(
        'organizationalView.orgChart.table.columnDirect'
      );
      const columnOverall = translate(
        'organizationalView.orgChart.table.columnOverall'
      );
      const rowEmployees = translate(
        'organizationalView.orgChart.table.rowEmployees'
      );
      const rowAttrition = translate(
        'organizationalView.orgChart.table.rowAttrition'
      );

      const heatMapClass =
        elem.attritionMeta?.heatType === HeatType.GREEN_HEAT
          ? 'green-heat'
          : elem.attritionMeta?.heatType === HeatType.ORANGE_HEAT
          ? 'orange-heat'
          : elem.attritionMeta?.heatType === HeatType.RED_HEAT
          ? 'red-heat'
          : '';

      // TODO: determination of root elem needs be done otherwise after PoC
      const rootOfAllEmployees = 'Schaeffler_IT';
      let showUpperParentBtn = false;

      // if root and there is a possibility to load upper parent
      if (!parentNodeId && organization !== rootOfAllEmployees) {
        showUpperParentBtn = true;
      }

      return {
        nodeId,
        parentNodeId,
        expanded,
        directSubordinates,
        totalSubordinates,
        width: 295,
        height: 190,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 0.12,
        },
        backgroundColor: {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1,
        },
        connectorLineColor: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 0.87,
        },
        connectorLineWidth: 1,
        template: `
          <div class="node-wrapper">
            <span class="icon icon-arrow-north show-parent ${
              !showUpperParentBtn ? 'hide' : ''
            }" data-id="${nodeId}"></span>
            <div class="node-chip ${heatMapClass}"><span>${organization}</span></div>
            <div class="name">${name}</div>
            <table>
              <thead>
                <tr>
                  <th class="row-title">&nbsp;</th>
                  <th class="column-title">${columnDirect}</th>
                  <th class="column-title">${columnOverall}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="row-title">
                    <span class="icon icon-user green"></span>
                    <span>${rowEmployees}</span>
                  </td>
                  <td>${directSubordinates}</td>
                  <td>${totalSubordinates}</td>
                </tr>
                <tr>
                  <td class="row-title">
                    <span class="icon icon-bars green">
                    </span> <span>${rowAttrition}</span>
                  </td>
                  <td>${directAttrition}</td>
                  <td>${totalAttrition}</td>
                </tr>
              </tbody>
            </table><div class="bottom-bar"><i class="icon icon-users employee-node-people left" data-id="${nodeId}"></i><i class="icon icon-bars employee-node-attrition right" data-id="${nodeId}"></i></div>
          </div>
        `,
      };
    });
  }
}
