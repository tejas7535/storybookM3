export interface BasicEvent {
  action: string;
}

export interface CalculationTypeChangeEvent extends BasicEvent {
  action: 'Toggle Method';
  status: 'on' | 'off';
  version: string;
  methods: Record<string, boolean>;
}

export interface CalculationEvent extends BasicEvent {
  action: 'Calculate';
  status: 'successful' | 'unsuccessful';
  message: 'successful' | string;
  version: string;
  methods: Record<string, boolean>;
  numberOfLoadcases: number;
}

export interface ShowReportEvent extends BasicEvent {
  action: 'Show Report';
}

export interface DownloadReportEvent extends BasicEvent {
  action: 'Download Report';
}

export interface LoadCaseEvent extends BasicEvent {
  action: 'Load Case Changed';
  event: 'Added' | 'Removed';
  numberOfLoadcases?: number;
}
