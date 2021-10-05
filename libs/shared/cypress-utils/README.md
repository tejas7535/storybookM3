# cypress-utils

This library is designed to enable reliable E2E-Tests with Cypress as well as to reduce diplications in E2E-Applications.
It contains:

- `custom commands` (WIP)
- `login logic`
- `reusable specs`

## Login

The login sections provides you the class `Authorization`, which contains login- and logout-logic for the OAuth-Flow with `Keycloak`.

### Usage

You just need to instanciate the class and use the public methods:

```javascript
import { Authorization } from '@performance-check/cypress-utils';

const loginHelper = new Authorization();

// login
loginHelper.kcLogin(username, passoword);

// logout
loginHelper.kcLogout();
```

### Custom Command

It is highly recommended to use the login and logout within a `custom command`:

```javascript
// commands.ts
Cypress.Commands.add('kcLogin', () => {
  cy.fixture('admin').then(admin => {
    loginHelper.kcLogin(admin.username, admin.password);
  });
});

// *.spec.ts
describe('spec', () => {
  before(() => {
    cy.kcLogin();
  });
});
```

## Specs

This section contains reusable specs, so that you don't have to write & maintain same specs in multiple E2E-Apps again and again. By now, you can find specs for:

- login
- page not found