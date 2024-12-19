/* eslint-disable max-lines */

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  ActiveDirectoryUser,
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
  Quotation,
} from '@gq/shared/models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';
import { getApprovalLogic } from './constants/approvers';
import { ApproverOrder } from './model/approver-order.enum';
export interface ApprovalState {
  approvers: Approver[];
  activeDirectoryUsers: ActiveDirectoryUser[];
  approversLoading: boolean;
  activeDirectoryUsersLoading: boolean;
  triggerApprovalWorkflowInProgress: boolean;
  updateApprovalWorkflowInProgress: boolean;
  saveApprovalWorkflowInformationInProgress: boolean;
  pollingApprovalCockpitDataInProgress: boolean;
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
  pollingApprovalCockpitDataInProgress: false,
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
      totalNetValueEur: undefined,
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
        approvalCockpit: approvalInformation,
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
      (state: ApprovalState, { approvalInformation }): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: false,
        error: undefined,
        approvalCockpit: approvalInformation,
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
        error: undefined,
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
      ApprovalActions.startPollingApprovalCockpitDataSuccess,
      (state: ApprovalState, { approvalCockpit }): ApprovalState => ({
        ...state,
        approvalCockpit: {
          ...state.approvalCockpit,
          approvalEvents: approvalCockpit.approvalEvents, // only update events as only last event potentially changed
        },
      })
    ),
    on(
      ApprovalActions.startPollingApprovalCockpitDataFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        error,
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
      ApprovalActions.startPollingApprovalCockpitData,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        pollingApprovalCockpitDataInProgress: true,
      })
    ),
    on(
      ApprovalActions.stopPollingApprovalCockpitData,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        pollingApprovalCockpitDataInProgress: false,
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
    getApproversByApproverOrder: (approverOrder: ApproverOrder) =>
      createSelector(
        selectApprovers,
        selectApprovalCockpit,
        activeCaseFeature.getQuotationSalesOrgIsGreaterChina,
        (
          approvers: Approver[],
          { approvalGeneral }: ApprovalCockpitData,
          isGreaterChina: boolean
        ): Approver[] =>
          getApproversByApproverOrder(
            approvers,
            approverOrder,
            approvalGeneral,
            isGreaterChina
          )
      ),
    getApprovalLevelByApproverOrder: (approverOrder: ApproverOrder) =>
      createSelector(
        selectApprovalCockpit,
        activeCaseFeature.getQuotationSalesOrgIsGreaterChina,
        (
          {
            approvalGeneral: { thirdApproverRequired, approvalLevel },
          }: ApprovalCockpitData,
          isGreaterChina: boolean
        ): ApprovalLevel =>
          getApprovalLevelByApproverOrder(
            approverOrder,
            approvalLevel,
            thirdApproverRequired,
            isGreaterChina
          )
      ),
    getRequiredApprovalLevelsForQuotation: createSelector(
      activeCaseFeature.selectQuotation,
      selectApprovalCockpit,
      activeCaseFeature.getQuotationSalesOrgIsGreaterChina,
      (
        quotation: Quotation,
        { approvalGeneral }: ApprovalCockpitData,
        isGreaterChina: boolean
      ): string => {
        if (
          quotation?.sapId &&
          approvalGeneral?.approvalLevel !== undefined &&
          approvalGeneral?.thirdApproverRequired !== undefined
        ) {
          return getDisplayStringForApprovalLogic(
            approvalGeneral?.approvalLevel,
            approvalGeneral?.thirdApproverRequired,
            isGreaterChina
          );
        }

        return '';
      }
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
    isLatestApprovalEventVerified: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): boolean =>
        // approval events are sorted by timestamp in descending order
        // the first approval event is the latest one
        cockpit?.approvalEvents?.at(0)?.verified
    ),
    getLastEventOfApprovalWorkflow: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): ApprovalWorkflowEvent =>
        // events are desc sorted, so the first event is the latest
        cockpit?.approvalEvents?.at(0)
    ),
    getNextApprover: createSelector(
      selectApprovalCockpit,
      (cockpit: ApprovalCockpitData): string =>
        cockpit?.approvalGeneral?.nextApprover
    ),
  }),
});

// #################################################################################
// ################################# additional functions ##########################
// #################################################################################

/**
 * Get the approvers by the given approver order.
 *
 * @param approvers all approvers
 * @param approverOrder the approver order (first, second, third)
 * @param thirdApproverRequired if third approver is required
 * @param approvalLevel the approval level
 * @returns list of approvers
 */
function getApproversByApproverOrder(
  approvers: Approver[],
  approverOrder: ApproverOrder,
  { thirdApproverRequired, approvalLevel }: ApprovalWorkflowInformation,
  isGreaterChina: boolean
): Approver[] {
  const logic = getApprovalLogic(isGreaterChina, thirdApproverRequired);
  const level = logic[approvalLevel][+approverOrder];

  return getApproversByApprovalLevel(approvers, level);
}

/**
 * Gets the required approval levels for given approval level, separated by '+'.
 *
 * @param approvalLevel the approval level
 * @param thirdApproverRequired  if third approver is required
 * @param isGreaterChina if the request is for Greater China
 */
function getDisplayStringForApprovalLogic(
  approvalLevel: ApprovalLevel,
  thirdApproverRequired: boolean,
  isGreaterChina: boolean
): string {
  const logic = getApprovalLogic(isGreaterChina, thirdApproverRequired);

  return logic[approvalLevel]
    .filter((lvl) => lvl !== undefined)
    .map((lvl) => ApprovalLevel[lvl])
    .join(' + ');
}

function getApprovalLevelByApproverOrder(
  approverOrder: ApproverOrder,
  approvalLevel: ApprovalLevel,
  thirdApproverRequired: boolean,
  isGreaterChina: boolean
): ApprovalLevel {
  const logic = getApprovalLogic(isGreaterChina, thirdApproverRequired);

  return logic[approvalLevel][+approverOrder];
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
