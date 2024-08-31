new WinBox("Bienvenidx", {
    template,
    html: `
        <section class="tabs fh overy-article">
  <menu role="tablist" aria-label="Sample Tabs">
    <button role="tab" aria-selected="true" aria-controls="tab-A">Primeros Pasos</button>
    <button role="tab" aria-controls="tab-B">Axis</button>
    <button role="tab" aria-controls="tab-C">Tab C</button>
  </menu>
  <!-- the tab content -->
  <article role="tabpanel" id="tab-A" class="fontpix">
    Sigue estos pasos para una buena experiencia con tu PC Virtual.
    <ol>
      <li>Iniciar sesión (o crear una cuenta) en Axis</li>
    </ol>
  </article>
  <article role="tabpanel" hidden id="tab-B">
    <h3>More...</h3>
    <p>This tab contains a GroupBox</p>
    <fieldset>
      <legend>Today's mood</legend>
      <div class="field-row">
        <input id="radio10" type="radio" name="fieldset-example2">
        <label for="radio10">Claire Saffitz</label>
      </div>
      <div class="field-row">
        <input id="radio11" type="radio" name="fieldset-example2">
        <label for="radio11">Brad Leone</label>
      </div>
      <div class="field-row">
        <input id="radio12" type="radio" name="fieldset-example2">
        <label for="radio12">Chris Morocco</label>
      </div>
      <div class="field-row">
        <input id="radio13" type="radio" name="fieldset-example2">
        <label for="radio13">Carla Lalli Music</label>
      </div>
    </fieldset>
  </article>
  <article role="tabpanel" hidden id="tab-C">
    <h3>Tab 3</h3>
    <p>Lorem Ipsum Dolor Sit</p>
  </article>
</section>
`,
    class: ["window"],
    width: 300,
    height: 300
});
FixTabs();
