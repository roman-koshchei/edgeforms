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
