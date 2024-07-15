import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { detectAppDelivery } from '@ga/core/helpers/settings-helpers';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { AppDelivery } from '@ga/shared/models';

import { InteractionEventType } from '../app-analytics-service/interaction-event-type.enum';

interface InteractionEvent {
  event: string;
  action: string;
  action_formatted: string;
  raw_action: string;
  raw_action_formatted: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmbeddedGoogleAnalyticsService {
  private readonly window: Window;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.window = this.document.defaultView;
  }
  public isApplicationOfEmbeddedVersion(): boolean {
    return this.isAppEmbedded();
  }

  public logNavigationEvent(navigationUrl: string): void {
    const routingNavigationEvent: InteractionEvent =
      this.getRoutingNavigationEvent(navigationUrl);
    this.logEvent(routingNavigationEvent);
  }

  public logInteractionEvent(eventType: InteractionEventType): void {
    const interactionEvent = this.getInteractionEventByType(eventType);

    this.logEvent(interactionEvent);
  }

  public logOpenExternalLinkEvent(productName: string): void {
    const externalLinkEvent = this.getLogExternalLinkEvent(productName);
    this.logEvent(externalLinkEvent);
  }

  public logEvent(interactionEvent: InteractionEvent): void {
    if (!this.isAppEmbedded()) {
      return;
    }

    if ((this.window as any).dataLayer && interactionEvent) {
      (this.window as any).dataLayer.push(interactionEvent);
    }
  }

  public createInteractionEvent(
    action: string,
    action_formatted: string
  ): InteractionEvent {
    return {
      event: 'grease_app_interaction',
      raw_action: 'click',
      raw_action_formatted: 'Click',
      action,
      action_formatted,
    };
  }

  private getInteractionEventByType(
    eventType: InteractionEventType
  ): InteractionEvent | undefined {
    switch (eventType) {
      case InteractionEventType.ShowInput:
        return this.getShowAllInputsEvent();
      case InteractionEventType.ErrorsAndWarnings:
        return this.getErrorsAndWarningsEvent();
      case InteractionEventType.ShowAllValues:
        return this.getShowAllValuesEvent();
      default:
        return undefined;
    }
  }

  private isAppEmbedded(): boolean {
    const appDelivery: string = detectAppDelivery();

    return appDelivery === AppDelivery.Embedded;
  }

  private getLogExternalLinkEvent(
    productName: string
  ): InteractionEvent & { name: string } {
    return {
      event: 'grease_app_interaction',
      raw_action: 'link_click',
      raw_action_formatted: 'Link Click',
      action: 'access_product_details',
      action_formatted: 'Access Product Details',
      name: productName,
    };
  }

  private getShowAllInputsEvent(): InteractionEvent {
    return this.createInteractionEvent('show_all_inputs', 'Show All Inputs');
  }

  private getErrorsAndWarningsEvent(): InteractionEvent {
    return this.createInteractionEvent(
      'open_errors_and_warnings_tab',
      'Open Errors And Warnings Tab'
    );
  }

  private getShowAllValuesEvent(): InteractionEvent {
    return this.createInteractionEvent(
      'show_all_product_values',
      'Show All Product Values'
    );
  }

  private getRoutingNavigationEvent(
    navigationUrl: string
  ): InteractionEvent | undefined {
    const greaseCalculationPath = AppRoutePath.GreaseCalculationPath;

    switch (navigationUrl) {
      case `/${greaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`:
        return this.createInteractionEvent(
          'access_main_section',
          'Access Main Section'
        );
      case `/${greaseCalculationPath}/${GreaseCalculationPath.ResultPath}`:
        return this.createInteractionEvent(
          'generate_results',
          'Generate Results'
        );
      default:
        return undefined;
    }
  }
}
