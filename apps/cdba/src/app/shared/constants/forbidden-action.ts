import { environment } from '@cdba/environments/environment';

export const FORBIDDEN_ACTION = `mailto:it-support-sg@schaeffler.com?subject=Assignment Group: CDBA_Support_G; Category: CDBA_Access&body=Hi,\n\nplease grant access to the following CDBA application:\n\n${environment.envName}\n\nThank you.`;
export const NO_ACCESS_ACTION = `https://sconnect.schaeffler.com/groups/cost-database-analytics/blog/2020/10/14/how-does-the-rights-management-works`;
