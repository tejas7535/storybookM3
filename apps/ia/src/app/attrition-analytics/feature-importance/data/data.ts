import { FeatureImportance } from '../../models';
import { absenceDays } from './absence-days';
import { age } from './age';
import { businessArea2 } from './business-area2';
import { childrenNumber } from './children-number';
import { contractType } from './contract-type';
import { distance } from './distance';
import { education } from './education';
import { gender } from './gender';
import { jobCatelog } from './job-catelog';
import { mariage } from './mariage';
import { ohArea } from './oh-area';
import { paScore } from './pa-score';
import { personalGrowth } from './personal-growth';
import { position } from './position';
import { positionGrading } from './position-grading';
import { positionGrowth } from './position-growth';
import { psg } from './psg';
import { serviceLen } from './service-len';
import { subEntity } from './sub-entity';
import { workLocation } from './work-location';

export const featuresImportance: FeatureImportance[] = [
  gender,
  jobCatelog,
  workLocation,
  mariage,
  position,
  paScore,
  personalGrowth,
  distance,
  education,
  ohArea,
  subEntity,
  positionGrowth,
  psg,
  absenceDays,
  positionGrading,
  childrenNumber,
  serviceLen,
  businessArea2,
  contractType,
  age,
];
