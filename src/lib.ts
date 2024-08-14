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

export const raw = `// packages/segify/src/client/lib.ts
// client/lib.mjs version: segify@0.0.0-beta.10
var $$cc = (t, a, c = []) => {
  a.children = c;
  const component = new t(a);
  const cs = component.$$components();
  component.$$events();
  return cs;
};
var $$ce = (t, a, c = []) => {
  if (typeof t !== "string")
    return $$cc(t, a, c);
  const component = document.createElement(t);
  for (const key in a) {
    if (Array.isArray(a[key])) {
      let [data, original] = a[key];
      console.log(data, original, $$DEV_PROPS);
      for (const att of data) {
        original = original.replace(att, $$DEV_PROPS[att]());
      }
      component.setAttribute(key, original);
    } else {
      component.setAttribute(key, a[key]);
    }
  }
  for (const child of c) {
    Array.isArray(child) && child.forEach((ct) => component.appendChild(ct));
    $$isElement(child) && component.appendChild(child);
  }
  return component;
};
var $$ct = (t) => document.createTextNode(t);
var $$cd = (t, s = true) => {
  const subscriber = document.createTextNode(t());
  s && $$subscribe.push([subscriber, t]);
  return subscriber;
};
function $$isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument || element instanceof Text;
}
window.$$$$ = {
  $$cc,
  $$ce,
  $$ct,
  $$cd,
  $$isElement
};

`;
