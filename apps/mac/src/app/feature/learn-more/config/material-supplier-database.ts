import { LearnMoreData } from '../models';

export const materialSupplierDbLearnMoreData: LearnMoreData = {
  translocoKey: 'materialsupplierdb',
  imgUrl: '../../../assets/img/learnmore/msd/msd_background.png',
  darkenImg: false,
  svgIconUrl: '../../../assets/img/Materials_Supplier_Database.svg',
  requiredRoles: ['material-supplier-database-read-user'],
  samsLink:
    'https://schaefflerprod.service-now.com/sup?id=sc_cat_item&sys_id=19c1f2d9474a551034c874bd436d43ff&sysparm_category=69bbcbde1b22c014503297539b4bcba0',
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
    {
      title: 'linkgroup_materials',
      links: [
        {
          uri: 'linkgroup_materials_1_uri',
          name: 'linkgroup_materials_1_name',
        },
        {
          uri: 'linkgroup_materials_2_uri',
          name: 'linkgroup_materials_2_name',
        },
        {
          uri: 'linkgroup_materials_3_uri',
          name: 'linkgroup_materials_3_name',
        },
        {
          uri: 'linkgroup_materials_4_uri',
          name: 'linkgroup_materials_4_name',
        },
        {
          uri: 'linkgroup_materials_5_uri',
          name: 'linkgroup_materials_5_name',
        },
        {
          uri: 'linkgroup_materials_6_uri',
          name: 'linkgroup_materials_6_name',
        },
        {
          uri: 'linkgroup_materials_7_uri',
          name: 'linkgroup_materials_7_name',
        },
      ],
    },
    {
      title: 'linkgroup_materials2',
      links: [
        {
          uri: 'linkgroup_materials2_1_uri',
          name: 'linkgroup_materials2_1_name',
        },
        {
          uri: 'linkgroup_materials2_2_uri',
          name: 'linkgroup_materials2_2_name',
        },
        {
          uri: 'linkgroup_materials2_3_uri',
          name: 'linkgroup_materials2_3_name',
        },
        {
          uri: 'linkgroup_materials2_4_uri',
          name: 'linkgroup_materials2_4_name',
        },
        {
          uri: 'linkgroup_materials2_5_uri',
          name: 'linkgroup_materials2_5_name',
        },
      ],
    },
  ],
};
