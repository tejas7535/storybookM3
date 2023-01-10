import { LearnMoreData } from '../models';

export const aqmCalculatorLearnMoreData: LearnMoreData = {
  translocoKey: 'aqmCalculator',
  imgUrl: '../../../assets/img/learnmore/aqm/background.png',
  darkenImg: true,
  svgIconUrl: '../../../assets/img/aqm_calculator.svg',
  appLink: '/aqm-calculator',
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
      ],
    },
  ],
};
