import { Color } from './color.model';

export interface OrgChartNode {
  nodeId: string;
  parentNodeId: string;
  expanded: boolean;
  directSubordinates: number;
  totalSubordinates: number;
  width: number;
  height: number;
  borderWidth: number;
  borderRadius: number;
  borderColor: Color;
  backgroundColor: Color;
  connectorLineColor: Color;
  connectorLineWidth: number;
  template: string;
}
