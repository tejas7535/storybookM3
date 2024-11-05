/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';

import { InteractionEventType } from '../app-analytics-service/interaction-event-type.enum';

interface InteractionEvent {
  name: string;
  params: {
    content_type: string;
    content_id: string;
  };
}

interface GenericEvent {
  name: string;
  params: { [key: string]: string | number };
}

enum InteractionType {
  Navigation = 'navigation',
  ShowInput = 'showInput',
  ErrorsAndWarnings = 'errorsAndWarnings',
  ShowAllValues = 'showAllValues',
  ExternalLink = 'externalLinkNavigation',
  Interaction = 'grease_app_interaction',
}

@Injectable({
  providedIn: 'root',
})
export class MobileFirebaseAnalyticsService {
  public logNavigationEvent(navigationUrl: string): void {
    const routingNavigationEvent: InteractionEvent =
      this.getRoutingNavigationEvent(navigationUrl);
    this.logEvent(routingNavigationEvent);
  }

  public logOpenExternalLinkEvent(productName: string) {
    const externalLinkEvent = {
      name: 'access_product_details',
      params: {
        content_type: InteractionType.ExternalLink,
        content_id: 'Access Product Details',
        items: [{ name: productName }],
      },
    };

    this.logEvent(externalLinkEvent);
  }

  public logInteractionEvent(eventType: InteractionEventType): void {
    const interactionEvent = this.getInteractionEventByType(eventType);

    this.logEvent(interactionEvent);
  }

  public logRawInteractionEvent(action: string, actionFormatted: string): void {
    const interactionEvent = this.createInteractionEvent(
      action,
      InteractionType.Interaction,
      actionFormatted
    );

    this.logEvent(interactionEvent);
  }

  public isMobilePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  public logEvent(event: InteractionEvent | GenericEvent): void {
    if (!event || !this.isMobilePlatform()) {
      return;
    }

    FirebaseAnalytics.logEvent(event);
  }

  private getRoutingNavigationEvent(
    navigationUrl: string
  ): InteractionEvent | undefined {
    const greaseCalculationPath = AppRoutePath.GreaseCalculationPath;

    switch (navigationUrl) {
      case `/${greaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`:
        return this.createInteractionEvent(
          'access_main_section',
          InteractionType.Navigation,
          'Access Main Section'
        );
      case `/${greaseCalculationPath}/${GreaseCalculationPath.ResultPath}`:
        return this.createInteractionEvent(
          'generate_results',
          InteractionType.Navigation,
          'Generate Results'
        );
      default:
        return undefined;
    }
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

  private getShowAllInputsEvent(): InteractionEvent {
    return this.createInteractionEvent(
      'show_all_inputs',
      InteractionType.ShowInput,
      'Show All Inputs'
    );
  }

  private getErrorsAndWarningsEvent(): InteractionEvent {
    return this.createInteractionEvent(
      'open_errors_and_warnings_tab',
      InteractionType.ErrorsAndWarnings,
      'Open Errors And Warnings Tab'
    );
  }

  private getShowAllValuesEvent(): InteractionEvent {
    return this.createInteractionEvent(
      'show_all_product_values',
      InteractionType.ShowAllValues,
      'Show All Product Values'
    );
  }

  private createInteractionEvent(
    name: string,
    contentType: string,
    contentId: string
  ): InteractionEvent {
    return {
      name,
      params: {
        content_type: contentType,
        content_id: contentId,
      },
    };
  }
}
