import { CalendarComponentOption } from 'echarts';

export const CALENDAR_OPTIONS: CalendarComponentOption = {
  top: '10%',
  left: '10%',
  right: '10%',
  cellSize: ['auto', (window.innerHeight / 100) * 1.5],
  dayLabel: {
    firstDay: 1, // start on Monday,
    nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 20,
    color: '#000000e8',
  },
  itemStyle: {
    borderWidth: 2,
    color: '#DEDEDE',
    borderColor: 'WHITE',
  },
  splitLine: {
    lineStyle: {
      width: 2,
      color: '#00000061',
    },
  },
  monthLabel: { show: true },
  yearLabel: { show: false },
};
