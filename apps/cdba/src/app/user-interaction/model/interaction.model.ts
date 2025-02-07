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

  static readonly REQUEST_BOM_EXPORT_SUCCESS = new Interaction(
    'search.bomExport.request.success',
    undefined
  );

  static readonly REQUEST_BOM_EXPORT_VALIDATION_ERROR = new Interaction(
    'search.bomExport.request.validation',
    undefined
  );

  static readonly REQUEST_BOM_EXPORT_FAILURE = new Interaction(
    'search.bomExport.request.failure',
    Action.CONTACT_SUPPORT
  );

  static readonly TRACK_BOM_EXPORT_PROGRESS_COMPLETED = new Interaction(
    'userInteraction.feature.bomExport.notify.completed',
    undefined
  );

  static readonly TRACK_BOM_EXPORT_PROGRESS_FAILURE = new Interaction(
    'userInteraction.feature.bomExport.notify.failure',
    Action.CONTACT_SUPPORT
  );

  static readonly GET_BOM_EXPORT_STATUS_FAILURE = new Interaction(
    'userInteraction.feature.bomExport.status.loadingFailed',
    Action.CONTACT_SUPPORT
  );
}
