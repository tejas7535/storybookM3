import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, configure } from '@storybook/angular';

addDecorator(withKnobs);
addDecorator(withA11y);

configure(require.context('../src/lib', true, /\.stories\.tsx?$/), module);
