import { Injectable } from '@angular/core';

import { BUTTON_CSS, OrgChartNode } from './models';

@Injectable({
  providedIn: 'root',
})
export class OrgChartTemplateService {
  getGeneralNodeContent(
    data: OrgChartNode,
    width: number,
    height: number,
    highlightColor: string
  ): string {
    const peopleNodeId = this.getParentNodeId(data);
    const fluctuationNodeId = this.getFluctuationNodeId(data);
    const peopleIconSvg = this.getPeopleIconSvg(peopleNodeId);
    const fluctuationIconSvg = this.getFluctuationIconSvg(fluctuationNodeId);
    const rectBorder = this.getRectBorderStyles(data, highlightColor);
    const headerBorder = this.getHeaderBorderStyles(data, highlightColor);
    const headerClass = this.getHeaderClass(data);

    const parentArrow = data.showUpperParentBtn
      ? this.getParrentArrow(data, 150)
      : '';

    return `
          ${parentArrow}
          <div style="font-family: Noto sans; height: ${height}px; width: ${width}px; ${rectBorder}; border-radius: 6px; cursor: default;">
            <div class="${headerClass} !cursor-pointer" style="${headerBorder}; border-radius: 100px; background: #F0F0F0;
                text-align: center; padding-top: 4px; padding-bottom: 4px; position: absolute; bottom: 77%; width: 95%;
                margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;">
              <div class="${headerClass}">
                <span class="${headerClass}" style="font-size: 14px; line-height: 20px; letter-spacing: 0.25px;">${data.organization}</span>
              </div> 
              <div class="${headerClass}">
                <span class="${headerClass}" style="font-size: 14px; line-height: 20px; letter-spacing: 0.25px; color: rgba(0, 0, 0, 0.6)">
                  ${data.dimensionKey}
                </span>
              </div>
            </div>
            <div style="display: flex; justify-content: space-evenly; padding: 8px; margin-top: 22px;">
              <div ${peopleNodeId} style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px; padding-bottom: 4px;
                  padding-left: 8px; margin-right: 8px; width: 100%; cursor: pointer;" class="hover:bg-gray-300 rounded group">
                <span ${peopleNodeId} style="display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: 0.25px;">
                  ${peopleIconSvg}
                  <span ${peopleNodeId} style="margin-left: 4px; color: rgba(0, 0, 0, 0.60); line-height: 20px;">${data.textEmployees}</span>
                </span>
                <span ${peopleNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">
                  ${data.directSubordinates}
                </span>
              </div>
              <div style="width: 1px; background-color: #F0F0F0;"></div>
              <div ${fluctuationNodeId} style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px; padding-bottom: 4px;
                  padding-right: 8px; margin-left: 8px; width: 100%; cursor: pointer;" class="hover:bg-gray-300 rounded group">
                <span ${fluctuationNodeId} style="display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: 0.25px;">
                  ${fluctuationIconSvg}
                  <span ${fluctuationNodeId} style="margin-left: 4px; color: rgba(0, 0, 0, 0.60); line-height: 20px;">${data.textFluctuation}</span>
                </span>
                <span ${fluctuationNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">
                  ${data.displayedTotalFluctuationRate}%
                </span>
              </div>
            </div>
          </div>
        `;
  }

