import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { extractNestedErrors } from './form.helper';

describe('extractNestedErrors', () => {
  it('should return an empty object if the form group has no errors', () => {
    const formGroup = new FormGroup({
      name: new FormControl('John', Validators.required),
      age: new FormControl(30, Validators.min(18)),
    });

    const result = extractNestedErrors(formGroup);

    expect(result).toEqual({});
  });

  it('should return an object with errors for nested form groups', () => {
    const formGroup = new FormGroup({
      name: new FormControl('John', Validators.required),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        zip: new FormControl('1234567', Validators.pattern(/^\d{5}$/)),
      }),
    });

    const result = extractNestedErrors(formGroup);

    expect(result).toEqual({
      address: {
        street: { required: true },
        city: { required: true },
        zip: {
          pattern: { requiredPattern: '/^\\d{5}$/', actualValue: '1234567' },
        },
      },
    });
  });

  it('should return an object with errors for nested form arrays', () => {
    const formGroup = new FormGroup({
      name: new FormControl('John', Validators.required),
      phones: new FormArray([
        new FormGroup({
          type: new FormControl('', Validators.required),
          number: new FormControl('abc', Validators.pattern(/^\d{10}$/)),
        }),
        new FormGroup({
          type: new FormControl('', Validators.required),
          number: new FormControl('cde', Validators.pattern(/^\d{10}$/)),
        }),
      ]),
    });

    const result = extractNestedErrors(formGroup);

    expect(result).toEqual({
      phones: {
        0: {
          type: { required: true },
          number: {
            pattern: { requiredPattern: '/^\\d{10}$/', actualValue: 'abc' },
          },
        },
        1: {
          type: { required: true },
          number: {
            pattern: { requiredPattern: '/^\\d{10}$/', actualValue: 'cde' },
          },
        },
      },
    });
  });

  it('should return an object with errors for nested form groups and arrays', () => {
    const formGroup = new FormGroup({
      name: new FormControl('John', Validators.required),
      addresses: new FormArray([
        new FormGroup({
          street: new FormControl('', Validators.required),
          city: new FormControl('', Validators.required),
          zip: new FormControl('888888', Validators.pattern(/^\d{5}$/)),
        }),
        new FormGroup({
          street: new FormControl('', Validators.required),
          city: new FormControl('', Validators.required),
          zip: new FormControl('99999999', Validators.pattern(/^\d{5}$/)),
        }),
      ]),
    });

    const result = extractNestedErrors(formGroup);

    expect(result).toEqual({
      addresses: {
        0: {
          street: { required: true },
          city: { required: true },
          zip: {
            pattern: { requiredPattern: '/^\\d{5}$/', actualValue: '888888' },
          },
        },
        1: {
          street: { required: true },
          city: { required: true },
          zip: {
            pattern: { requiredPattern: '/^\\d{5}$/', actualValue: '99999999' },
          },
        },
      },
    });
  });
});
