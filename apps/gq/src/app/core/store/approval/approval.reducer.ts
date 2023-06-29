/* eslint-disable max-lines */

import {
  ActiveDirectoryUser,
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalStatus,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';
import {
  approvalLevelOfQuotationLogic,
  firstApproverLogic,
  secondApproverLogic,
  thirdApproverLogic,
} from './constants/approvers';
export interface ApprovalState {
  approvers: Approver[];
  activeDirectoryUsers: ActiveDirectoryUser[];
  approversLoading: boolean;
  activeDirectoryUsersLoading: boolean;
  approvalStatusLoading: boolean;
  triggerApprovalWorkflowInProgress: boolean;
  updateApprovalWorkflowInProgress: boolean;
  saveApprovalWorkflowInformationInProgress: boolean;
  approvalStatus: ApprovalStatus;
  approvalCockpitLoading: boolean;
  approvalCockpit: ApprovalCockpitData;
  error: Error;
}

const APPROVAL_KEY = 'approval';

export const initialState: ApprovalState = {
  approvers: [],
  activeDirectoryUsers: [],
  approversLoading: false,
  activeDirectoryUsersLoading: false,
  approvalStatusLoading: false,
  approvalCockpitLoading: false,
  approvalStatus: {
    sapId: undefined,
    currency: undefined,
    approvalLevel: undefined,
    thirdApproverRequired: false,
    autoApproval: false,
    totalNetValue: undefined,
    gpm: undefined,
    priceDeviation: undefined,
  },
  triggerApprovalWorkflowInProgress: false,
  updateApprovalWorkflowInProgress: false,
  saveApprovalWorkflowInformationInProgress: false,
  approvalCockpit: {
    approvalEvents: [],
    approvalGeneral: {
      infoUser: undefined,
      autoApproval: undefined,
      comment: undefined,
      currency: undefined,
      firstApprover: undefined,
      gpm: undefined,
      gqId: undefined,
      priceDeviation: undefined,
      projectInformation: undefined,
      sapId: undefined,
      secondApprover: undefined,
      thirdApprover: undefined,
      thirdApproverRequired: undefined,
      totalNetValue: undefined,
    },
  },
  error: undefined,
};

export const approvalFeature = createFeature({
  name: APPROVAL_KEY,
  reducer: createReducer(
    initialState,
    on(
      ApprovalActions.clearApprovalStatus,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
        approvalStatus: { ...initialState.approvalStatus },
      })
    ),
    on(
      ApprovalActions.clearApprovalCockpitData,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalCockpit: { ...initialState.approvalCockpit },
      })
    ),
    on(
      ApprovalActions.getAllApprovers,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approversLoading: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.allApproversAlreadyLoaded,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approversLoading: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getAllApproversSuccess,
      (state: ApprovalState, { approvers }): ApprovalState => ({
        ...state,
        approvers,
        approversLoading: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getAllApproversFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        approvers: [],
        approversLoading: false,
        error,
      })
    ),
    on(
      ApprovalActions.getApprovalStatus,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: true,
      })
    ),
    on(
      ApprovalActions.approvalStatusAlreadyLoaded,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
      })
    ),
    on(
      ApprovalActions.getApprovalStatusSuccess,
      (state: ApprovalState, { approvalStatus }): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
        approvalStatus,
      })
    ),
    on(
      ApprovalActions.getApprovalStatusFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
        approvalStatus: {
          ...initialState.approvalStatus,
        },
        error,
      })
    ),
    on(
      ApprovalActions.getActiveDirectoryUsers,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        activeDirectoryUsersLoading: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getActiveDirectoryUsersSuccess,
      (state: ApprovalState, { activeDirectoryUsers }): ApprovalState => ({
        ...state,
        activeDirectoryUsers,
        activeDirectoryUsersLoading: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getActiveDirectoryUsersFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        activeDirectoryUsersLoading: false,
        activeDirectoryUsers: [],
        error,
      })
    ),
    on(
      ApprovalActions.clearActiveDirectoryUsers,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        activeDirectoryUsers: [],
      })
    ),
    on(
      ApprovalActions.triggerApprovalWorkflow,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        triggerApprovalWorkflowInProgress: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.triggerApprovalWorkflowSuccess,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        triggerApprovalWorkflowInProgress: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.triggerApprovalWorkflowFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        triggerApprovalWorkflowInProgress: false,
        error,
      })
    ),
    on(
      ApprovalActions.saveApprovalWorkflowInformation,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        saveApprovalWorkflowInformationInProgress: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.saveApprovalWorkflowInformationSuccess,
      (state: ApprovalState, { approvalGeneral }): ApprovalState => ({
        ...state,
        saveApprovalWorkflowInformationInProgress: false,
        error: undefined,
        approvalCockpit: {
          ...state.approvalCockpit,
          // Update only the ApprovalWorkflowBaseInformation fields.
          // All other fields of approvalGeneral will be null in the backend response and should not be overwritten.
          approvalGeneral: {
            ...state.approvalCockpit.approvalGeneral,
            gqId: approvalGeneral.gqId,
            firstApprover: approvalGeneral.firstApprover,
            secondApprover: approvalGeneral.secondApprover,
            thirdApprover: approvalGeneral.thirdApprover,
            infoUser: approvalGeneral.infoUser,
            comment: approvalGeneral.comment,
            projectInformation: approvalGeneral.projectInformation,
          },
        },
      })
    ),
    on(
      ApprovalActions.saveApprovalWorkflowInformationFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        saveApprovalWorkflowInformationInProgress: false,
        error,
      })
    ),
    on(
      ApprovalActions.updateApprovalWorkflow,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.updateApprovalWorkflowSuccess,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.updateApprovalWorkflowFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: false,
        error,
      })
    ),
    on(
      ApprovalActions.getApprovalCockpitData,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalCockpitLoading: true,
      })
    ),
    on(
      ApprovalActions.approvalCockpitDataAlreadyLoaded,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalCockpitLoading: false,
      })
    ),
    on(
      ApprovalActions.getApprovalCockpitDataSuccess,
      (state: ApprovalState, { approvalCockpit }): ApprovalState => ({
        ...state,
        approvalCockpitLoading: false,
        approvalCockpit,
      })
    ),
    on(
      ApprovalActions.getApprovalCockpitDataFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        approvalCockpitLoading: false,
        approvalCockpit: { ...initialState.approvalCockpit },
        error,
      })
    )
  ),
  extraSelectors: ({
    selectApprovalCockpit,
    selectApprovers,
    selectApprovalStatus,
  }) => ({
    getApproversOfLevel: (approvalLevel: ApprovalLevel) =>
      createSelector(selectApprovers, (allApprovers: Approver[]): Approver[] =>
        getApproversByApprovalLevel(allApprovers, approvalLevel)
      ),
    // ###############################################################################################################
    // ###  For approver Logic see documentation                                                                   ###
    // ###  https://confluence.schaeffler.com/pages/viewpage.action?spaceKey=PARS&title=Advanced+Approval+Process  ###
    // ###############################################################################################################
    getFirstApprovers: createSelector(
      selectApprovers,
      selectApprovalStatus,
      (approvers: Approver[], approvalStatus: ApprovalStatus) =>
        getApproversForFirstApprover(approvers, approvalStatus)
    ),
    getSecondApprovers: createSelector(
      selectApprovers,
      selectApprovalStatus,
      (approvers: Approver[], approvalStatus: ApprovalStatus) =>
        getApproversForSecondApprover(approvers, approvalStatus)
    ),
    getThirdApprovers: createSelector(
      selectApprovers,
      selectApprovalStatus,
      (approvers: Approver[], approvalStatus: ApprovalStatus) =>
        getApproversForThirdApprover(approvers, approvalStatus)
    ),
    getApprovalLevelFirstApprover: createSelector(
      selectApprovalStatus,
      ({
        thirdApproverRequired,
        approvalLevel,
      }: ApprovalStatus): ApprovalLevel =>
        firstApproverLogic[+thirdApproverRequired][approvalLevel]
    ),
    getApprovalLevelSecondApprover: createSelector(
      selectApprovalStatus,
      ({
        thirdApproverRequired,
        approvalLevel,
      }: ApprovalStatus): ApprovalLevel =>
        secondApproverLogic[+thirdApproverRequired][approvalLevel]
    ),
    getApprovalLevelThirdApprover: createSelector(
      selectApprovalStatus,
      ({ approvalLevel }: ApprovalStatus): ApprovalLevel =>
        thirdApproverLogic[approvalLevel]
    ),
    getRequiredApprovalLevelsForQuotation: createSelector(
      selectApprovalStatus,
      ({ thirdApproverRequired, approvalLevel }: ApprovalStatus): string =>
        approvalLevelOfQuotationLogic[+thirdApproverRequired][approvalLevel]
    ),
    getApprovalCockpitInformation: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): ApprovalWorkflowInformation =>
        cockpit?.approvalGeneral
    ),
    getApprovalCockpitEvents: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): ApprovalWorkflowEvent[] =>
        cockpit?.approvalEvents
    ),
    getHasAnyApprovalEvent: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): boolean =>
        cockpit?.approvalEvents.length > 0
    ),
    /**
     * find all events after the latest STARTED event
     * this can be empty when WF has been cancelled and not started again yet
     */
    getEventsAfterLastWorkflowStarted: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): ApprovalWorkflowEvent[] => {
        if (!cockpit.approvalEvents) {
          return [];
        }
        const workflowEventsSorted: ApprovalWorkflowEvent[] = [
          ...cockpit.approvalEvents,
        ].sort((a, b) => b.eventDate.localeCompare(a.eventDate));

        const latestCancelEvent = workflowEventsSorted.find(
          (eventItem: ApprovalWorkflowEvent) =>
            eventItem.event === ApprovalEventType.CANCELLED
        );
        // find the first START event in descended sorted List (optional: after a CANCELLED event) older entries belong to further workflow
        const latestWFStartEvent = latestCancelEvent
          ? workflowEventsSorted.find(
              (eventItem: ApprovalWorkflowEvent) =>
                eventItem.eventDate >= latestCancelEvent.eventDate &&
                eventItem.event === ApprovalEventType.STARTED
            )
          : workflowEventsSorted.find(
              (eventItem: ApprovalWorkflowEvent) =>
                eventItem.event === ApprovalEventType.STARTED
            );

        return latestWFStartEvent
          ? workflowEventsSorted.filter(
              (eventItem: ApprovalWorkflowEvent) =>
                eventItem.eventDate >= latestWFStartEvent.eventDate
            )
          : [];
      }
    ),
  }),
});

