import {
  ActiveDirectoryUser,
  ApprovalCockpitData,
  ApprovalStatus,
  ApprovalWorkflowEvent,
  Approver,
  TriggerApprovalWorkflowRequest,
  UpdateApprovalWorkflowRequest,
} from '@gq/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ApprovalActions = createActionGroup({
  source: 'Approval',
  events: {
    'Get all Approvers': emptyProps(),
    'Get all Approvers Success': props<{ approvers: Approver[] }>(),
    'All Approvers already loaded': emptyProps(),
    'Get all Approvers Failure': props<{ error: Error }>(),
    'Get Approval Status': props<{ sapId: string }>(),
    'Get Approval Status Success': props<{ approvalStatus: ApprovalStatus }>(),
    'Approval Status already loaded': emptyProps(),
    'Get Approval Status Failure': props<{ error: Error }>(),
    'Clear Approval Status': emptyProps(),
    'Get Active Directory Users': props<{ searchExpression: string }>(),
    'Get Active Directory Users Success': props<{
      activeDirectoryUsers: ActiveDirectoryUser[];
    }>(),
    'Get Active Directory Users Failure': props<{ error: Error }>(),
    'Clear Active Directory Users': emptyProps(),
    'Trigger Approval Workflow': props<{
      approvalWorkflowData: Omit<
        TriggerApprovalWorkflowRequest,
        'gqId' | 'gqLinkBase64Encoded'
      >;
    }>(),
    'Trigger Approval Workflow Success': emptyProps(),
    'Trigger Approval Workflow Failure': props<{ error: Error }>(),

    'Update Approval Workflow': props<{
      updateApprovalWorkflowData: Omit<UpdateApprovalWorkflowRequest, 'gqId'>;
    }>(),
    'Update Approval Workflow Success': props<{
      approvalEvent: ApprovalWorkflowEvent;
    }>(),
    'Update Approval Workflow Failure': props<{ error: Error }>(),

    'Get Approval Cockpit Data': props<{ sapId: string }>(),
    'Get Approval Cockpit Data Success': props<{
      approvalCockpit: ApprovalCockpitData;
    }>(),
    'Approval Cockpit Data Already loaded': emptyProps(),
    'Get Approval Cockpit Data Failure': props<{ error: Error }>(),
    'Clear Approval Cockpit Data': emptyProps(),
  },
});
