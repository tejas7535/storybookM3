export const getCalculationResultInputGroup = (title: string) =>
  cy
    .get('ea-input-group')
    .contains(title)
    .parentsUntil('ea-input-group')
    .last()
    .parent();
