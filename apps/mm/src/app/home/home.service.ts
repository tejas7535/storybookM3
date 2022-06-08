import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import { combineLatest, defer, map, merge, of } from 'rxjs';

import {
  NestedPropertyMeta,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';

import {
  RSY_BEARING_SERIES,
  RSY_BEARING_TYPE,
  RSY_PAGE_BEARING,
  RSY_PAGE_BEARING_TYPE,
} from '../shared/constants/dialog-constant';
import { BearingParams, PagedMeta, Value } from './home.model';

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
            (meta.control.get('value') as UntypedFormControl) ||
            new UntypedFormControl({})
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

  public getBearingParams(pagedMetas: PagedMeta[]): BearingParams {
    const idValue = pagedMetas
      .find((pagedMeta) => pagedMeta.page.id === RSY_PAGE_BEARING_TYPE)
      ?.metas.map((meta, index) => ({
        key: index,
        pageId: (meta.member as any).id,
      }))
      .find((value: Value) => value.pageId === 'RSY_BEARING')?.key;

    const id = pagedMetas
      .find((pagedMeta) => pagedMeta.page.id === RSY_PAGE_BEARING_TYPE)
      ?.controls.find(
        (control, index) => idValue === index && control.status === 'VALID'
      )?.value;

    const values = pagedMetas
      .find((pagedMeta) => pagedMeta.page.id === RSY_PAGE_BEARING_TYPE)
      ?.metas.map((meta, index) => ({
        key: index, // this index is potentially wrong
        pageId: (meta.member as any).id,
      }))
      .filter(
        (value: Value) =>
          value.pageId === RSY_BEARING_TYPE ||
          value.pageId === RSY_BEARING_SERIES
      );

    const params = pagedMetas
      .find((pagedMeta) => pagedMeta.page.id === RSY_PAGE_BEARING_TYPE)
      ?.controls.filter(
        (control, index) =>
          values.find((value) => value.key === index) &&
          control.status === 'VALID'
      )
      .map((control, index) => ({
        name: values.find((value) => value.key === index).pageId,
        value: control.value,
      }));

    const url = (
      pagedMetas
        .find((pagedMeta) => pagedMeta.page.id === RSY_PAGE_BEARING_TYPE)
        ?.children.find((child) => child.page.id === RSY_PAGE_BEARING)?.metas[0]
        .member as any
    )?.optionsUrl;

    return {
      id,
      url,
      params,
    };
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
