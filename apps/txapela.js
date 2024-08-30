const compra = function () {
    var r = {};
    const wwid = Annapurna.AppSDK.uuid();
    const precios = function () {
        // Programa para calcular los precios de productos en varias tiendas y seleccionar el URL del la tienda mas barata en cada producto.
        // Nota: La ruta /build/prices.html dirige
        //       a la compilación mas reciente de
        //       los precios.
        fetch("https://tech.eus/build/prices.html")
            .then(response => response.text())
            .then(text => {
                new WinBox("Calcular Precios", {
                    html:
                        "Los precios se ordenan con el [numero de prioridad]." +
                        text,
                    template,
                    class: ["window"],
                    width: 300,
                    x: "left",
                    height: 300,
                    y: "center"
                });
                document.querySelectorAll(".sel_prod").forEach(el => {
                    el.onclick = () => {
                        r[el.dataset.key] = {
                            url: el.dataset.url,
                            sup: el.dataset.sup
                        };
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
                    };
                });
            });
    };
    const btn1 = Annapurna.AppSDK.UIKit.components.button({
        title: "Calcular Precios",
        onclick: precios
    });
    const div = document.createElement("div");
    div.className = "fh";
    const el = document.createElement("ul");
    el.id = wwid;
    el.className = "tree-view";
    div.append(btn1.dom, " ", btn1.dom, " ", el);
    new WinBox("Lista de la Compra", {
        mount: div,
        template,
        class: ["window"],
        width: 300,
        height: 300,
        x: "right",
        y: "center"
    });
};
const index = function () {
    const btn = Annapurna.AppSDK.UIKit.components.button({
        title: '<img src="https://win98icons.alexmeub.com/icons/png/printer-0.png"><br>Compras',
        onclick: compra
    });

    new WinBox("Txapela", {
        mount: btn.dom,
        template,
        class: ["window"],
        width: 300,
        height: 110,
        x: "center",
        y: "top"
    });
};
index();
