/* eslint-disable max-lines */

import {
  ActiveDirectoryUser,
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { activeCaseFeature } from '../active-case';
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
  triggerApprovalWorkflowInProgress: boolean;
  updateApprovalWorkflowInProgress: boolean;
  saveApprovalWorkflowInformationInProgress: boolean;
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
  approvalCockpitLoading: false,
  triggerApprovalWorkflowInProgress: false,
  updateApprovalWorkflowInProgress: false,
  saveApprovalWorkflowInformationInProgress: false,
  approvalCockpit: {
    approvalEvents: [],
    approvalGeneral: {
      infoUser: undefined,
      approvalLevel: undefined,
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
      (state: ApprovalState, { approvalInformation }): ApprovalState => ({
        ...state,
        approvalCockpit: {
          approvalGeneral: approvalInformation.approvalGeneral,
          approvalEvents: [
            // add the event from response to existing events in reverse order
            ...approvalInformation.approvalEvents,
            ...state.approvalCockpit.approvalEvents,
          ],
        },
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
      (state: ApprovalState, { approvalEvent }): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: false,
        error: undefined,
        approvalCockpit: {
          ...state.approvalCockpit,
          approvalEvents: [
            // add the event from response to existing events in reverse order
            approvalEvent,
            ...state.approvalCockpit.approvalEvents,
          ],
        },
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
  extraSelectors: ({ selectApprovalCockpit, selectApprovers }) => ({
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
      selectApprovalCockpit,
      (
        approvers: Approver[],
        { approvalGeneral }: ApprovalCockpitData
      ): Approver[] => getApproversForFirstApprover(approvers, approvalGeneral)
    ),
    getSecondApprovers: createSelector(
      selectApprovers,
      selectApprovalCockpit,
      (
        approvers: Approver[],
        { approvalGeneral }: ApprovalCockpitData
      ): Approver[] => getApproversForSecondApprover(approvers, approvalGeneral)
    ),
    getThirdApprovers: createSelector(
      selectApprovers,
      selectApprovalCockpit,
      (approvers: Approver[], { approvalGeneral }: ApprovalCockpitData) =>
        getApproversForThirdApprover(approvers, approvalGeneral)
    ),
    getApprovalLevelFirstApprover: createSelector(
      selectApprovalCockpit,
      ({
        approvalGeneral: { thirdApproverRequired, approvalLevel },
      }: ApprovalCockpitData): ApprovalLevel =>
        firstApproverLogic[+thirdApproverRequired][approvalLevel]
    ),
    getApprovalLevelSecondApprover: createSelector(
      selectApprovalCockpit,
      ({
        approvalGeneral: { thirdApproverRequired, approvalLevel },
      }: ApprovalCockpitData): ApprovalLevel =>
        secondApproverLogic[+thirdApproverRequired][approvalLevel]
    ),
    getApprovalLevelThirdApprover: createSelector(
      selectApprovalCockpit,
      ({
        approvalGeneral: { approvalLevel },
      }: ApprovalCockpitData): ApprovalLevel =>
        thirdApproverLogic[approvalLevel]
    ),
    getRequiredApprovalLevelsForQuotation: createSelector(
      activeCaseFeature.selectQuotation,
      selectApprovalCockpit,
      (quotation, { approvalGeneral }: ApprovalCockpitData): string =>
        quotation?.sapId &&
        approvalGeneral?.approvalLevel &&
        approvalGeneral?.thirdApproverRequired !== undefined
          ? approvalLevelOfQuotationLogic[
              +approvalGeneral?.thirdApproverRequired
            ][approvalGeneral?.approvalLevel]
          : ''
    ),
    getApprovalCockpitInformation: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): ApprovalWorkflowInformation =>
        cockpit?.approvalGeneral
    ),
    // map the user of type Approver to the workflow Events
    getApprovalCockpitEvents: createSelector(
      selectApprovalCockpit,
      selectApprovers,
      (
        cockpit: ApprovalCockpitData,
        allApprovers: Approver[]
      ): ApprovalWorkflowEvent[] =>
        cockpit?.approvalEvents?.map((singleEvent: ApprovalWorkflowEvent) => ({
          ...singleEvent,
          user:
            allApprovers.find(
              (listItem: Approver) =>
                listItem.userId.toLowerCase() ===
                singleEvent?.userId.toLowerCase()
            ) ??
            ({
              userId: singleEvent?.userId,
              firstName: singleEvent?.userId,
            } as Approver),
        }))
    ),
    getHasAnyApprovalEvent: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): boolean =>
        cockpit?.approvalEvents.length > 0
    ),
    /**
     * find all events after the latest STARTED or AUTO_APPROVED event
     * STARTED and AUTO_APPROVED ae events that started a WF
     * this can be empty when WF has been cancelled and not started again yet
     */
    getEventsOfLatestWorkflow: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): ApprovalWorkflowEvent[] => {
        if (!cockpit.approvalEvents) {
          return [];
        }

        const latestCancelEvent = cockpit.approvalEvents.find(
          (eventItem: ApprovalWorkflowEvent) =>
            eventItem.event === ApprovalEventType.CANCELLED
        );
        // find the first START event in descended sorted List (already sorted in store!!) (optional: after a CANCELLED event) older entries belong to further workflow
        // a STARTED or AUTO_APPROVED event will start a workflow (when auto_approved we do not have a started event)
        const latestWFStartEvent = latestCancelEvent
          ? cockpit.approvalEvents.find(
              (eventItem: ApprovalWorkflowEvent) =>
                eventItem.eventDate >= latestCancelEvent.eventDate &&
                (eventItem.event === ApprovalEventType.STARTED ||
                  eventItem.event === ApprovalEventType.AUTO_APPROVAL)
            )
          : cockpit.approvalEvents.find(
              (eventItem: ApprovalWorkflowEvent) =>
                eventItem.event === ApprovalEventType.STARTED ||
                eventItem.event === ApprovalEventType.AUTO_APPROVAL
            );

        return latestWFStartEvent
          ? cockpit.approvalEvents.filter(
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
  { thirdApproverRequired, approvalLevel }: ApprovalWorkflowInformation
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
  { thirdApproverRequired, approvalLevel }: ApprovalWorkflowInformation
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
  { thirdApproverRequired, approvalLevel }: ApprovalWorkflowInformation
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
