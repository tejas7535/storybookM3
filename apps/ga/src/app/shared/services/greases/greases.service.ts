import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@ga/environments/environment';

export interface GreaseData {
  imageUrl: string;
  ingredients: {
    [key: string]: string;
  };
}

export interface Grease {
  company: string;
  id: string;
  name: string;
  mixableGreases: string[];
  isGrease?: boolean;
  data?: GreaseData;
}

@Injectable({
  providedIn: 'root',
})
export class GreasesProviderService {
  private readonly httpClient = inject(HttpClient);
  private readonly eaAppBackendUrl = environment.dmcBackendUrl;

  public fetchAllGreases() {
    const url = `${this.eaAppBackendUrl}/greases/getGreases`;

    return this.httpClient.get<Grease[]>(url);
  }

  public fetchAllSchaefflerGreases() {
    const url = `${this.eaAppBackendUrl}/greases/getArcanolGreases`;

    return this.httpClient.get<Grease[]>(url);
  }
}
