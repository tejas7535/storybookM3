import { LearnMoreData } from '../models';

export const materialPropertiesEstimatorLearnMoreData: LearnMoreData = {
  translocoKey: 'materialPropertiesEstimator',
  imgUrl: '../../../assets/img/learnmore/def_background.png',
  darkenImg: false,
  svgIconUrl: '../../../assets/img/matp.svg',
  appLink:
    'https://matlab-web-app:9988/webapps/home/login.html?afterlogin=%2Fwebapps%2Fhome%2Fsession.html%3Fapp%3DSchaeffler%252FMaterialparameterestimation',
  guides: [],
  linkGroups: [
    {
      title: 'linkgroup1',
      links: [{ uri: 'linkgroup1_1_uri', name: 'linkgroup1_1_name' }],
    },
    {
      title: 'linkgroup2',
      links: [
        { uri: 'linkgroup2_1_uri', name: 'linkgroup2_1_name' },
        { uri: 'linkgroup2_2_uri', name: 'linkgroup2_2_name' },
      ],
    },
  ],
};
