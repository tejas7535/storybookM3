import { environment } from '../../../environments/environment';
import { mailAdress } from './mail.constant';

export const FORBIDDEN_ACTION = `mailto:${mailAdress}?subject=Category: Request Guided Quoting Access&body=Hello,\n\nPlease grant access to the following Guided Quoting application:\n\n${environment.envName}\n\nThank you.`;
