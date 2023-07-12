/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { combineLatest, map, mergeMap, Observable, of, take } from 'rxjs';

import * as fromActiveCaseSelectors from '@gq/core/store/active-case/active-case.selectors';
import {
  ActiveDirectoryUser,
  QuotationStatus,
  UpdateApprovalWorkflowRequest,
} from '@gq/shared/models';
import {
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalStatusOfRequestedApprover,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models/approval';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import { ApprovalActions } from './approval.actions';
import { approvalFeature } from './approval.reducer';
@Injectable({
  providedIn: 'root',
})
export class ApprovalFacade {
  allApproversLoading$: Observable<boolean> = this.store.select(
    approvalFeature.selectApproversLoading
  );

  activeDirectoryUsersLoading$: Observable<boolean> = this.store.select(
    approvalFeature.selectActiveDirectoryUsersLoading
  );

  approvalCockpitLoading$: Observable<boolean> = this.store.select(
    approvalFeature.selectApprovalCockpitLoading
  );

  firstApprovers$: Observable<Approver[]> = this.store.select(
    approvalFeature.getFirstApprovers
  );

  secondApprovers$: Observable<Approver[]> = this.store.select(
    approvalFeature.getSecondApprovers
  );

  thirdApprovers$: Observable<Approver[]> = this.store.select(
    approvalFeature.getThirdApprovers
  );

  approvalLevelFirstApprover$: Observable<ApprovalLevel> = this.store.select(
    approvalFeature.getApprovalLevelFirstApprover
  );

  approvalLevelSecondApprover$: Observable<ApprovalLevel> = this.store.select(
    approvalFeature.getApprovalLevelSecondApprover
  );

  approvalLevelThirdApprover$: Observable<ApprovalLevel> = this.store.select(
    approvalFeature.getApprovalLevelThirdApprover
  );

  requiredApprovalLevelsForQuotation$: Observable<string> = this.store.select(
    approvalFeature.getRequiredApprovalLevelsForQuotation
  );

  activeDirectoryUsers$: Observable<ActiveDirectoryUser[]> = this.store.select(
    approvalFeature.selectActiveDirectoryUsers
  );

  triggerApprovalWorkflowInProgress$: Observable<boolean> = this.store.select(
    approvalFeature.selectTriggerApprovalWorkflowInProgress
  );

  triggerApprovalWorkflowSucceeded$: Observable<void> = this.actions$.pipe(
    ofType(ApprovalActions.triggerApprovalWorkflowSuccess)
  );

  saveApprovalWorkflowInformationInProgress$: Observable<boolean> =
    this.store.select(
      approvalFeature.selectSaveApprovalWorkflowInformationInProgress
    );

  saveApprovalWorkflowInformationSucceeded$: Observable<void> =
    this.actions$.pipe(
      ofType(ApprovalActions.saveApprovalWorkflowInformationSuccess)
    );

  updateApprovalWorkflowInProgress$: Observable<boolean> = this.store.select(
    approvalFeature.selectUpdateApprovalWorkflowInProgress
  );

  updateApprovalWorkflowSucceeded$: Observable<void> = this.actions$.pipe(
    ofType(ApprovalActions.updateApprovalWorkflowSuccess)
  );

  approvalCockpit$: Observable<ApprovalCockpitData> = this.store.select(
    approvalFeature.selectApprovalCockpit
  );

  approvalCockpitInformation$: Observable<ApprovalWorkflowInformation> =
    this.store.select(approvalFeature.getApprovalCockpitInformation);

  getApprovalWorkflowEvents$: Observable<ApprovalWorkflowEvent[]> =
    this.store.select(approvalFeature.getApprovalCockpitEvents);

  hasAnyApprovalEvent$: Observable<boolean> = this.store.select(
    approvalFeature.getHasAnyApprovalEvent
  );

  quotationStatus$: Observable<QuotationStatus> = this.store.select(
    fromActiveCaseSelectors.getQuotationStatus
  );

  workflowInProgress$: Observable<boolean> = this.quotationStatus$.pipe(
    map(
      (status: QuotationStatus) =>
        status === QuotationStatus.IN_APPROVAL ||
        status === QuotationStatus.REJECTED
    )
  );

  quotationFullyApproved$: Observable<boolean> = this.quotationStatus$.pipe(
    map((status: QuotationStatus) => status === QuotationStatus.APPROVED)
  );

  /**
   * Provides the ApprovalStatus of each approver defined in ApprovalGeneral.
   * (the Approver data and the corresponding workflowEvent)
   * Considers only events after the latest started of the Workflow (either the from latest start event or from the latest cancel event if not restarted )
   * for this model, if event has data --> the user has made an approval decision such as approved, rejected.
   * if event is undefined, the user hasn't made a decision yet, so it's status would be 'in approval'
   *
   * If no Approvers can be determined the list will return empty
   */
  approvalStatusOfRequestedApprover$: Observable<
    ApprovalStatusOfRequestedApprover[]
  > = combineLatest([
    this.store.select(approvalFeature.getEventsAfterLastWorkflowStarted),
    this.approvalCockpitInformation$,
    this.store.select(approvalFeature.selectApprovers),
  ]).pipe(
    map(
      ([events, info, approvers]: [
        ApprovalWorkflowEvent[],
        ApprovalWorkflowInformation,
        Approver[]
      ]) => {
        // either all approvers (two or three) are set or no approvers are set
        // when no approvers have been saved, then we do not have a approvalStatus of the RequestedApprovers
        if (!info.firstApprover) {
          return [];
        }

        return [
          this.getApprovalStatusDataForUserId(
            approvers,
            events,
            info?.firstApprover
          ),

          this.getApprovalStatusDataForUserId(
            approvers,
            events,
            info?.secondApprover
          ),
          ...(info?.thirdApproverRequired
            ? [
                this.getApprovalStatusDataForUserId(
                  approvers,
                  events,
                  info?.thirdApprover
                ),
              ]
            : []),
        ];
      }
    )
  );

  numberOfRequiredApprovals$: Observable<number> =
    this.approvalStatusOfRequestedApprover$.pipe(
      map((items: ApprovalStatusOfRequestedApprover[]) => items.length)
    );

  numberOfReceivedApprovals$: Observable<number> =
    this.approvalStatusOfRequestedApprover$.pipe(
      map(
        (items: ApprovalStatusOfRequestedApprover[]) =>
          items.filter(
            (item: ApprovalStatusOfRequestedApprover) =>
              item.event?.event === ApprovalEventType.APPROVED
          )?.length ?? 0
      )
    );

  receivedApprovalsOfRequiredApprovals$: Observable<string> = combineLatest([
    this.numberOfReceivedApprovals$,
    this.numberOfRequiredApprovals$,
  ]).pipe(
    map(([approved, required]: [number, number]) => `${approved}/${required}`)
  );

  // TODO: will be update with FE AutoApproved Event implementation
  workflowStepsComplete$ = combineLatest([
    this.quotationStatus$,
    this.numberOfReceivedApprovals$,
    this.numberOfRequiredApprovals$,
  ]).pipe(
    map(
      ([quotationStatus, approved, required]: [
        QuotationStatus,
        number,
        number
      ]) => {
        switch (quotationStatus) {
          case QuotationStatus.ACTIVE:
            return 0;
          case QuotationStatus.IN_APPROVAL:
            return approved === required ? 2 : 1;
          case QuotationStatus.APPROVED:
            return 3;
          case QuotationStatus.REJECTED:
            return 1;
          default:
            return 0;
        }
      }
    )
  );

  /**
   * get the latest AUTO_APPROVED event of recent workflow
   */
  quotationAutoApprovedEvent$: Observable<ApprovalWorkflowEvent> =
    combineLatest([
      this.quotationStatus$,
      this.store.select(approvalFeature.getEventsAfterLastWorkflowStarted),
    ]).pipe(
      map(([status, events]: [QuotationStatus, ApprovalWorkflowEvent[]]) => {
        if (status !== QuotationStatus.APPROVED) {
          return undefined as ApprovalWorkflowEvent;
        }
        const autoApprovalEvent = events.find(
          (eventItem: ApprovalWorkflowEvent) =>
            eventItem.event === ApprovalEventType.AUTO_APPROVAL
        );

        return autoApprovalEvent;
      })
    );

  shouldShowApprovalButtons$: Observable<boolean> = combineLatest([
    this.store.select(getUserUniqueIdentifier),
    this.approvalStatusOfRequestedApprover$,
  ]).pipe(
    map(
      ([userId, approversWithApprovalStatus]: [
        string,
        ApprovalStatusOfRequestedApprover[]
      ]) => {
        const approverIndex = approversWithApprovalStatus.findIndex(
          (approverWithApprovalStatus: ApprovalStatusOfRequestedApprover) =>
            approverWithApprovalStatus.approver.userId.toLowerCase() ===
            userId.toLowerCase()
        );

        // If user is an approver and has not made any approval decision (approve, reject, forward) yet
        if (
          approverIndex > -1 &&
          !approversWithApprovalStatus[approverIndex].event
        ) {
          // If user is first approver, show buttons.
          // Otherwise show buttons, only if the previous approver has already approved.
          return approverIndex === 0
            ? true
            : approversWithApprovalStatus[approverIndex - 1].event?.event ===
                ApprovalEventType.APPROVED;
        }

        return false;
      }
    )
  );

  /**
   * List of approvers on the same approval step as the current user, who is one of the specified approvers for the quotation.
   *
   * If the user is
   * - the first approver, return a list of first approvers
   * - the second approver, return a list of second approvers
   * - the third approver, return a list of third approvers
   *
   *  corresponding to the required approval levels for the quotation.
   *
   * The current user is not in the returned approvers list!
   */
  approversOnUserApprovalStep$: Observable<Approver[]> = combineLatest([
    this.store.select(getUserUniqueIdentifier),
    this.approvalStatusOfRequestedApprover$,
  ]).pipe(
    mergeMap(
      ([userId, approversWithApprovalStatus]: [
        string,
        ApprovalStatusOfRequestedApprover[]
      ]) => {
        const approverIndex = approversWithApprovalStatus.findIndex(
          (approverWithApprovalStatus: ApprovalStatusOfRequestedApprover) =>
            approverWithApprovalStatus.approver.userId.toLowerCase() ===
            userId.toLowerCase()
        );

        let approvers$: Observable<Approver[]>;

        switch (approverIndex) {
          case 0:
            approvers$ = this.firstApprovers$;
            break;
          case 1:
            approvers$ = this.secondApprovers$;
            break;
          case 2:
            approvers$ = this.thirdApprovers$;
            break;
          default:
            approvers$ = of([]);
        }

        return approvers$.pipe(
          map((approvers: Approver[]) =>
            approvers.filter(
              (approver: Approver) =>
                approver.userId.toLowerCase() !== userId.toLowerCase()
            )
          )
        );
      }
    )
  );

  /*
   * get the latest RELEASED event af recent workflow
   */
  quotationFinalReleaseEvent$: Observable<ApprovalWorkflowEvent> =
    combineLatest([
      this.quotationStatus$,
      this.store.select(approvalFeature.getEventsAfterLastWorkflowStarted),
    ]).pipe(
      map(([status, events]: [QuotationStatus, ApprovalWorkflowEvent[]]) => {
        if (status !== QuotationStatus.APPROVED) {
          return undefined as ApprovalWorkflowEvent;
        }

        return this.findEventByEventType(events, ApprovalEventType.RELEASED);
      })
    );

  /**
   * get the latest REJECTED event of recent workflow
   */
  quotationRejectedEvent$: Observable<ApprovalWorkflowEvent> = combineLatest([
    this.quotationStatus$,
    this.store.select(approvalFeature.selectApprovers),
    this.store.select(approvalFeature.getEventsAfterLastWorkflowStarted),
  ]).pipe(
    map(
      ([status, allApprovers, events]: [
        QuotationStatus,
        Approver[],
        ApprovalWorkflowEvent[]
      ]) => {
        if (status !== QuotationStatus.REJECTED) {
          return undefined as ApprovalWorkflowEvent;
        }

        const rejectedEvent = this.findEventByEventType(
          events,
          ApprovalEventType.REJECTED
        );

        return (
          rejectedEvent && {
            ...rejectedEvent,
            user: this.findApproverByUserId(allApprovers, rejectedEvent.userId),
          }
        );
      }
    )
  );

  /** get the latest CANCELLED Event of recent Workflow */
  quotationCancelledEvent$: Observable<ApprovalWorkflowEvent> =
    this.getApprovalWorkflowEvents$.pipe(
      map((events: ApprovalWorkflowEvent[]) =>
        // if events are sorted descending and the last event is Cancelled, then the Workflow has been cancelled
        // if there is any event after a cancelled event, then the workflow is in any other state
        events[0]?.event === ApprovalEventType.CANCELLED ? events[0] : undefined
      )
    );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly approvalService: ApprovalService
  ) {}

  /**
   * load all available approvers
   */
  getApprovers(): void {
    this.store.dispatch(ApprovalActions.getAllApprovers());
  }

  getApprovalCockpitData(sapId: string): void {
    return sapId
      ? this.store.dispatch(ApprovalActions.getApprovalCockpitData({ sapId }))
      : this.store.dispatch(ApprovalActions.clearApprovalCockpitData());
  }

  /**
   * Loads all Information needed for approval workflow.
   * Contains all available approvers and approval Status of given sap Id.
   *
   * @param sapId sap Id of quotation
   */
  getAllApprovalData(sapId: string): void {
    this.getApprovers();
    this.getApprovalCockpitData(sapId);
  }

  /**
   * load all active directory users, which match to the given search expression
   */
  getActiveDirectoryUsers(searchExpression: string): void {
    this.store.dispatch(
      ApprovalActions.getActiveDirectoryUsers({ searchExpression })
    );
  }

  /** get activeDirectory user by userId (Schaeffler userId (alias)) */
  getActiveDirectoryUserByUserId(
    userId: string
  ): Observable<ActiveDirectoryUser> {
    return this.approvalService.getActiveDirectoryUsers(userId).pipe(
      take(1),
      map((data: ActiveDirectoryUser[]) => data[0])
    );
  }

  /**
   * Remove all active directory users from the store
   */
  clearActiveDirectoryUsers(): void {
    this.store.dispatch(ApprovalActions.clearActiveDirectoryUsers());
  }

  /**
   * Trigger the approval workflow process
   *
   * @param approvalWorkflowData Approval workflow data, specified by the user
   */
  triggerApprovalWorkflow(
    approvalWorkflowData: Omit<ApprovalWorkflowBaseInformation, 'gqId'>
  ): void {
    this.store.dispatch(
      ApprovalActions.triggerApprovalWorkflow({ approvalWorkflowData })
    );
  }

  /**
   * Save the approval workflow information
   *
   * @param approvalWorkflowInformation Approval workflow information to be saved
   */
  saveApprovalWorkflowInformation(
    approvalWorkflowInformation: Omit<ApprovalWorkflowBaseInformation, 'gqId'>
  ): void {
    this.store.dispatch(
      ApprovalActions.saveApprovalWorkflowInformation({
        approvalWorkflowInformation,
      })
    );
  }

  /**
   * Update the approval workflow process
   *
   * @param updateApprovalWorkflowData Update approval workflow data
   */
  updateApprovalWorkflow(
    updateApprovalWorkflowData: Omit<UpdateApprovalWorkflowRequest, 'gqId'>
  ): void {
    this.store.dispatch(
      ApprovalActions.updateApprovalWorkflow({ updateApprovalWorkflowData })
    );
  }

  /**
   * found approval Status for userId
   *
   * @param approvers list of all possible approvers
   * @param events  list of all approval Workflow events
   * @param userId the id of the userId the event is to be found
   * @returns {@link ApprovalStatusOfRequestedApprover} the approver and it's corresponding event
   */
  private getApprovalStatusDataForUserId(
    approvers: Approver[],
    events: ApprovalWorkflowEvent[],
    userId: string
  ): ApprovalStatusOfRequestedApprover {
    return {
      approver: this.findApproverByUserId(approvers, userId),
      event: this.findTheLatestApprovalEventOfUserId(events, userId),
    };
  }

  /**
   * find the latest workflow event for given userId
   *
   * @param workflowEvents all approval workflow events
   * @param userId userId the latest event is the be found
   */
  private findTheLatestApprovalEventOfUserId(
    workflowEvents: ApprovalWorkflowEvent[],
    userId: string
  ): ApprovalWorkflowEvent {
    const workflowEventsSorted = [...workflowEvents];

    // when userId has multiple Events at the same timestamp (would happen if workflow starting user is also first Approver --> Case would be preApproved)
    // then the 'approved' event has priority over 'started' event
    // only start and approved can be at same timestamp
    // sort the array descending by time but ascending by eventName

    // if approver has started event but no approved event, the started event will NOT be returned
    return workflowEventsSorted
      .sort(
        (a, b) =>
          b.eventDate.localeCompare(a.eventDate) ||
          a.event.localeCompare(b.event)
      )
      .find(
        (event: ApprovalWorkflowEvent) =>
          event.userId.toLowerCase() === userId.toLowerCase() &&
          event.event !== ApprovalEventType.STARTED
      );
  }

  /**
   * Get the {@link Approver} object by given userID
   *
   * @param approvers list of all possible approvers
   * @param userId userId to search for
   * @returns the approver {@link Approver}
   */
  private readonly findApproverByUserId = (
    approvers: Approver[],
    userId: string
  ): Approver =>
    approvers.find(
      (listItem: Approver) =>
        listItem.userId.toLowerCase() === userId.toLowerCase()
    ) ?? ({ userId, firstName: userId } as Approver);

  private readonly findEventByEventType = (
    events: ApprovalWorkflowEvent[],
    eventType: ApprovalEventType
  ): ApprovalWorkflowEvent =>
    events.find(
      (eventItem: ApprovalWorkflowEvent) => eventItem.event === eventType
    );
}
