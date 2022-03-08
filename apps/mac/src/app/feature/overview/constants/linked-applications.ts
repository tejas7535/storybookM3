import { OverviewCard } from '../../../shared/components/overview-card/overview-card.model';

export const linkedApps: OverviewCard[] = [
  {
    image: '',
    icon: '../../../assets/img/wiam.svg',
    title: 'WIAM',
    description: 'Find properties of specified materials',
    link: 'https://wiamp.schaeffler.com:8443/rdc/raw',
    learnMoreLink:
      'https://sconnect.schaeffler.com/groups/schaeffler-material-database',
    disableImageHoverEffect: false,
    external: true,
    learnMoreExternal: true,
    inverted: true,
  },
  {
    image: '',
    icon: '../../../assets/img/carbonitriding_prediction.svg',
    title: 'Carbonitriding Prediction',
    description: 'Predict carbonitriding profiles based on furnace parameters',
    link: 'https://matlab-web-app:9988/webapps/home/session.html?app=Schaeffler%2FCarbonitriding_prediction',
    learnMoreLink:
      'https://sconnect.schaeffler.com/community/global-technology/rd-competence-services/corporate-materials/materials-technology/materials-development/blog/2021/03/10/simulation-tool-for-carbonitriding-heat-treatment',
    disableImageHoverEffect: false,
    external: true,
    learnMoreExternal: true,
    inverted: true,
  },
  {
    image: '',
    icon: '../../../assets/img/lifetime_documenter.svg',
    title: 'Lifetime Documenter',
    description: 'Document fatigue-testing parameters and results',
    link: 'http://spsp1.schaeffler.com/teamsite/8899',
    learnMoreLink: 'https://sconnect.schaeffler.com/docs/DOC-277276',
    disableImageHoverEffect: false,
    external: true,
    learnMoreExternal: true,
    inverted: true,
  },
  {
    image: '',
    icon: '../../../assets/img/polyassist.svg',
    title: 'Polyassist',
    description: 'Perform a strength assessment for fiber reinforced polymers',
    link: 'https://sconnect.schaeffler.com/groups/polyassist/',
    learnMoreLink: 'https://sconnect.schaeffler.com/groups/polyassist/',
    disableImageHoverEffect: false,
    external: true,
    learnMoreExternal: true,
    inverted: true,
  },
];
