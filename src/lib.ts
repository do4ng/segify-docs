// @ts-ignore
import raw_lib from 'segify/client/lib.mjs';

/* eslint-disable camelcase */
export const example1 = '<div>Hello World!</div>';

/* eslint-disable camelcase */
export const example2 = `<script>let message = "Hello World"</script>
<div>{{@const message}}</div>
`;

export const example3 = `<script>
  function onClick() {
    alert("Button clicked!");
  }
</script>
<button $onclick="onClick">Click Me!</button>
`;
export const example4 = `<script>
  let mount = null;
  function onMount() {
    mount.innerHTML = "Hello World!";
  }
</script>
<div $mount="mount" $onmount="onMount"></div>
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
