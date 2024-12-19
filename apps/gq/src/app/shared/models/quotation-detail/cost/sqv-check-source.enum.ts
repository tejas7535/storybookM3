/**
 * The source of the costs.
 * Description available here:
 * https://jira.schaeffler.com/browse/GQUOTE-5255
 */
export enum SqvCheckSource {
  // Costs from relocation plant
  RELOCATION = 'RELOCATION',
  // Costs from most recent RfQ
  RFQ_SQV = 'RFQ_SQV',
  OPEN_RFQ = 'OPEN_RFQ',
  // SQV costs from SAP
  SQV_SAP = 'SQV_SAP',
  // Result of ACVA (automatic recalculation)
  ACVA = 'ACVA',
}
