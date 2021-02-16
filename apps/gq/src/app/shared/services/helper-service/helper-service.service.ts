import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getLastYear(): number {
    return HelperService.getCurrentYear() - 1;
  }
}
