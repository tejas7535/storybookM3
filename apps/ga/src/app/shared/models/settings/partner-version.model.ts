export enum PartnerVersion {
  Schmeckthal = 'schmeckthal-gruppe',
}

export const PartnerAfiliateCode: { [key in PartnerVersion]?: string } = {
  [PartnerVersion.Schmeckthal]: 'affiliateid=A100101248',
};
