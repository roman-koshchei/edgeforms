import { errors } from "jose"
import { Layout } from "."

// Creating user

// Verifing email
// Forgot password

// Page

type FormInput = {
  value?: string | null
  error?: string
  invalid?: boolean
}

export function StartPage(props: { email: FormInput; password: FormInput }) {
  return (
    <Layout>
      <main class="container">
        <hgroup>
          <h1>Start creating forms now</h1>
          <h2>By using EdgeForms you agree with Tearms of Service.</h2>
        </hgroup>

        <form method="post">
          <label for="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            value={props.email.value}
            aria-invalid={props.email.invalid}
            required
          />
          <small>
            {props.email.error ??
              "We'll never share your email with anyone else."}
          </small>

          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Secret password"
            value={props.password.value}
            aria-invalid={props.password.invalid}
            required
          />
          <small>
            {props.password.error ??
              "Don't forget your password, we don't know when 'Forgot password' feature will be available."}
          </small>

          <button type="submit">Start now</button>
        </form>
      </main>
    </Layout>
  )
}
