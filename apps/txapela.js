const compra = function () {
    const precios = function () {
        // Programa para calcular los precios de productos en varias tiendas y seleccionar el URL del la tienda mas barata en cada producto.
        // Nota: La ruta /build/prices.html dirige
        //       a la compilación mas reciente de
        //       los precios.
        fetch("https://tech.eus/build/prices.html")
            .then(response => response.text())
            .then(text => {
                new WinBox("Calcular Precios", {
                    html: text,
                    template,
                    class: ["window"],
                    width: 300,
                    x: "center",
                    height: 300,
                    y: "center"
                });
            });
    };
    const btn1 = Annapurna.AppSDK.UIKit.components.button({
        title: "Calcular Precios",
        onclick: precios
    });
    const div = document.createElement("div");
    div.append(btn1.dom, " ", btn1.dom);
    new WinBox("Compras", {
        mount: div,
        template,
        class: ["window"],
        width: 300,
        height: 180,
        x: "center",
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
