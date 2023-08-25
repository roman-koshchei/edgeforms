import { Layout } from "."

// Creating user

// Verifing email
// Forgot password

// Page

export function StartPage() {
  return (
    <Layout>
      <main class="container">
        <h1>Start creating forms now</h1>
        <form>
          <label for="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            required
          />
          <small>We'll never share your email with anyone else.</small>

          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Secret password"
            required
          />
          <small>
            Don't forget your password, we don't know when "Forgot password"
            feature will be available.
          </small>

          <button type="submit">Start now</button>
        </form>
      </main>
    </Layout>
  )
}
