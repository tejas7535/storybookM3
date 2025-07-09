export enum PartnerVersion {
  Schmeckthal = 'schmeckthal-gruppe',
}

export const PartnerAffiliateCode: { [key in PartnerVersion]?: string } = {
  [PartnerVersion.Schmeckthal]: 'affiliateid=A100101248',
};
