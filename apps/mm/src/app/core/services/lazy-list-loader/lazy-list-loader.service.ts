import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '@mm/environments/environment';
import { BearingSeatsResponse, SimpleListResponse } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';

import { RestService } from '../';

@Injectable({
  providedIn: 'root',
})
export class LazyListLoaderService {
  public baseImageURL = environment.baseUrl.replace('/v2/mountingmanager', '');

  private readonly restService = inject(RestService);

  public loadOptions(url: string): Observable<ListValue[]> {
    return this.restService
      .getLoadOptions<SimpleListResponse>(url)
      .pipe(map((response) => this.mapToOptions(response)));
  }

  public loadBearingSeatsOptions(url: string): Observable<ListValue[]> {
    return this.restService
      .getLoadOptions<BearingSeatsResponse>(url)
      .pipe(map((response) => this.mapToOptions(response.bearingSeats)));
  }

  private mapToOptions(
    items: { id: string; title: string; image: string | undefined }[]
  ): ListValue[] {
    return items.map((item) => ({
      id: item.id,
      text: item.title,
      imageUrl: item.image ? this.getImageUrl(item.image) : undefined,
    }));
  }

  private getImageUrl(imageName: string): string {
    return `${this.baseImageURL}/images/${imageName}`;
  }
}
