import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  ActiveDirectoryUser,
  ApiVersion,
  ApprovalCockpitData,
  ApprovalLevel,
  ApprovalStatus,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
  MicrosoftUser,
  MicrosoftUsersResponse,
  TriggerApprovalWorkflowRequest,
  UpdateApprovalWorkflowRequest,
} from '@gq/shared/models';
import { withCache } from '@ngneat/cashew';

import { ApprovalPaths } from './approval-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private readonly USERS_PAGE_SIZE = 20;
  private readonly USERS_FIELDS = [
    'givenName',
    'surname',
    'displayName',
    'userPrincipalName',
  ];

  constructor(private readonly http: HttpClient) {}

  /**
   * get All SAP Approvers
   *
   * @returns a list with available approvers
   */
  getAllApprovers(): Observable<Approver[]> {
    return (
      this.http
        .get<Approver[]>(
          `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVERS}`,
          {
            context: withCache(),
          }
        )
        // approvalLevel comes as string from BE, so let's map ('L1' to 1)
        .pipe(
          map((approvers: Approver[]) =>
            approvers
              .map((item: Approver) => ({
                ...item,
                approvalLevel: +ApprovalLevel[item.approvalLevel],
              }))
              .sort(
                (a, b) =>
                  a.approvalLevel - b.approvalLevel ||
                  a.userId.localeCompare(b.userId) ||
                  a.firstName?.localeCompare(b?.firstName) ||
                  a.lastName?.localeCompare(b?.lastName)
              )
          )
        )
    );
  }

  /**
   * get the status of the SAP quotation
   *
   * @param sapId the Id from SAP
   * @returns the approval status of SAP
   */
  getApprovalStatus(sapId: string): Observable<ApprovalStatus> {
    return (
      this.http
        .get<ApprovalStatus>(
          `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_STATUS}/${sapId}`
        )
        // ApprovalStatus from BE comes with the string 'L1' we need to cast this;
        .pipe(
          map((approvalStatus: ApprovalStatus) => ({
            ...approvalStatus,
            approvalLevel: +ApprovalLevel[approvalStatus.approvalLevel],
          }))
        )
    );
  }

  /**
   * Get a list of active directory users, which match to the given search expression in their display or principal names
   *
   * @param searchExpression The search expression
   * @returns List of found users
   */
  getActiveDirectoryUsers(
    searchExpression: string
  ): Observable<ActiveDirectoryUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      ConsistencyLevel: 'eventual',
    });

    return this.http
      .get<MicrosoftUsersResponse>(
        `${
          ApprovalPaths.PATH_USERS
        }?$search="displayName:${searchExpression}" OR "userPrincipalName:${searchExpression}"&$filter=givenName ne null and surname ne null&$orderby=userPrincipalName&$select=${this.USERS_FIELDS.join(
          ','
        )}&$count=true&$top=${this.USERS_PAGE_SIZE}`,
        { headers }
      )
      .pipe(
        map((userResponse: MicrosoftUsersResponse) =>
          userResponse.value.map((microsoftUser: MicrosoftUser) => ({
            firstName: microsoftUser.givenName,
            lastName: microsoftUser.surname,
            userId: microsoftUser.userPrincipalName.split('@')[0],
          }))
        )
      );
  }

  /**
   * Trigger the approval workflow for the SAP quotation with the given ID
   *
   * @param sapId the Id from SAP
   * @param triggerApprovalWorkflowRequest The {@link TriggerApprovalWorkflowRequest}
   */
  triggerApprovalWorkflow(
    sapId: string,
    triggerApprovalWorkflowRequest: TriggerApprovalWorkflowRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_START_APPROVAL_WORKFLOW}/${sapId}`,
      triggerApprovalWorkflowRequest
    );
  }

  /**
   * Update the approval workflow for the SAP quotation with the given ID
   *
   * @param sapId the Id from SAP
   * @param updateApprovalWorkflowRequest The {@link UpdateApprovalWorkflowRequest}
   * @returns ApprovalWorkflowEvent
   */
  updateApprovalWorkflow(
    sapId: string,
    updateApprovalWorkflowRequest: UpdateApprovalWorkflowRequest
  ): Observable<ApprovalWorkflowEvent> {
    return this.http.post<ApprovalWorkflowEvent>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_UPDATE_APPROVAL_WORKFLOW}/${sapId}`,
      updateApprovalWorkflowRequest
    );
  }

  /**
   * get all approval cockpit Data
   *
   * @param sapId sap Id of Quotation
   * @returns overall Information of the Approval Workflow {@link ApprovalCockpitData}
   */
  getApprovalCockpitData(sapId: string): Observable<ApprovalCockpitData> {
    return this.http.get<ApprovalCockpitData>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_COCKPIT_INFO}/${sapId}`
    );
  }

  /**
   * Save the approval workflow information for the SAP quotation with the given ID
   *
   * @param sapId the Id from SAP
   * @param approvalWorkflowInformation The approval workflow information to be saved
   * @return ApprovalWorkflowInformation. Only the properties of ApprovalWorkflowBaseInformation will be set in the response, based on the request. All other properties will be null.
   */
  saveApprovalWorkflowInformation(
    sapId: string,
    approvalWorkflowInformation: ApprovalWorkflowBaseInformation
  ): Observable<ApprovalWorkflowInformation> {
    return this.http.post<ApprovalWorkflowInformation>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_GENERAL_INFO}/${sapId}`,
      approvalWorkflowInformation
    );
  }
}
