import { getH2 } from '../support/app.po';

describe('helloworld-azure', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getH2().contains('Here are some links to help you start:');
  });
});
