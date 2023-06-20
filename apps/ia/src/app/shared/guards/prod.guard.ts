import { Injectable, isDevMode } from '@angular/core';
import { CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProdGuard implements CanLoad {
  canLoad() {
    return isDevMode();
  }
}
