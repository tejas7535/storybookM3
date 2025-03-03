import {
  DataZoomComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts';

export const GRID_CONFIG: GridComponentOption = {
  left: '10px',
  right: '20px',
  top: '80px',
  containLabel: true,
};

export const DATA_ZOOM: DataZoomComponentOption[] = [
  {
    type: 'inside',
    xAxisIndex: [0],
  },
  {
    type: 'inside',
    yAxisIndex: [0],
  },
  {
    type: 'slider',
    xAxisIndex: [0],
    // filler color of selection brush
    fillerColor: 'rgba(67,152,175,0.1)',
    // background for selection data brush
    selectedDataBackground: {
      lineStyle: {
        color: '#4398af',
      },
      areaStyle: {
        color: 'rgba(67,152,175,0.87)',
      },
    },
    // background for whole data brush
    dataBackground: {
      lineStyle: {
        color: '#DEDEDE',
      },
      areaStyle: {
        color: '#F0F0F0',
      },
    },
    // border color whole background brush
    borderColor: 'rgba(0,0,0,0.2)',
    // top bar selection standard
    handleStyle: {
      color: '#ffffff',
      borderColor: 'rgba(0,0,0,0.2)',
    },
    moveHandleStyle: {
      color: 'rgba(67,152,175,0.2)',
      borderColor: 'rgba(0,0,0,0.2)',
    },
    // top bar selection on hover
    emphasis: {
      handleStyle: {
        color: '#ffffff',
        borderColor: '#4398af',
      },
      moveHandleStyle: {
        color: '#4398af',
        borderColor: '#4398af',
      },
    },
  },
];

export const LEGEND: LegendComponentOption = {
  align: 'left',
  selectorPosition: 'start',
  icon: 'square',
  orient: 'horizontal',
  left: 'left',
  itemGap: 48,
  top: 0,
};

export const TOOLTIP_CONFIG: TooltipComponentOption = {
  trigger: 'item',
  axisPointer: {
    type: 'cross',
  },
  borderColor: '#ced5da',
  borderWidth: 1,
  padding: 10,
};
