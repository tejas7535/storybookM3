import { ApprovalLevel } from '@gq/shared/models';
// ###############################################################################################################
// ###  For approver Logic see documentation                                                                   ###
// ###  https://confluence.schaeffler.com/x/moxFBg                                                             ###
// ###############################################################################################################

/**
 * ApprovalLevel[][] contains the logic for the approvers.
 * The required approvers can be found by using the approval level as the index of array. e.g. ApprovalLevel.L0 is at index 0, ApprovalLevel.L1 is at index 1,...

 *
 * Example:
 * 
 * When required ApprovalLevel is 0 (L0) get array at Position 0: ApprovalLevel[0] --> result: list of approvers for this level
 * const logicDefault =
 * [
 *  [ApprovalLevel.L0, undefined], <-- ApprovalLevel.L0
 *  [ApprovalLevel.L1, ApprovalLevel.L2], <-- ApprovalLevel.L1
 * ]
 *
 * For ApprovalLevel.L0, the first entry (index 0) of the array is taken: [ApprovalLevel.L0, undefined]
 * ApprovalLevel.L0 requires ApprovalLevel.L0
 *
 * For ApprovalLevel.L1, the second entry (index 1) of the array is taken: [ApprovalLevel.L1, ApprovalLevel.L2]
 * ApprovalLevel.L1 requires ApprovalLevel.L1 and ApprovalLevel.L2
 */

// Default logic, if no third approver is required
const logicDefault = [
  [ApprovalLevel.L0, undefined], // ApprovalLevel.L0
  [ApprovalLevel.L1, ApprovalLevel.L2], // ApprovalLevel.L1
  [ApprovalLevel.L2, ApprovalLevel.L3], // ApprovalLevel.L2
  [ApprovalLevel.L3, ApprovalLevel.L4], // ApprovalLevel.L3
  [ApprovalLevel.L4, ApprovalLevel.L4], // ApprovalLevel.L4
  [ApprovalLevel.L4, ApprovalLevel.L5], // ApprovalLevel.L5
];

// Logic for third approver
const logicThirdApprover = [
  [undefined, undefined, undefined], // ApprovalLevel.L0
  [undefined, undefined, undefined], // ApprovalLevel.L1
  [ApprovalLevel.L1, ApprovalLevel.L2, ApprovalLevel.L3], // ApprovalLevel.L2
  [ApprovalLevel.L2, ApprovalLevel.L3, ApprovalLevel.L4], // ApprovalLevel.L3
  [ApprovalLevel.L3, ApprovalLevel.L4, ApprovalLevel.L4], // ApprovalLevel.L4
  [ApprovalLevel.L3, ApprovalLevel.L4, ApprovalLevel.L5], // ApprovalLevel.L5
];

// Logic for third approver in Greater China
const logicThirdApproverGreaterChina = [
  [undefined, undefined, undefined], // ApprovalLevel.L0
  [ApprovalLevel.L1, ApprovalLevel.L2, ApprovalLevel.L2], // ApprovalLevel.L1
  [ApprovalLevel.L1, ApprovalLevel.L2, ApprovalLevel.L3], // ApprovalLevel.L2
  [ApprovalLevel.L1, ApprovalLevel.L3, ApprovalLevel.L4], // ApprovalLevel.L3
  [ApprovalLevel.L1, ApprovalLevel.L4, ApprovalLevel.L4], // ApprovalLevel.L4
  [ApprovalLevel.L1, ApprovalLevel.L4, ApprovalLevel.L5], // ApprovalLevel.L5
];

/**
 * Gets the approval logic based on the given parameters.
 *
 * @param isGreaterChina indicates if the request is for Greater China
 * @param isThirdApprover indicates if the request requires a third approver
 *
 * @returns the approval logic. The position of the array indicates the level of the approver. The array contains the levels of approvers required.
 */
export function getApprovalLogic(
  isGreaterChina: boolean,
  isThirdApprover: boolean
): ApprovalLevel[][] {
  if (!isThirdApprover) {
    return logicDefault;
  }

  return isGreaterChina ? logicThirdApproverGreaterChina : logicThirdApprover;
}
