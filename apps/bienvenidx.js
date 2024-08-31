new WinBox("Bienvenidx", {
    template,
    html: `
        <section class="tabs fh overy-article">
  <menu role="tablist" aria-label="Sample Tabs">
    <button role="tab" aria-selected="true" aria-controls="tab-A">Primeros Pasos</button>
    <button role="tab" aria-controls="tab-B">Versión</button>
    <button role="tab" aria-controls="tab-C">Tab C</button>
  </menu>
  <!-- the tab content -->
  <article role="tabpanel" id="tab-A" class="fontpix">
    Sigue estos pasos para una buena experiencia con tu PC Virtual.
    <ol>
      <li>Activa este dispositivo</li>
    </ol>
  </article>
  <article role="tabpanel" hidden id="tab-B" class="fontpix">
    <h3>Versión del S.O.</h3>
    <div hx-get="/VERSION.html" hx-swap="InnerHTML" hx-trigger="load"></div>
    <button onclick="window.location.reload(true)">Recargar</button>
  </article>
  <article role="tabpanel" hidden id="tab-C" class="fontpix">
    <h3>Tab 3</h3>
    <p>Lorem Ipsum Dolor Sit</p>
  </article>
</section>
`,
    class: ["window", "fontpix"],
    width: 350,
    height: 400
});
FixTabs();
htmx.process(document.body)