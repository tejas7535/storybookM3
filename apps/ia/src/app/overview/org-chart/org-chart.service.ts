import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Employee } from '../../shared/models';
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
      const columnDirect = translate('orgChart.table.columnDirect');
      const columnOverall = translate('orgChart.table.columnOverall');
      const rowEmployees = translate('orgChart.table.rowEmployees');
      const rowAttrition = translate('orgChart.table.rowAttrition');

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
            <div class="node-chip"><span>${organization}</span></div>
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
            </table><div class="bottom-bar"><i class="icon icon-users employee-node-people left" data-id="${nodeId}"></i><i class="icon icon-bars employee-node-people right" data-id="${nodeId}"></i></div>
          </div>
        `,
      };
    });
  }
}
