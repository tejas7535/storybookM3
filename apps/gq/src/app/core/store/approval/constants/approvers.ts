import { ApprovalLevel } from '@gq/shared/models/approval';
// ###############################################################################################################
// ###  For approver Logic see documentation                                                                   ###
// ###  https://confluence.schaeffler.com/pages/viewpage.action?spaceKey=PARS&title=Advanced+Approval+Process  ###
// ###############################################################################################################

// Table of Levels when Third Approver is required or NOT --> for First Approver
// 3rdAppRequired/Level
//                Level   | L0        | L1	        | L2	| L3	| L4	| L5
//                      --------------------------------------------------
// 3rdAppRequired       0	| undefined | L1	        | L2	| L3	| L4	| L4
//                      1	| undefined | undefined	  | L1	| L2	| L3	| L3

export const firstApproverLogic: ApprovalLevel[][] = [
  [
    undefined,
    ApprovalLevel.L1,
    ApprovalLevel.L2,
    ApprovalLevel.L3,
    ApprovalLevel.L4,
    ApprovalLevel.L4,
  ],
  [
    undefined,
    undefined,
    ApprovalLevel.L1,
    ApprovalLevel.L2,
    ApprovalLevel.L3,
    ApprovalLevel.L3,
  ],
];

/* Table of Levels when Third Approver is required or NOT --> for Second Approvers
3rdAppRequired/Level	

           Level      | L0        | L1	      | L2	| L3	| L4	| L5
                ----------------------------------------------------
 3rdAppRequired     0	| undefined | L2	      | L3	| L4	| L4	| L5
                    1	| undefined | undefined	| L2	| L3	| L4	| L4

*/
export const secondApproverLogic: ApprovalLevel[][] = [
  [
    undefined,
    ApprovalLevel.L2,
    ApprovalLevel.L3,
    ApprovalLevel.L4,
    ApprovalLevel.L4,
    ApprovalLevel.L5,
  ],
  [
    undefined,
    undefined,
    ApprovalLevel.L2,
    ApprovalLevel.L3,
    ApprovalLevel.L4,
    ApprovalLevel.L4,
  ],
];
/*
  Table of Levels when Third Approver is required or NOT --> for optional Third Approvers
3rdAppRequired / Level	| L0        | 	 L1	      |	L2	      |	L3	      |	L4	      |	L5
                    -----------------------------------------------------------------------------
3rdAppRequired        0 |	undefined | undefined   |	undefined	|	undefined	|	undefined	|	undefined
                      1	| undefined | undefined	  |	L3	      |	L4	      |	L4	      |	L5

*/
export const thirdApproverLogic: ApprovalLevel[] = [
  undefined as any,
  undefined as any,
  ApprovalLevel.L3,
  ApprovalLevel.L4,
  ApprovalLevel.L4,
  ApprovalLevel.L5,
];

/* string combination of requested approval Level of Quotation
3rdAppRequired / Level	| L0        | L1	        |	 L2	              |	L3	              |	 L4	              |	L5
                    ---------------------------------------------------------------------------------------------------------------------
3rdAppRequired        0 |	L0        | L1 + L2     |	 L2 + L3	        |	L3 + L4	          |	 L4 + L4	        |	L4 + L5
                      1	| undefined | undefined	  |	 L1 + L2 + L3	    |	L2 + L3 + L4	    |	 L3 + L4 + L4     |	L3 + L4 + L5
 
 */
export const approvalLevelOfQuotationLogic: string[][] = [
  [
    `${ApprovalLevel[ApprovalLevel.L0]}`,
    `${ApprovalLevel[ApprovalLevel.L1]} + ${ApprovalLevel[ApprovalLevel.L2]}`,
    `${ApprovalLevel[ApprovalLevel.L2]} + ${ApprovalLevel[ApprovalLevel.L3]}`,
    `${ApprovalLevel[ApprovalLevel.L3]} + ${ApprovalLevel[ApprovalLevel.L4]}`,
    `${ApprovalLevel[ApprovalLevel.L4]} + ${ApprovalLevel[ApprovalLevel.L4]}`,
    `${ApprovalLevel[ApprovalLevel.L4]} + ${ApprovalLevel[ApprovalLevel.L4]}`,
  ],
  [
    undefined as any,
    undefined as any,
    `${ApprovalLevel[ApprovalLevel.L1]} + ${
      ApprovalLevel[ApprovalLevel.L2]
    } + ${ApprovalLevel[ApprovalLevel.L3]}`,
    `${ApprovalLevel[ApprovalLevel.L2]} + ${
      ApprovalLevel[ApprovalLevel.L3]
    } + ${ApprovalLevel[ApprovalLevel.L4]}`,
    `${ApprovalLevel[ApprovalLevel.L3]} + ${
      ApprovalLevel[ApprovalLevel.L4]
    } + ${ApprovalLevel[ApprovalLevel.L4]}`,
    `${ApprovalLevel[ApprovalLevel.L3]} + ${
      ApprovalLevel[ApprovalLevel.L4]
    } + ${ApprovalLevel[ApprovalLevel.L5]}`,
  ],
];
