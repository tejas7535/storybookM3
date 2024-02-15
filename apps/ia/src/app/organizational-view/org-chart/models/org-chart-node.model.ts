import { OrgChartFluctuationRate } from '../../models';

export interface OrgChartNode {
  nodeId: string;
  parentNodeId: string;
  dimensionKey: string;
  expanded: boolean;
  name: string;
  organization: string;
  organizationLongName: string;
  heatMapClass: string;
  directSubordinates: number;
  totalSubordinates: number;
  displayedDirectFluctuationRate: number;
  displayedTotalFluctuationRate: number;
  fluctuationRate: OrgChartFluctuationRate;
  directFluctuationRate: OrgChartFluctuationRate;
  absoluteFluctuation: OrgChartFluctuationRate;
  directAbsoluteFluctuation: OrgChartFluctuationRate;
  displayedAbsoluteFluctuation: number;
  displayedDirectAbsoluteFluctuation: number;
  textDirectOverall: string;
  textEmployees: string;
  textFluctuation: string;
  textRelativeFluctuation: string;
  textAbsoluteFluctuation: string;
  showUpperParentBtn: boolean;
  _upToTheRootHighlighted?: boolean;
  _highlighted?: boolean;
}
