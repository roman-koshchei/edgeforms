export function TestForm() {
  return (
    <form action={`/form/tsnc-lbyb-klyy-zk52`} method="post">
      <label for="text">Text Input:</label>
      <div class="grid" style="grid-template-columns: 1fr;" id="texts">
        <input type="text" id="text" name="text" value="Text" required />
      </div>

      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value="How to validate?"
      />

      <label for="textarea">Textarea:</label>
      <textarea id="textarea" name="textarea" rows="4" cols="50">
        Long text
      </textarea>

      <fieldset>
        <label>Radio Buttons:</label>
        <input type="radio" id="cat" name="radio" value="cat" checked />
        <label for="cat">Cat Option</label>
        <input type="radio" id="dog" name="radio" value="dog" />
        <label for="dog">Dog Option</label>
      </fieldset>

      <fieldset>
        <label>Checkboxes:</label>
        <input
          type="checkbox"
          id="money"
          name="checkbox"
          value="money"
          checked
        />
        <label for="money">Money Option</label>
        <input type="checkbox" id="time" name="checkbox" value="time" checked />
        <label for="time">Time Option</label>
      </fieldset>

      <label for="dropdown">Dropdown List:</label>
      <select id="dropdown" name="dropdown">
        <option value="male">Male Option</option>
        <option value="female">Female Option</option>
      </select>

      <label for="dropdowns">Multiple Dropdown:</label>
      <select id="dropdowns" name="dropdowns" multiple>
        <option value="cloudflare" selected>
          Cloudflare Option
        </option>
        <option value="typescript" selected>
          TypeScript Option
        </option>
        <option value="hono" selected>
          Hono Option
        </option>
        <option value="htmx">HTMX Option</option>
      </select>
      <label for="file">File Upload:</label>
      <input type="file" id="file" name="file" />

      <label for="files">Multiple Files:</label>
      <input type="file" id="files" name="files" multiple />

      <label for="date">Date Input:</label>
      <input type="date" id="date" name="date" value="2023-08-18" />

      <label for="time">Time Input:</label>
      <input type="time" id="time" name="time" value="11:24" />

      <label for="datetime">Date and time Input:</label>
      <input type="datetime-local" id="datetime" name="datetime" />

      <label for="number">Number Input:</label>
      <input
        type="number"
        id="number"
        name="number"
        value="10"
        min="1"
        max="10"
      />

      <label for="email">Email Input:</label>
      <input type="email" id="email" name="email" value="roman@flurium.com" />

      <label for="url">URL Input:</label>
      <input type="url" id="url" name="url" value="https://flurium.com" />

      <label for="color">Color Picker:</label>
      <input type="color" id="color" name="color" value="#3949ab" />

      <label for="range">Range Input:</label>
      <input
        type="range"
        id="range"
        name="range"
        min="0"
        max="100"
        step="5"
        value="10"
      />

      <input type="hidden" name="honeypot" />

      <input type="submit" value="Submit" />
    </form>
  )
}
