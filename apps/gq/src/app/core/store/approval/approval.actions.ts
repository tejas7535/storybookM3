import {
  ActiveDirectoryUser,
  ApprovalCockpitData,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowInformation,
  Approver,
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
    'Get Active Directory Users': props<{ searchExpression: string }>(),
    'Get Active Directory Users Success': props<{
      activeDirectoryUsers: ActiveDirectoryUser[];
    }>(),
    'Get Active Directory Users Failure': props<{ error: Error }>(),
    'Clear Active Directory Users': emptyProps(),
    'Trigger Approval Workflow': props<{
      approvalWorkflowData: Omit<ApprovalWorkflowBaseInformation, 'gqId'>;
    }>(),
    'Trigger Approval Workflow Success': props<{
      approvalInformation: ApprovalCockpitData;
    }>(),
    'Trigger Approval Workflow Failure': props<{ error: Error }>(),
    'Update Approval Workflow': props<{
      updateApprovalWorkflowData: Omit<UpdateApprovalWorkflowRequest, 'gqId'>;
    }>(),
    'Update Approval Workflow Success': props<{
      approvalInformation: ApprovalCockpitData;
    }>(),
    'Update Approval Workflow Failure': props<{ error: Error }>(),

    'Get Approval Cockpit Data': props<{
      sapId: string;
      forceLoad?: boolean;
      hideLoadingSpinner?: boolean;
    }>(),
    'Get Approval Cockpit Data Success': props<{
      approvalCockpit: ApprovalCockpitData;
    }>(),
    'Approval Cockpit Data Already loaded': emptyProps(),
    'Get Approval Cockpit Data Failure': props<{ error: Error }>(),
    'Clear Approval Cockpit Data': emptyProps(),
    'Start Polling Approval Cockpit Data': emptyProps(),
    'Start Polling Approval Cockpit Data Success': props<{
      approvalCockpit: ApprovalCockpitData;
    }>(),
    'Start Polling Approval Cockpit Data Failure': props<{ error: Error }>(),
    'Stop Polling Approval Cockpit Data': emptyProps(),
    'Save Approval Workflow Information': props<{
      approvalWorkflowInformation: Omit<
        ApprovalWorkflowBaseInformation,
        'gqId'
      >;
    }>(),
    'Save Approval Workflow Information Success': props<{
      approvalGeneral: ApprovalWorkflowInformation;
    }>(),
    'Save Approval Workflow Information Failure': props<{ error: Error }>(),
  },
});
