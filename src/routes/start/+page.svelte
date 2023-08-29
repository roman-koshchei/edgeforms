<script lang="ts">
  import type { ActionData } from "./$types"

  export let form: ActionData

  let email: string = ""
  let password: string = ""
</script>

<hgroup>
  <h1>Start creating forms now</h1>
  <h2>By using EdgeForms you agree with Tearms of Service.</h2>
</hgroup>

{#if form != null}
  <p>
    <mark>{form.error}</mark>
  </p>
{/if}

<form method="post">
  <label for="email">Email address</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="Email address"
    value={email}
    required
  />
  <small>We'll never share your email with anyone else. </small>

  <label for="password">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    placeholder="Secret password"
    value={password}
    required
  />
  <small>
    Don't forget your password, we don't know when 'Forgot password' feature
    will be available.
  </small>

  <button type="submit">Start now</button>
</form>
