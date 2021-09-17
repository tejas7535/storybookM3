export const decorators = [];

export const parameters = {
  options: {
    storySort: {
      order: [
        'Material',
        ['Atoms', 'Molecules', 'Organisms'],
        'Components',
        '*',
        'WIP',
      ],
    },
    includeName: true,
  },
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
};
