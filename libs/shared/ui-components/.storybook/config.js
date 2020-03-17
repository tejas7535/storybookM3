import { configure, addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withKnobs);
addDecorator(withA11y);

configure(require.context('../src/lib', true, /\.stories\.tsx?$/), module);
