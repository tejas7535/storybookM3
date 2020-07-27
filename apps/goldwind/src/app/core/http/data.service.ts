import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RxStomp, RxStompConfig, RxStompState } from '@stomp/rx-stomp';
import { IMessage } from '@stomp/stompjs';

import { IotThing } from '../store/reducers/thing/models';
import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public apiUrl: string;
  public rxStomp: RxStomp = new RxStomp();
  public stompConfig: RxStompConfig = {
    debug(status: string): void {
      console.log(`STOMP: ${status}`); // will be disabled for actual production
    },
    reconnectDelay: 200,
  };

  public constructor(
    @Inject(ENV_CONFIG) private readonly config: EnvironmentConfig,
    private readonly http: HttpClient
  ) {
    this.apiUrl = `${this.config.environment.baseUrl}`;
  }

  public getIotThings(path: string): Observable<IotThing> {
    return this.http.get<IotThing>(`${this.apiUrl}/iot/things/${path}`);
  }

  public connect(token: string): Observable<RxStompState> {
    const socketUrl = this.apiUrl.replace('http', 'ws');
    const brokerURL = `${socketUrl}/gw-ws/websocket?token=${token}`;
    this.rxStomp.configure({
      ...this.stompConfig,
      brokerURL,
    });
    this.rxStomp.activate();

    return this.rxStomp.connected$;
  }

  public getTopicBroadcast(): Observable<IMessage> {
    return this.rxStomp.watch('/topic/broadcast');
  }
}
