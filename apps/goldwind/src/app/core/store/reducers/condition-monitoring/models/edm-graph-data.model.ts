export interface EdmGraphData {
  series: {
    data: {
      [index: number]: {
        value: [string, string];
      };
    };
  };
}
