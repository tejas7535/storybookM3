export interface OrgChartNode {
  nodeId: string;
  parentNodeId: string;
  expanded: boolean;
  name: string;
  organization: string;
  organizationLongName: string;
  heatMapClass: string;
  directSubordinates: number;
  totalSubordinates: number;
  directAttrition: number;
  totalAttrition: number;
  textDirectOverall: string;
  textEmployees: string;
  textFluctuation: string;
  showUpperParentBtn: boolean;
}
