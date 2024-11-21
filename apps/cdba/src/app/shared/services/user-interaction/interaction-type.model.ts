import { Action } from './action.model';

export class Interaction {
  constructor(
    public readonly message: string,
    public readonly action: Action
  ) {}

  static readonly HTTP_GENERAL_ERROR = new Interaction(
    'http.error.message.default',
    Action.CONTACT_SUPPORT
  );

  static readonly HTTP_GENERAL_VALIDATION_ERROR = new Interaction(
    'http.error.message.validation',
    Action.CONTACT_SUPPORT
  );

  static readonly BOM_EXPORT_SUCCESS = new Interaction(
    'search.bomExport.outcome.success',
    undefined
  );
}
