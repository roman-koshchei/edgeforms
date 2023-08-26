import { html } from "hono/html"
import { Layout } from "."
import { Example } from "./example"

export function Landing(props: {
  email: { value?: string | null; error?: string; invalid?: boolean }
}) {
  return (
    <Layout>
      <main class="container">
        <hgroup>
          <h1>EdgeForms: forms all around the worlds</h1>
          <h2>
            Integrate forms into your website in minuts without pain in ass.
          </h2>
        </hgroup>
        <article style="padding:0">
          <Example />
        </article>

        <form method="post">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
          <small>
            {props.email.error ??
              "We'll never share your email with anyone else."}
          </small>
          <button type="submit">Join Waitlist</button>
        </form>

        {/* <a role="button" class="outline" href="/start">
          Start now
        </a> */}
      </main>
    </Layout>
  )
}

export function LandingSuccess() {
  return (
    <Layout>
      <main class="container">
        <hgroup>
          <h1>EdgeForms: forms all around the worlds</h1>
          <h2>
            Integrate forms into your website in minuts without pain in ass.
          </h2>
        </hgroup>
        <article style="padding:0">
          <Example />
        </article>

        <h3>
          <ins> Thanks for subscribing</ins>
        </h3>
      </main>
    </Layout>
  )
}

function edgeScript() {
  return html`<script>
    /** @param {SubmitEvent} event  */
    async function submit(event) {
      try {
        event.preventDefault()

        /** @type {HTMLFormElement | null} */
        const form = event.currentTarget
        if (form == null) return

        const id = form.getAttribute("edge")
        if (id == null || id.trim().length == 0) return

        const formData = new FormData(form)
        fetch("/html/" + id.trim(), { method: "POST", body: formData })
          .then((x) => x.text())
          .then((x) => (form.outerHTML = x))
          .catch((x) => (form.innerHTML = "AAAA"))
      } catch {
        return
      }
    }

    /**
     * @param {Node} node
     * @returns {boolean}
     */
    function isEdgeForm(node) {
      if (node.nodeType != Node.ELEMENT_NODE) return false
      if (node.nodeName != "FORM") return false
      if (!node.hasAttribute("edge")) return false
      return true
    }

    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length <= 0) continue

        for (const node of mutation.addedNodes) {
          if (!isEdgeForm(node)) continue
          node.addEventListener("submit", submit)
        }
      }
    })

    document.addEventListener("DOMContentLoaded", function () {
      const forms = document.querySelectorAll("form[edge]")
      for (let i = 0; i < forms.length; ++i) {
        const form = forms.item(i)
        form.addEventListener("submit", submit)
      }
      observer.observe(document.body, { childList: true, subtree: true })
    })
  </script>`
}
