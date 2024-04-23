export const getCalculationResultInputGroup = (title: string) =>
  cy
    .get('ea-input-group')
    .contains(title)
    .parentsUntil('ea-input-group')
    .last()
    .parent();

export const getInputElementAndType = (input: string, value: string) => {
  cy.get(input).first().click({ force: true });
  cy.focused().type(value, { force: true });
};

export const clickOnFirstItem = (item: string) => {
  cy.get(item, { timeout: 6000 }).first().click({ force: true });
};
