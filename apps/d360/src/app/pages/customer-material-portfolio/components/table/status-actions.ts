import { PortfolioStatus } from '../../../../feature/customer-material-portfolio/cmp-modal-types';

export enum CMPSpecificModal {
  SINGLE_PHASE_IN = 'SINGLE_PHASE_IN',
  MULTI_PHASE_IN = 'MULTI_PHASE_IN',
  SINGLE_INACTIVATE = 'SINGLE_INACTIVATE',
  ACCEPT_FORECAST_LOSS = 'ACCEPT_FORECAST_LOSS',
  SUBSTITUTION_PROPOSAL = 'SUBSTITUTION_PROPOSAL',
  SCHAEFFLER_SUBSTITUTION = 'SCHAEFFLER_SUBSTITUTION',
}

export enum CMPChangeModalFlavor {
  EDIT_MODAL = 'EDIT_MODAL',
  STATUS_TO_PHASE_IN = 'STATUS_TO_PHASE_IN',
  STATUS_TO_PHASE_OUT = 'STATUS_TO_PHASE_OUT',
  STATUS_TO_SUBSTITUTION = 'STATUS_TO_SUBSTITUTION',
  STATUS_TO_ACTIVE = 'STATUS_TO_ACTIVE',
  STATUS_TO_INACTIVE = 'STATUS_TO_INACTIVE',
  REVERT_SUBSTITUTION = 'REVERT_SUBSTITUTION',
}

export type CMPModal = CMPSpecificModal | CMPChangeModalFlavor | null;

export enum CMPActionName {
  EDIT = 'EDIT',
  INACTIVATION = 'INACTIVATION',
  PHASE_OUT = 'PHASE-OUT',
  SUBSTITUTION = 'SUBSTITUTION',
  REACTIVATION = 'REACTIVATION',
  SUBSTITUTION_REVERT = 'SUBSTITUTION-REVERT',
  SUBSTITUTION_PROPOSAL = 'SUBSTITUTION_PROPOSAL',
  SUBSTITUTION_TO_SCHAEFFLER = 'SUBSTITUTION_TO_SCHAEFFLER',
}

export interface CMPAction {
  name: CMPActionName;
  modal: CMPModal;
  changeToStatus: PortfolioStatus | undefined;
  isAllowed: (
    status: PortfolioStatus | null,
    hasSchaefflerSuccessor?: boolean
  ) => boolean;
}

export const statusActions: CMPAction[] = [
  {
    name: CMPActionName.EDIT,
    modal: CMPChangeModalFlavor.EDIT_MODAL,
    changeToStatus: undefined,
    isAllowed: () => true,
  },
  {
    name: CMPActionName.SUBSTITUTION_PROPOSAL,
    modal: CMPSpecificModal.SUBSTITUTION_PROPOSAL,
    changeToStatus: undefined,
    isAllowed: isSubstitutionProposalAllowed,
  },
  {
    name: CMPActionName.INACTIVATION,
    modal: CMPChangeModalFlavor.STATUS_TO_INACTIVE,
    changeToStatus: 'IA',
    isAllowed: isInactictivationAllowed,
  },
  {
    name: CMPActionName.PHASE_OUT,
    modal: CMPChangeModalFlavor.STATUS_TO_PHASE_OUT,
    changeToStatus: 'PO',
    isAllowed: isPhaseOutAllowed,
  },
  {
    name: CMPActionName.SUBSTITUTION,
    modal: CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION,
    changeToStatus: 'SE',
    isAllowed: isSubstitutionAllowed,
  },
  {
    name: CMPActionName.REACTIVATION,
    modal: CMPChangeModalFlavor.STATUS_TO_ACTIVE,
    changeToStatus: 'AC',
    isAllowed: isReactivationAllowed,
  },
  {
    name: CMPActionName.SUBSTITUTION_REVERT,
    modal: CMPChangeModalFlavor.REVERT_SUBSTITUTION,
    changeToStatus: 'AC',
    isAllowed: isSubstitutionRevertAllowed,
  },
  {
    name: CMPActionName.SUBSTITUTION_TO_SCHAEFFLER,
    modal: CMPSpecificModal.SCHAEFFLER_SUBSTITUTION,
    changeToStatus: 'SI',
    isAllowed: isSubstitutionChangeToSchaefflerAllowed,
  },
];

export function isInactictivationAllowed(
  status: PortfolioStatus | null
): boolean {
  return (
    status === 'PI' ||
    status === 'AC' ||
    status === 'PO' ||
    status === 'SI' ||
    status === 'SP'
  );
}

export function isPhaseOutAllowed(status: PortfolioStatus | null): boolean {
  return (
    status === 'AC' || status === 'IA' || status === 'SI' || status === 'SP'
  );
}

export function isSubstitutionAllowed(status: PortfolioStatus | null): boolean {
  return (
    status === 'PI' ||
    status === 'AC' ||
    status === 'PO' ||
    status === 'IA' ||
    status === 'SI'
  );
}

export function isReactivationAllowed(status: PortfolioStatus | null): boolean {
  // From status SU (Substitution) to Active is reverting the substitution
  return status === 'PI' || status === 'PO' || status === 'IA';
}

export function isSubstitutionRevertAllowed(
  status: PortfolioStatus | null,
  hasSchaefflerSuccessor?: boolean
): boolean {
  return status === 'SE' && !hasSchaefflerSuccessor;
}

export function isSubstitutionChangeToSchaefflerAllowed(
  status: PortfolioStatus | null,
  hasSchaefflerSuccessor?: boolean
): boolean {
  return status === 'SE' && hasSchaefflerSuccessor;
}

export function isSubstitutionProposalAllowed(
  status: PortfolioStatus | null
): boolean {
  return status === 'SP' || status === 'SB' || status === 'SI';
}