  getOrgUnitNodeContent(
    data: OrgChartNode,
    width: number,
    height: number,
    highlightColor: string
  ): string {
    const peopleNodeId = this.getParentNodeId(data);
    const fluctuationNodeId = this.getFluctuationNodeId(data);
    const peopleIconSvg = this.getPeopleIconSvg(peopleNodeId);
    const fluctuationIconSvg = this.getFluctuationIconSvg(fluctuationNodeId);
    const rectBorder = this.getRectBorderStyles(data, highlightColor);
    const headerBorder = this.getHeaderBorderStyles(data, highlightColor);
    const headerClass = this.getHeaderClass(data);

    const parentArrow = data.showUpperParentBtn
      ? this.getParrentArrow(data, 180)
      : '';

    const tooltip = `
      <div id="org-chart-tooltip" class="absolute left-[290px] group-hover:!block w-max 
          mt-6 px-4 py-2 rounded tracking-wide bg-secondary-900" style="display: none;">
        <div>
          <span class="text-medium-emphasis-dark-bg">${data.textRelativeFluctuation}:</span>
          <span class="text-high-emphasis-dark-bg">
            ${data.displayedDirectFluctuationRate}% / ${data.displayedTotalFluctuationRate}%
          </span>
        </div>
        <div>
          <span class="text-medium-emphasis-dark-bg">${data.textAbsoluteFluctuation}:</span>
          <span class="text-high-emphasis-dark-bg">
            ${data.displayedDirectAbsoluteFluctuation} / ${data.displayedAbsoluteFluctuation}
          </span>
        </div>
      </div>
      `;

    return `
      ${parentArrow}
      <div style="font-family: Noto sans; height: ${height}px; width: ${width}px; ${rectBorder}; border-radius: 6px; cursor: default;">
        <div class="${headerClass} !cursor-pointer" style="border-radius: 100px; background: #F0F0F0; padding-top: 4px; padding-bottom: 4px;
            ${headerBorder}; position: absolute; bottom: 83%; width: 95%; margin-left: auto; margin-right: auto; left: 0; right: 0;
            text-align: center;">
          <div class="${headerClass}">
            <span class="${headerClass}" style="font-size: 14px; line-height: 20px; letter-spacing: 0.25px;">${data.organization}</span>
          </div>
          <div class="${headerClass}">
            <span class="${headerClass}" style="font-size: 14px; line-height: 20px; letter-spacing: 0.25px; color: rgba(0, 0, 0, 0.6)">
              ${data.organizationLongName}
            </span>
          </div>
        </div>
        <div style="padding-top: 30px; padding-bottom: 8px; text-align: center;">
          <span style="font-size: 14px; line-height: 20px; letter-spacing: 0.25px;">${data.name}<span/>
        </div>
        <div style="display: flex; justify-content: space-evenly; padding: 8px;">
          <div ${peopleNodeId} style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px; padding-bottom: 4px;
              padding-left: 8px; margin-right: 8px; width: 100%; cursor: pointer;" class="hover:bg-gray-300 rounded group">
            <span ${peopleNodeId} style="display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: 0.25px;">
              ${peopleIconSvg}
              <span ${peopleNodeId} style="margin-left: 4px; color: rgba(0, 0, 0, 0.60); line-height: 20px;">${data.textEmployees}</span>
            </span>
            <span ${peopleNodeId} style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">
              ${data.directSubordinates}&nbsp;/&nbsp;${data.totalSubordinates}
            </span>
          </div>
          <div style="width: 1px; background-color: #F0F0F0;"></div>
          <div ${fluctuationNodeId} style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px; padding-bottom: 4px;
                padding-right: 8px; margin-left: 8px; width: 100%; cursor: pointer;" 
              class="${BUTTON_CSS.attrition} hover:bg-gray-300 rounded group">
            <span ${fluctuationNodeId} style="display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: 0.25px;">
              ${fluctuationIconSvg}
              <span ${fluctuationNodeId} class="${BUTTON_CSS.attrition}" style="margin-left: 4px; color: rgba(0, 0, 0, 0.60); line-height: 20px;">${data.textFluctuation}</span>
            </span>
            <span ${fluctuationNodeId} class="${BUTTON_CSS.attrition}" style="display: flex; justify-content: center; font-size: 20px; line-height: 24px; letter-spacing: 0.25px;">
              ${data.displayedDirectFluctuationRate}%&nbsp;/&nbsp;${data.displayedTotalFluctuationRate}%
            </span>
            ${tooltip}
          </div>
        </div>
      </div>
    `;
  }

