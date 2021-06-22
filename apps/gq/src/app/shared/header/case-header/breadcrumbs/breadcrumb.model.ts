import {
  DetailViewQueryParams,
  ProcessCaseViewQueryParams,
} from '../../../../app-routing.module';

export class Breadcrumb {
  label: string;
  link?: string;
  queryParams?: ProcessCaseViewQueryParams | DetailViewQueryParams;
}
