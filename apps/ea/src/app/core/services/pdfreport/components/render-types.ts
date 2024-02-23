import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import { CalculationResultReportInput } from '@ea/core/store/models';
import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import { Notices, ResultBlock } from '../data';
import { renderCalculationMethods } from './calculation-methods';
import { renderNotices } from './calculation-notices';
import { renderInputTable } from './input-table';
import { renderResultGrid } from './result-grid';
import { renderUpstream } from './upstream-result';

export type LayoutBlocks =
  | 'inputs'
  | 'resultgrid'
  | 'upstream'
  | 'notices'
  | 'methods';

export interface LayoutConstraints {
  pageMargin: number;

  /**
   * Offset from the top/bottom edge of the document. Page margin is not included,
   * used to reserve space for the header, should be set accordingly to ensure the header always has space
   **/
  offsetTop: number;
  offsetBottom: number;
}

export interface LayoutBlock<T> {
  data: T;
  maxHeight?: number;
  yStart: number;
  heading?: string;
  dryRun: boolean;
  type: LayoutBlocks;
  constraints: LayoutConstraints;
  blockProps?: { [key: string]: number | string };
}

interface CantFitEvaluationResult {
  canFit: false;
}

interface ValidEvaluationResult {
  canFit: true;
  verticalShift: number;
}

export type LayoutEvaluationResult<T> = { data: T } & (
  | CantFitEvaluationResult
  | ValidEvaluationResult
);

export type ReportRenderFn<T> = (
  doc: jsPDF,
  block: LayoutBlock<T>
) => LayoutEvaluationResult<T>[];

export interface ReportRenderers {
  inputs: ReportRenderFn<CalculationResultReportInput[]>;
  resultgrid: ReportRenderFn<ResultBlock<ResultReportLargeItem[]>>;
  upstream: ReportRenderFn<ResultBlock<ResultReportLargeItem>>;
  notices: ReportRenderFn<ResultBlock<Notices>>;
  methods: ReportRenderFn<string[]>;
}

export const renderers: Partial<ReportRenderers> = {
  upstream: renderUpstream,
  methods: renderCalculationMethods,
  notices: renderNotices,
  inputs: renderInputTable,
  resultgrid: renderResultGrid,
};
