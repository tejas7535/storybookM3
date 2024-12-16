import { URL_SUPPORT } from '@cdba/shared/constants/urls';

export class Action {
  public constructor(
    public message: string,
    public url: string
  ) {}

  static readonly CONTACT_SUPPORT = new Action(
    'http.error.action.contactSupport',
    URL_SUPPORT
  );
}
