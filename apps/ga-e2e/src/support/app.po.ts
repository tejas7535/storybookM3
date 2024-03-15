export const getPlatformTitle = () => cy.get('.platform-title');

export const getInputElementAndType = (input: string, value: string) => {
  cy.get(input)
    .first()
    .click({ force: true })
    .focused()
    .type(value, { force: true });
};

export const clickOnFirstItem = (item: string) => {
  cy.get(item, { timeout: 6000 }).first().click({ force: true });
};
