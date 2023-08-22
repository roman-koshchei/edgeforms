# Edge package

EdgeForms provide `edge` package for HTMX-like interaction with forms.
Start in few steps:

## Link js to html

Will be changed when minification will be set up.

Download package and link as local file:

```html
<link rel="stylesheet" href="/js/edge.js" />
```

Using CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@edgeforms/edge/index.js" />
```

Install with npm:

```bash
npm install @edgeforms/edge
```

And then add forms in html like that:

```html
<form edge="{id}">
  <input type="email" name="email" placeholder="Email" />
  <button type="submit">Join Waitlist</button>
</form>
```
