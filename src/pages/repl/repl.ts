// eslint-disable-next-line import/no-named-as-default
import Component from './repl.seg';

const component = new Component({});

component.render(document.querySelector('#app') as HTMLElement);
