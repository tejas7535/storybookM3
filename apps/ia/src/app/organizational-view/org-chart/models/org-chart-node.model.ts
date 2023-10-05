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
  textColumnDirect: string;
  textColumnOverall: string;
  textRowEmployees: string;
  textRowAttrition: string;
  showUpperParentBtn: boolean;
}
