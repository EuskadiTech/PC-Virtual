const compra = function(file) {

  var r = file;
  const wwid = Annapurna.AppSDK.uuid();

  function refresh() {
    document.getElementById(wwid).innerHTML = "";
    Object.entries(r).forEach(el => {
      const key = el[0];
      const value = el[1];
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.innerText = key + ": " + value["sup"];
      a.href = value["url"];
      a.target = "_blank";
      li.append(a);
      document.getElementById(wwid).append(li);
    });
  }
  
  const precios = function() {
    // Programa para calcular los precios de productos en varias tiendas y seleccionar el URL del la tienda mas barata en cada producto.
    // Nota: La ruta /build/prices.html dirige
    //       a la compilación mas reciente de
    //       los precios.
    fetch("https://tech.eus/build/prices.html")
      .then(response => response.text())
      .then(text => {
        new WinBox("Calcular Precios", {
          html: "<small>Los precios se ordenan con el [numero de prioridad].</small>" +
            text,
          template,
          class: ["window", "fontpix"],
          width: 300,
          x: "center",
          height: 300,
          y: "center"
        });
        document.querySelectorAll(".sel_prod").forEach(el => {
          el.onclick = () => {
            r[el.dataset.key] = {
              url: el.dataset.url,
              sup: el.dataset.sup
            };
            refresh()
          };
        });
      });
  };
  const btn1 = Annapurna.AppSDK.UIKit.components.button({
    title: "Calcular Precios",
    onclick: precios
  });
  const btn2 = Annapurna.AppSDK.UIKit.components.button({
    title: "Guardar",
    onclick: () => {
      Annapurna.Kernel.files.save(FILE_PATH, JSON.stringify(r), () => {
        var w = new WinBox("Aviso", {
          html: "<h4>Compra guardada.</h4>",
          template,
          class: ["window", "fontpix"],
          width: 225,
          height: 75,
          x: "center",
          y: "center"
        });
        setTimeout(() => {w.close()}, 2500)
      })
    }
  });
  const div = document.createElement("div");
  div.className = "fh";
  const el = document.createElement("ul");
  el.id = wwid;
  el.className = "tree-view";
  div.append(btn1.dom, " ", btn2.dom, " ", el);
  new WinBox("Lista de la Compra", {
    mount: div,
    template,
    class: ["window", "fontpix"],
    width: 300,
    height: 300,
    x: "center",
    y: "center"
  });
  refresh()
};
const index = function() {
  const btn = Annapurna.AppSDK.UIKit.components.button({
    title: '<img src="https://win98icons.alexmeub.com/icons/png/printer-0.png"><br>Nueva compra',
    onclick: () => {
      FILE_PATH = prompt("Nombre de la compra") + ".txapela-compra"
      compra({})
    }
  });

  new WinBox("Txapela", {
    mount: btn.dom,
    template,
    class: ["window", "fontpix"],
    width: 300,
    height: 110,
    x: "center",
    y: "center"
  });
};
if (FILE_PATH == undefined) {
  index();
} else {
  var w = new WinBox("Abriendo compra...", {
    html: "<h4>Abriendo compra...</h4>",
    template,
    class: ["window", "fontpix"],
    width: 300,
    height: 150,
    x: "center",
    y: "center"
  });
  Annapurna.Kernel.files.open("json", FILE_PATH, (file) => {
    w.close()
    compra(file)
  })
}