// #################################################################################
// ################################# additional functions ##########################
// #################################################################################

/**
 * checks in two dimensions array which ApprovalLevel is to be set
 *
 * @param  state {@link ApprovalState}
 * @returns the ApprovalLevel for the first Approver
 */
function getApproversForFirstApprover(
  approvers: Approver[],
  { thirdApproverRequired, approvalLevel }: ApprovalStatus
): Approver[] {
  return getApproversByApprovalLevel(
    approvers,
    firstApproverLogic[+thirdApproverRequired][approvalLevel]
  );
}

/**
 * checks in two dimensions array which ApprovalLevel is to be set
 *
 * @param  state {@link ApprovalState}
 * @returns the ApprovalLevel for the second Approver
 */
function getApproversForSecondApprover(
  approvers: Approver[],
  { thirdApproverRequired, approvalLevel }: ApprovalStatus
): Approver[] {
  return getApproversByApprovalLevel(
    approvers,
    secondApproverLogic[+thirdApproverRequired][approvalLevel]
  );
}

/**
 * checks in two dimensions array which ApprovalLevel is to be set
 *
 * @param  state {@link ApprovalState}
 * @returns the ApprovalLevel for the third optional Approver
 */
function getApproversForThirdApprover(
  approvers: Approver[],
  { thirdApproverRequired, approvalLevel }: ApprovalStatus
): Approver[] {
  return thirdApproverRequired
    ? getApproversByApprovalLevel(approvers, thirdApproverLogic[approvalLevel])
    : [];
}

/**
 * Filters approvers by level
 *
 * @param approvers all approvers
 * @param level level to filter
 * @returns list of filtered approvers
 */
function getApproversByApprovalLevel(
  approvers: Approver[],
  level: ApprovalLevel
): Approver[] {
  return approvers.filter((item) => item.approvalLevel >= level);
}
