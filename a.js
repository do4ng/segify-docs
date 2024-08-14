import { a as f } from './4SWTF2WY.mjs';
function x(i) {
  return /^\p{Lu}/u.test(i);
}
var l = class {
  type;
  tag;
  attributes;
  children;
  text = null;
  value = null;
  position = { start: -1, end: -1 };
  raw;
  constructor({ type: n, tag: e, attributes: t, children: s, text: o }) {
    (this.type = n),
      (this.tag = e),
      (this.attributes = t || {}),
      (this.children = s || []),
      (this.text = o || null),
      (this.value = null);
  }
  appendChild(n) {
    return (
      n.type === 'text'
        ? n.text.replace(/\n/g, '').replace(/\r/g, '').trim() !== '' &&
          this.children.push(n)
        : this.children.push(n),
      this
    );
  }
  removeChild(n) {
    return this.children.filter((e) => e !== n);
  }
};
function y(i) {
  (i = i.slice(1, -1).trim()), i[i.length - 1] === '/' && (i = i.slice(0, -1));
  let n = i.split(' '),
    e = { tagName: '', attributes: {} };
  (e.tagName = n.shift().replace(
    `
  `,
    ''
  )),
    (i = n.join(' '));
  let t = 0,
    s = { opened: !1, start: null },
    o = !1,
    a = '',
    c = null;
  for (; t < i.length; ) {
    let r = i[t];
    if (s.opened) {
      if (r === s.start) {
        (e.attributes[c] = a), (s.opened = !1), (o = !1), (t += 1), (a = '');
        continue;
      }
      if (r === '$') throw new Error('Attribute value type must be "string" or "data".');
      (a += r), (t += 1);
      continue;
    }
    if (!s.opened && ['"', "'"].includes(r)) {
      if (a !== '' && a !== null) throw new Error(`parse error - ${i.slice(t - 5)} <`);
      (o = !1), (s.opened = !0), (s.start = r), (t += 1);
      continue;
    }
    if (r === ' ') {
      (o = !0), (t += 1);
      continue;
    }
    if (r === '=') {
      (o = !1), (c = a), (a = ''), (t += 1);
      continue;
    }
    if (o) {
      a !== '' && (e.attributes[a] = !0), (o = !1), (a = r), (t += 1);
      continue;
    }
    (t += 1), (a += r);
  }
  a.trim() !== '' && a.trim() !== null && (e.attributes[a] = !0);
  for (let r in e.attributes) {
    let m = e.attributes[r];
    r.startsWith('$') &&
      (e.attributes.$ || (e.attributes.$ = {}),
      (e.attributes.$[r] = m),
      delete e.attributes[r]);
  }
  return e;
}
function w(i = '') {
  let n = /\{\{\s*((?:\{[^{}]*\}|[^{}])*)\s*\}\}/g,
    e = 0,
    t = [];
  return (i = i.replace(n, (s) => (t.push(s), `$${e++}$`))), { code: i, data: t };
}
var p = class i {
  code;
  options;
  stats;
  result;
  constructor(n, e) {
    (this.code = n),
      (this.options = e || {}),
      (this.result = [new l({ type: 'fragment' })]),
      (this.stats = {
        current: 0,
        parent: this.result[0],
        element: null,
        selected: '',
        status: null,
        start: -1,
        end: -1,
        dataTagStatus: { stringOpened: !1, stringOpenStr: null },
        dataAllowed: !0,
      });
  }
  next(n = 1) {
    this.stats.current += n;
  }
  willBe(n) {
    return this.code.slice(this.stats.current).startsWith(n);
  }
  reset() {
    this.stats = {
      ...this.stats,
      element: null,
      selected: '',
      status: null,
      dataTagStatus: { stringOpened: !1, stringOpenStr: null },
    };
  }
  addChild() {
    (this.stats.element.text = this.stats.selected),
      this.stats.parent.appendChild(this.stats.element);
  }
  until(n, e = {}) {
    let t = Object.keys(e),
      s = Object.values(e),
      o = { start: this.stats.current, end: -1, text: null },
      a = { opened: !1, start: null };
    for (; this.stats.current < this.code.length; ) {
      let c = this.code[this.stats.current];
      if (!a.opened && t.includes(c)) {
        (a.opened = !0), (a.start = t.indexOf(c)), this.next();
        continue;
      }
      if (a.opened && s[a.start] === c) {
        (a.opened = !1), this.next();
        continue;
      }
      if (!a.opened && c === n)
        return (
          (o.end = this.stats.current), (o.text = this.code.slice(o.start, o.end + 1)), o
        );
      this.next();
    }
    return o;
  }
  parse() {
    for (; this.stats.current < this.code.length; ) {
      let n = this.code[this.stats.current];
      if (this.stats.status === 'comment' && this.willBe('-->')) {
        this.options.keepComment && this.addChild(), this.reset(), this.next(3);
        continue;
      }
      if (this.stats.status === null && this.willBe('<!--')) {
        (this.stats.status = 'comment'),
          (this.stats.element = new l({ type: 'comment' })),
          this.next(4);
        continue;
      }
      if (this.stats.status === 'comment') {
        this.options.keepComment && (this.stats.selected += n), this.next();
        continue;
      }
      if (n === '$') {
        if (this.stats.selected) {
          let s = new l({ type: 'text' });
          (s.text = this.stats.selected), this.stats.parent.appendChild(s), this.reset();
        }
        this.next();
        let e = this.until('$'),
          t = new l({ type: 'data' });
        (t.value = this.code.slice(e.start - 1, e.end + 1)),
          this.stats.parent.appendChild(t),
          this.reset(),
          (this.stats.current = e.end + 1);
        continue;
      }
      if (n === '<' && !this.willBe('</')) {
        if (this.stats.selected) {
          let s = new l({ type: 'text' });
          (s.text = this.stats.selected), this.stats.parent.appendChild(s), this.reset();
        }
        let e = this.until('>', { '"': '"', "'": "'" }),
          t = y(e.text);
        if (t.tagName === 'script' || t.tagName === 'style') {
          for (
            this.stats.start = this.stats.current,
              this.stats.dataAllowed = !1,
              this.stats.element = new l({
                type: 'element',
                tag: t.tagName,
                attributes: t.attributes || {},
              });
            this.stats.current < this.code.length &&
            (this.until('<', { '"': '"', "'": "'", '`': '`' }),
            this.code[this.stats.current + 1] !== '/');

          )
            this.next();
          (this.stats.element.position = {
            start: this.stats.start,
            end: this.stats.current - 1,
          }),
            (this.stats.end = this.stats.current),
            (this.stats.element.raw = this.code.slice(
              this.stats.start + 1,
              this.stats.end
            )),
            this.stats.parent.appendChild(this.stats.element),
            this.until('>', { '"': '"', "'": "'" }),
            this.next(),
            this.reset();
          continue;
        }
        if (
          ((this.stats.element = new l({
            type: 'element',
            tag: t.tagName,
            attributes: t.attributes || {},
          })),
          (this.stats.start = this.stats.current),
          this.code[e.end - 1] !== '/')
        ) {
          let s = new i(this.code, this.options);
          (s.stats.current = this.stats.current + 1),
            (s.stats.parent = this.stats.element);
          let o = s.parse();
          (this.stats.element = o.parent),
            (this.stats.current = o.current + 1),
            (this.stats.end = this.stats.current);
        } else this.stats.current += 1;
        (this.stats.element.position = {
          start: this.stats.start,
          end: this.stats.current - 1,
        }),
          (this.stats.element.raw = this.code.slice(
            this.stats.start + 1,
            this.stats.end - t.tagName.length - 3
          )),
          this.stats.parent.appendChild(this.stats.element),
          this.reset();
        continue;
      } else if (this.willBe('</')) {
        if (this.stats.selected) {
          let e = this.stats.element || new l({ type: 'text' });
          (e.text = this.stats.selected), this.stats.parent.appendChild(e), this.reset();
        }
        return this.until('>'), this.stats;
      }
      (this.stats.selected += n), this.next();
    }
    if (this.stats.selected.trim() !== '') {
      let n = this.stats.element || new l({ type: 'text' });
      (n.text = this.stats.selected), this.stats.parent.appendChild(n);
    }
    return this.stats;
  }
};
function E(i, n) {
  let { code: e, data: t } = w(i),
    s = new p(e, n);
  return s.parse(), { ast: s.stats.parent, data: t };
}
import { existsSync as v, readFileSync as g } from 'fs';
import { join as h } from 'path';
import { createRequire as O } from 'node:module';
import { dirname as j } from 'node:path';
import { fileURLToPath as S } from 'node:url';
var T = () => {
  if (global.segify_asset_raw) return global.segify_asset_raw;
  if (global.segify_asset) return g(global.segify_asset).toString();
  let i = j(S(import.meta.url)),
    n = O(import.meta.url);
  if (v(h(i, '../client/lib.js'))) return g(h(i, '../client/lib.js')).toString();
  try {
    if (v(h(n.resolve('segify'), './client/lib.js')))
      return g(h(n.resolve('segify'), '../client/lib.js')).toString();
  } catch {}
  throw new Error('Cannot find asset');
};
var $ = (...i) => `$$ce(${i.join(',')})`,
  L = (...i) => `$$ct(${i.join(',')})`,
  P = (...i) => `$$cd(${i.join(',')})`,
  b = (i) => (console.log(i, p), x(i) ? i : JSON.stringify(i));
