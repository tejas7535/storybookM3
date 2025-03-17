import {
  CMPActionName,
  isInactictivationAllowed,
  isPhaseOutAllowed,
  isReactivationAllowed,
  isSubstitutionAllowed,
  isSubstitutionChangeToSchaefflerAllowed,
  isSubstitutionProposalAllowed,
  isSubstitutionRevertAllowed,
  statusActions,
} from './status-actions';

describe('statusActions', () => {
  it('should allow EDIT action', () => {
    const action = statusActions.find((a) => a.name === CMPActionName.EDIT);
    expect(action?.isAllowed(null)).toBe(true);
  });

  it('should allow SUBSTITUTION_PROPOSAL action for SP, SB, and SI statuses', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.SUBSTITUTION_PROPOSAL
    );
    expect(action?.isAllowed('SP')).toBe(true);
    expect(action?.isAllowed('SB')).toBe(true);
    expect(action?.isAllowed('SI')).toBe(true);
    expect(action?.isAllowed('AC')).toBe(false);
  });

  it('should allow INACTIVATION action for PI, AC, PO, SI, and SP statuses', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.INACTIVATION
    );
    expect(action?.isAllowed('PI')).toBe(true);
    expect(action?.isAllowed('AC')).toBe(true);
    expect(action?.isAllowed('PO')).toBe(true);
    expect(action?.isAllowed('SI')).toBe(true);
    expect(action?.isAllowed('SP')).toBe(true);
    expect(action?.isAllowed('SE')).toBe(false);
  });

  it('should allow PHASE_OUT action for AC, IA, SI, and SP statuses', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.PHASE_OUT
    );
    expect(action?.isAllowed('AC')).toBe(true);
    expect(action?.isAllowed('IA')).toBe(true);
    expect(action?.isAllowed('SI')).toBe(true);
    expect(action?.isAllowed('SP')).toBe(true);
    expect(action?.isAllowed('PI')).toBe(false);
  });

  it('should allow SUBSTITUTION action for PI, AC, PO, IA, and SI statuses', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.SUBSTITUTION
    );
    expect(action?.isAllowed('PI')).toBe(true);
    expect(action?.isAllowed('AC')).toBe(true);
    expect(action?.isAllowed('PO')).toBe(true);
    expect(action?.isAllowed('IA')).toBe(true);
    expect(action?.isAllowed('SI')).toBe(true);
    expect(action?.isAllowed('SP')).toBe(false);
  });

  it('should allow REACTIVATION action for PI, PO, and IA statuses', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.REACTIVATION
    );
    expect(action?.isAllowed('PI')).toBe(true);
    expect(action?.isAllowed('PO')).toBe(true);
    expect(action?.isAllowed('IA')).toBe(true);
    expect(action?.isAllowed('AC')).toBe(false);
  });

  it('should allow SUBSTITUTION_REVERT action for SE status without Schaeffler successor', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.SUBSTITUTION_REVERT
    );
    expect(action?.isAllowed('SE', false)).toBe(true);
    expect(action?.isAllowed('SE', true)).toBe(false);
    expect(action?.isAllowed('AC')).toBe(false);
  });

  it('should allow SUBSTITUTION_TO_SCHAEFFLER action for SE status with Schaeffler successor', () => {
    const action = statusActions.find(
      (a) => a.name === CMPActionName.SUBSTITUTION_TO_SCHAEFFLER
    );
    expect(action?.isAllowed('SE', true)).toBe(true);
    expect(action?.isAllowed('SE', false)).toBe(false);
    expect(action?.isAllowed('AC')).toBe(false);
  });
});

describe('isInactictivationAllowed', () => {
  it('should return true for PI, AC, PO, SI, and SP statuses', () => {
    expect(isInactictivationAllowed('PI')).toBe(true);
    expect(isInactictivationAllowed('AC')).toBe(true);
    expect(isInactictivationAllowed('PO')).toBe(true);
    expect(isInactictivationAllowed('SI')).toBe(true);
    expect(isInactictivationAllowed('SP')).toBe(true);
    expect(isInactictivationAllowed('SE')).toBe(false);
  });
});

describe('isPhaseOutAllowed', () => {
  it('should return true for AC, IA, SI, and SP statuses', () => {
    expect(isPhaseOutAllowed('AC')).toBe(true);
    expect(isPhaseOutAllowed('IA')).toBe(true);
    expect(isPhaseOutAllowed('SI')).toBe(true);
    expect(isPhaseOutAllowed('SP')).toBe(true);
    expect(isPhaseOutAllowed('PI')).toBe(false);
  });
});

describe('isSubstitutionAllowed', () => {
  it('should return true for PI, AC, PO, IA, and SI statuses', () => {
    expect(isSubstitutionAllowed('PI')).toBe(true);
    expect(isSubstitutionAllowed('AC')).toBe(true);
    expect(isSubstitutionAllowed('PO')).toBe(true);
    expect(isSubstitutionAllowed('IA')).toBe(true);
    expect(isSubstitutionAllowed('SI')).toBe(true);
    expect(isSubstitutionAllowed('SP')).toBe(false);
  });
});

describe('isReactivationAllowed', () => {
  it('should return true for PI, PO, and IA statuses', () => {
    expect(isReactivationAllowed('PI')).toBe(true);
    expect(isReactivationAllowed('PO')).toBe(true);
    expect(isReactivationAllowed('IA')).toBe(true);
    expect(isReactivationAllowed('AC')).toBe(false);
  });
});

describe('isSubstitutionRevertAllowed', () => {
  it('should return true for SE status without Schaeffler successor', () => {
    expect(isSubstitutionRevertAllowed('SE', false)).toBe(true);
    expect(isSubstitutionRevertAllowed('SE', true)).toBe(false);
    expect(isSubstitutionRevertAllowed('AC')).toBe(false);
  });
});

describe('isSubstitutionChangeToSchaefflerAllowed', () => {
  it('should return true for SE status with Schaeffler successor', () => {
    expect(isSubstitutionChangeToSchaefflerAllowed('SE', true)).toBe(true);
    expect(isSubstitutionChangeToSchaefflerAllowed('SE', false)).toBe(false);
    expect(isSubstitutionChangeToSchaefflerAllowed('AC')).toBe(false);
  });
});

describe('isSubstitutionProposalAllowed', () => {
  it('should return true for SP, SB, and SI statuses', () => {
    expect(isSubstitutionProposalAllowed('SP')).toBe(true);
    expect(isSubstitutionProposalAllowed('SB')).toBe(true);
    expect(isSubstitutionProposalAllowed('SI')).toBe(true);
    expect(isSubstitutionProposalAllowed('AC')).toBe(false);
  });
});
