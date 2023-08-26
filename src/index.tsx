import { Hono } from "hono"
import { Landing, LandingSuccess } from "./frontend/landing"
import { formInput } from "./lib"
import { emailSchema } from "./frontend/auth"

const app = new Hono()

app.get("/", (c) => c.html(<Landing email={{}} />))
app.post("/", async (c) => {
  const form = await c.req.formData()
  const email = await formInput(form, "email", emailSchema)

  if (email.error == undefined) {
    return c.html(<LandingSuccess />)
  }

  return c.html(
    <Landing
      email={{
        value: email.value,
        error: email.error,
        invalid: true,
      }}
    />
  )
})

// app.get("/start", (c) => c.html(<StartPage email={{}} password={{}} />))

// app.post("/start", async (c) => {
//   const form = await c.req.formData()

//   const emailInput = await formInput(form, "email", emailSchema)
//   const passwordInput = await formInput(form, "password", passwordSchema)

//   if (!emailInput.error && !passwordInput.error) return c.redirect("/")

//   return c.html(
//     <StartPage
//       email={{
//         value: emailInput.value,
//         error: emailInput.error,
//         invalid: emailInput.error != undefined,
//       }}
//       password={{
//         value: passwordInput.value,
//         error: passwordInput.error,
//         invalid: passwordInput.error != undefined,
//       }}
//     />
//   )
// })

/*

- check rate limits
- find form by id and permissions
- get form fields and files
- check files size
- upload files to storage
- add submission to db
- send email if permission
- return redirect to page (saccess/fail)

*/
// app.post("/simple/:id", async (c) => {
//   try {
//     const { id } = c.req.param()
//     const dbForm = forms.find((x) => x.id == id)
//     if (dbForm == null) return c.status(404) // ?

//     const form = await c.req.formData()

//     const { fields, files } = formFormat(form)
//     fields.forEach((x) => console.log(`${x.key}: '${x.values}'`))

//     return c.redirect("/success")
//   } catch {
//     return c.redirect("/failure")
//   }
// })

// app.post("/html/:id", async (c) => {
//   try {
//     const { id } = c.req.param()
//     const dbForm = forms.find((x) => x.id == id)
//     if (dbForm == null) return c.status(404) // ?

//     const form = await c.req.formData()

//     const { fields, files } = formFormat(form)
//     fields.forEach((x) => {
//       console.log(`${x.key}: '${x.values}'`)
//     })

//     return c.html(
//       <form edge={id}>
//         <input type="text" name="name" placeholder="name" />
//         <button type="submit">Stsrctrsend</button>
//       </form>
//     )
//   } catch {
//     return c.html(<div>Failure</div>)
//   }
// })

// app.get("/success", (c) => {
//   const back = c.req.header("referer")
//   return c.html(
//     <Layout>
//       <body
//         class="container"
//         style="height:90vh;overflow:hidden; display: flex;justify-content: center;align-items: center;"
//       >
//         <main style="width:100%;max-width:40rem;">
//           <article>
//             <h1>Thanks for submition</h1>

//             {back ? (
//               <a role="button" style="display:block;" href={back}>
//                 Back
//               </a>
//             ) : (
//               <button
//                 style="margin:0rem;"
//                 onclick="if(document.referrer){window.location=document.referrer;}else{window.history.go(-1)}"
//               >
//                 Back
//               </button>
//             )}
//           </article>
//           <p>
//             Form is powered by <a href="/">EdgeForms</a>
//           </p>
//         </main>
//       </body>
//     </Layout>
//   )
// })

// app.get("/failure", (c) => {
//   const back = c.req.header("referer")

//   return c.html(
//     <Layout>
//       <body>
//         <h1>Form submision failed</h1>
//         {back ? (
//           <a href={back}>Back</a>
//         ) : (
//           <button onclick="if(document.referrer){window.location=document.referrer;}else{window.history.go(-1)}">
//             Back
//           </button>
//         )}
//       </body>
//     </Layout>,
//     500
//   )
// })

export default app
