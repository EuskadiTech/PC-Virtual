const compra = function () {
    // Nota: La ruta /build/prices.html dirige
    //       a la compilación mas reciente de
    //       los precios.
    console.log("Busqueda iniciada...")
    fetch("https://tech.eus/build/prices.html")
        .then((req) => {
            console.log(req)
            console.log(req.text())
            new WinBox("Busqueda cruzada: Precios", {
                html: req.text(),
                template,
                class: ["window"],
                width: 300,
                height: 300,
                x: "center",
                y: "top"
            });
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
        y: "bottom"
    });
};
index();
