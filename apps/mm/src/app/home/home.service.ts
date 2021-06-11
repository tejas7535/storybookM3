import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  NestedPropertyMeta,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';
import { combineLatest, merge, defer, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedMeta } from './home.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public constructPagedMetas(nestedMetas: NestedPropertyMeta[]): PagedMeta[] {
    const pagedMetas = nestedMetas
      .map((nestedMeta) => ({
        parent: nestedMeta,
        metas: this.extractMembers(nestedMeta),
      }))
      .map(({ parent, metas }) => {
        const controls = metas.map(
          (meta) =>
            (meta.control.get('value') as FormControl) || new FormControl({})
        );

        controls.forEach((control) => {
          // WARNING this removes all validators already set by dynamic forms (e.g. min/max)
          // if you need min/max validators, implement valid$ here to react to value changes
          // and check if all controls have a proper value (not null or '' ...)
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        });

        const valid$ =
          controls.length > 0
            ? combineLatest(
                controls.map((control) =>
                  merge(
                    defer(() => of(control.status)),
                    control.statusChanges
                  )
                )
              ).pipe(
                map((isValids) =>
                  isValids.every((isValid) =>
                    ['VALID', 'DISABLED'].includes(isValid)
                  )
                )
              )
            : of(true); // return true if there are no controls like for result page

        return { ...parent, metas, controls, valid$ };
      });

    return pagedMetas;
  }

  private extractMembers(
    nestedMeta: NestedPropertyMeta
  ): VariablePropertyMeta[] {
    const parentMetas = nestedMeta.metas as VariablePropertyMeta[];
    // TODO: check lint rules
    // eslint-disable-next-line unicorn/prefer-array-flat
    const childMetas = nestedMeta.children
      .map((child) => this.extractMembers(child))
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((flat, curr) => [...flat, ...curr], []);

    return [...parentMetas, ...childMetas];
  }
}
