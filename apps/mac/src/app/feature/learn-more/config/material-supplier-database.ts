import { LearnMoreData } from '../models';

export const materialSupplierDbLearnMoreData: LearnMoreData = {
  translocoKey: 'materialsupplierdb',
  imgUrl: '../../../assets/img/learnmore/msd/msd_background.png',
  darkenImg: false,
  svgIconUrl: '../../../assets/img/Materials_Supplier_Database.svg',
  requiredRoles: ['material-supplier-database-read-user'],
  samsLink:
    'https://schaefflerprod.service-now.com/sup?id=sc_cat_item&sys_id=ed6a579fdb780410fa8c40a505961911&sysparm_category=69bbcbde1b22c014503297539b4bcba0',
  appLink: '../materials-supplier-database',
  guides: [],
  linkGroups: [
    {
      title: 'linkgroup1',
      links: [
        { uri: 'linkgroup1_1_uri', name: 'linkgroup1_1_name' },
        { uri: 'linkgroup1_2_uri', name: 'linkgroup1_2_name' },
      ],
    },
    {
      title: 'linkgroup2',
      links: [
        { uri: 'linkgroup2_1_uri', name: 'linkgroup2_1_name' },
        { uri: 'linkgroup2_2_uri', name: 'linkgroup2_2_name' },
        { uri: 'linkgroup2_3_uri', name: 'linkgroup2_3_name' },
        { uri: 'linkgroup2_4_uri', name: 'linkgroup2_4_name' },
        { uri: 'linkgroup2_5_uri', name: 'linkgroup2_5_name' },
      ],
    },
  ],
};
