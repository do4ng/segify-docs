// @ts-ignore
import raw_lib from 'segify/client/lib.mjs';

/* eslint-disable camelcase */
export const example1 = '<div>Hello World!</div>';

/* eslint-disable camelcase */
export const example2 = `<script>let message = "Hello World"</script>
<div>{{@const message}}</div>
`;

export const example$ = `<script>
  $.count = 0;
  setInterval(() => {
    $.count += 1;
  }, 1000);
</script>
<p>{\{$.count}}</p>
`;

export const raw = raw_lib;
