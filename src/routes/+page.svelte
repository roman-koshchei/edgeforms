<script>
  import Example from "$lib/components/Example.svelte"
</script>

<hgroup>
  <h1>EdgeForms: forms all around the worlds</h1>
  <h2>Integrate forms into your website in minuts without pain in ass.</h2>
</hgroup>

<article style="padding:0;background-color:white;">
  <Example />
</article>

<form method="post">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="Email" required />
  <small>
    <!-- {props.email.error ?? "We'll never share your email with anyone else."} -->
  </small>
  <button type="submit">Join Waitlist</button>
</form>

<a role="button" class=" outline" style="display: block;" href="/start"
  >Start right now!</a
>
