import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RxStomp, RxStompConfig, RxStompState } from '@stomp/rx-stomp';
import { IMessage } from '@stomp/stompjs';

import { environment } from '../../../environments/environment';
import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  public apiUrl: string;
  public rxStomp: RxStomp = new RxStomp();
  public stompConfig: RxStompConfig = {
    reconnectDelay: 200,
  };

  public constructor(
    @Inject(ENV_CONFIG) private readonly config: EnvironmentConfig
  ) {
    this.apiUrl = `${this.config.environment.baseUrl}`;
  }

  public connect(token: string): Observable<RxStompState> {
    const brokerURL = `${this.getSocketUrl(
      this.apiUrl
    )}/gw-ws/websocket?token=${token}`;
    this.stompConfig = {
      ...this.stompConfig,
      brokerURL,
    };

    if (environment.devToolsEnabled) {
      this.stompConfig = {
        ...this.stompConfig,
        debug(status: string): void {
          console.log(`STOMP: ${status}`);
        },
      };
    }

    this.rxStomp.configure(this.stompConfig);
    this.rxStomp.activate();

    return this.rxStomp.connected$;
  }

  public disconnect(): Observable<RxStompState> {
    this.rxStomp.deactivate();

    return this.rxStomp.connected$;
  }

  public getTopicBroadcast(): Observable<IMessage> {
    return this.rxStomp.watch('/topic/broadcast');
  }

  public getSocketUrl(apiUrl: string): string {
    return apiUrl.includes('http')
      ? apiUrl.replace('http', 'ws')
      : `wss://${window.location.host}${apiUrl}`;
  }
}
