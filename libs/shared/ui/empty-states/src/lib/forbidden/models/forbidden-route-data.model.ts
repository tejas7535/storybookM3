import { Data } from '@angular/router';

/**
 * Strongly typed route data
 * Extends the default type from the ng router
 */
export interface ForbiddenRouteData extends Data {
  /**
   * Change the text of the heading
   * Use a translation key or clear text
   * It is optional, so there is a default
   * @Optional
   */
  headingText?: string;

  /**
   * Change the text of the message
   * Use a translation key or clear text
   * It is optional, so there is a default
   * @Optional
   */
  messageText?: string;

  /**
   * Define action for the primary button
   * Possible options are:
   * 1. "event" for a void observable "next" operation (see ForbiddenEventService)
   * 2. URL string
   * If it is not set, the primary button will not be shown
   * @Optional
   */
  action?: 'event' | string;

  /**
   * Change the text of the primary button
   * Use a translation key or clear text
   * It is optional, so there is a default
   * @Optional
   */
  actionButtonText?: string;

  /**
   * Whether to hide the secondary (home) button or not
   * It is optional, the default is 'false'
   * @Optional
   */
  hideHomeButton?: boolean;

  /**
   * Change the text of the secondary (home) button
   * Use a translation key or clear text
   * It is optional, so there is a default
   * @Optional
   */
  homeButtonText?: string;
}