  getButtonContent(node: any): string {
    const expand = node.children
      ? `id="${BUTTON_CSS.collapse}" data-id="${node.data.nodeId}"`
      : `id="${BUTTON_CSS.expand}" data-id="${node.data.nodeId}"`;

    return `
        <div ${expand} class="pointer-events-auto cursor-pointer w-full group
                  bg-surface border border-border hover:ring-1 hover:ring-primary
                    rounded-full flex flex-col items-center justify-center
                  text-low-emphasis !visible" style="visibility: hidden">
          <span ${expand} class="group-hover:text-high-emphasis">${
      node.data._directSubordinates
    }</span>
          <span ${expand} class="${
      node.children ? "before:content-['\\e313']" : "before:content-['\\e316']"
    } before:font-materiaIcons group-hover:text-link"></span>
        </div>
      `;
  }

  getParrentArrow(data: OrgChartNode, bottomPx: number): string {
    const showParentId = `id="${BUTTON_CSS.showUpArrow}" data-id="${data.nodeId}"`;

    return `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
        style="position: absolute; margin-left: auto; margin-right: auto; right: 0; left: 0; text-align: center; cursor: default; cursor: pointer;"
        class="bottom-[${bottomPx}px] group" ${showParentId}>
      <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" fill="rgba(0, 0, 0, 0.32)" 
        class="group-hover:fill-primary" ${showParentId}/>
    </svg>`;
  }

  getHeaderClass(data: OrgChartNode) {
    return `org-chart-header-${data.nodeId}`;
  }

  getFluctuationNodeId(data: OrgChartNode) {
    return `id="${BUTTON_CSS.attrition}" data-id="${data.nodeId}"`;
  }

  getParentNodeId(data: OrgChartNode) {
    return `id="${BUTTON_CSS.people}" data-id="${data.nodeId}"`;
  }

  getPeopleIconSvg(nodeId: string): string {
    return `
    <svg ${nodeId} xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
      <path ${nodeId} class="group-hover:fill-primary" fill-rule="evenodd" clip-rule="evenodd" d="M7.82663 5.33331C7.82663 6.43998 6.93996 7.33331 5.83329 7.33331C4.72663 7.33331 3.83329 6.43998 3.83329 5.33331C3.83329 4.22665 4.72663 3.33331 5.83329 3.33331C6.93996 3.33331 7.82663 4.22665 7.82663 5.33331ZM13.16 5.33331C13.16 6.43998 12.2733 7.33331 11.1666 7.33331C10.06 7.33331 9.16663 6.43998 9.16663 5.33331C9.16663 4.22665 10.06 3.33331 11.1666 3.33331C12.2733 3.33331 13.16 4.22665 13.16 5.33331ZM5.83329 8.66665C4.27996 8.66665 1.16663 9.44665 1.16663 11V12.6666H10.5V11C10.5 9.44665 7.38663 8.66665 5.83329 8.66665ZM10.52 8.69998C10.7533 8.67998 10.9733 8.66665 11.1666 8.66665C12.72 8.66665 15.8333 9.44665 15.8333 11V12.6666H11.8333V11C11.8333 10.0133 11.2933 9.25998 10.52 8.69998Z" fill="rgba(0, 0, 0, 0.60)"/>
    </svg>
    `;
  }

  getFluctuationIconSvg(nodeId: string): string {
    return `
    <svg ${nodeId} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path ${nodeId} class="group-hover:fill-primary" fill-rule="evenodd" clip-rule="evenodd" d="M3.33333 2H12.6667C13.4 2 14 2.6 14 3.33333V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.6 14 2 13.4 2 12.6667V3.33333C2 2.6 2.6 2 3.33333 2ZM4.66667 11.3333H6V6.66667H4.66667V11.3333ZM8.66667 11.3333H7.33333V4.66667H8.66667V11.3333ZM10 11.3333H11.3333V8.66667H10V11.3333Z" fill="rgba(0, 0, 0, 0.60)"/>
    </svg>
    `;
  }

  getRectBorderStyles = (data: OrgChartNode, highlightColor: string) =>
    data._upToTheRootHighlighted || data._highlighted
      ? `border: 2px solid ${highlightColor}`
      : 'border: 1px solid rgba(0, 0, 0, 0.32)';

  getHeaderBorderStyles = (data: OrgChartNode, highlightColor: string) =>
    data._upToTheRootHighlighted || data._highlighted
      ? `border: 1px solid ${highlightColor}`
      : 'border: none';
}