function d(i, n) {
  let e = [];
  for (let t of i)
    if (t.type === 'text') e.push(L(JSON.stringify(t.text)));
    else if (t.type === 'element') {
      console.log(t);
      if (t.attributes.$) {
        let s = t.attributes.$;
        delete t.attributes.$,
          s &&
            (s.$mount &&
              e.push(
                `(${s.$mount}=${$(
                  b(t.tag),
                  JSON.stringify(t.attributes),
                  `[${d(t.children || [], n)[0].join(',')}]`
                )})`
              ),
            s.$onmount && e.push(`(${s.$onmount}(${s.$mount || ''}))`),
            s.$onclick &&
              e.push(
                `($$events.push(["click", ${$(
                  b(t.tag),
                  JSON.stringify(t.attributes),
                  `[${d(t.children || [], n)[0].join(',')}]`
                )},${s.$onclick}]) && $$events[$$events.length - 1][1])`
              ));
      } else
        e.push(
          $(
            b(t.tag),
            JSON.stringify(t.attributes),
            `[${d(t.children || [], n)[0].join(',')}]`
          )
        );
    } else {
      let s = t.value.slice(1, -1);
      e.push(
        P(
          `$$DEV_PROPS[${JSON.stringify(t.value)}]`,
          n[s]?.trim().slice(2, -2).trim().split(' ')[0] !== '@const'
        )
      );
    }
  return [e, n];
}
function C(i, n) {
  if (((i = n(i)), i.children?.length !== 0)) for (let e of i.children || []) C(e, n);
}
async function et(i, n) {
  let { ast: e, data: t } = E(i, { keepComment: !1 }),
    s = [],
    o = { scripts: [], styles: [] },
    a = { scripts: [], styles: [] },
    [c] = d(e.children, t);
  if (
    (C(
      e,
      (r) => (
        r.type === 'element' && r.tag === 'script'
          ? (o.scripts.push([r.attributes.lang, r.raw || '']), (r.children = null))
          : r.type === 'element' &&
            r.tag === 'style' &&
            (o.styles.push([r.attributes.lang, r.raw || '']), (r.children = null)),
        r
      )
    ),
    n?.disableProcessor !== !0)
  ) {
    await import('./languages/index.mjs');
    for await (let r of o.scripts)
      a.scripts.push((await f('script', r[0] || 'js', r[1])).code);
    for await (let r of o.styles)
      a.styles.push((await f('style', r[0] || 'css', r[1])).code);
  }
  return (
    s.push(T()),
    s.push(`var $ = new Proxy(
      {__props__: {}},
      {
        set(target, prop, value, receiver) {
          target[prop] = value;
          for (const subscriber of $$subscribe) {
            const s = subscriber[0].nodeValue=subscriber[1]();
          }
          return true;
        },
      }
    );`),
    s.push('var $$subscribe=[];'),
    s.push('var $$events=[];'),
    s.push('/*scripts*/'),
    s.push(
      a.scripts.join(`
  `)
    ),
    s.push(`var $$DEV_PROPS={
    ${t.map(
      (r, m) =>
        `"$${m}$":()=>(${(() => {
          let u = r.trim().slice(2, -2);
          return (
            u?.trim().split(' ')[0] === '@const' && (u = u.trim().split(' ').slice(1)), u
          );
        })()})`
    ).join(`,
    `)}
  }`),
    s.push(`class Component {
    constructor(props) {
      for (const prop of Object.keys(props)) {
        $[prop] = props[prop];
      }
    }
  
    $$components() {
      return [${c.join(',')}];
    }
  
    $$stylesheet() {
      var stylesheet = document.createElement('style');
      stylesheet.innerHTML = ${JSON.stringify(
        a.styles.join('').replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
      )};
  
      return stylesheet;
    }
  
    render(root) {
      document.head.appendChild(this.$$stylesheet());
  
      for (const component of this.$$components()) {
        $$isElement(component)&&root.appendChild(component);
      }
  
    
      for (const evt of $$events) {
        evt[1].addEventListener(evt[0], evt[2])
      }
    }
  }`),
    n?.noExport !== !0 && s.push('export { Component, Component as default}'),
    s.join(`
  `)
  );
}
export {
  l as HTMLElement,
  p as Parser,
  et as compile,
  E as parse,
  y as parseTag,
  w as processBeforeParse,
};
