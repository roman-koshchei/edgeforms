![Banner](./assets/banner.svg)

# EdgeForms

Forms all around the world.

```html
<form edge="key">
  <input placeholder="Your email" name="email" type="email" />
  <button type="submit">Join waitlist</button>
</form>
```

## Ways to submit

I want to support innovative ways to make form submitions as well as already stable ones.

### HTMX-like

This is innovative way. [HTMX](https://htmx.org/) become more and more popular tool with
it's philosofy: server just send html and swap it inside of DOM. Inspired by it, EdgeForms
will create similar library.

So when user submit form:

- page doesn't refresh.
- js send request to EdgeForms.
- EdgeForms proccess submition.
- and returns new html based on result of submition.

You can still style elements inside of form by just using selector:

```css
form[edge] input {
  padding: 1rem;
}
```

With tailwind:

```css
form[edge] input {
  @apply p-4;
}
```

The benefits:

- your form have validation on EdgeForms
- no redirects and page refeshes
- simple
- one source of truth
- more customizable validation

Downfalls:

- requires js
- need to copy form, so it's not empty at first render (may be optimized by compilation step or some cli tool)

### Good old way

Just submit forms in regular way with `action` and `method` on form. Html will look like this:

```html
<form ction="/simple/tsnc-lbyb-klyy-zk52" method="post">
  <input placeholder="Your email" name="email" type="email" />
  <button type="submit">Join waitlist</button>
</form>
```

It will redirect to page with status of submission (success or fail).

- less customizable
- redirects
- doesn't require js

### API

Regular API which will return JSON. It will allow get full control and easily integrate
with frameworks like React. Add small library to make calls to API more typesafe.

## Need

- Honeypot: hidden empty field, if not empty then it's bot.
