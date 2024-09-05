const editCode = (val) => {
    var uid1 = Annapurna.AppSDK.uuid()
    var uid2 = Annapurna.AppSDK.uuid()
    var uid3 = Annapurna.AppSDK.uuid()
    new WinBox(FILE_PATH.split("/").pop() + " - Txapela", {
        template,
        html: `<button id="${uid2}">Guardar</button> <button id="${uid3}">Ejecutar</button><br><textarea id="${uid1}" rows="13" cols="43"></textarea>`,
        class: ["window", "fontpix"],
        width: 340,
        height: 310,
        x: "center",
        y: "center"
    });
    document.getElementById(uid1).value = val
    document.getElementById(uid2).onclick = () => {
        Annapurna.Kernel.files.save(FILE_PATH, document.getElementById(uid1).value, () => {
            var w = new WinBox("Aviso", {
                html: "<h4>Programa guardado.</h4>",
                template,
                class: ["window", "fontpix"],
                width: 225,
                height: 96,
                x: "center",
                y: "center"
            });
            setTimeout(() => { w.close() }, 2500)
        })
    }
    document.getElementById(uid3).onclick = () => {
        Function(document.getElementById(uid1).value)(FILE_PATH = undefined, CUSTOM_ARGS=undefined);
    }
}
const compra = function (file) {

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

    const precios = function () {
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
                    height: 96,
                    x: "center",
                    y: "center"
                });
                setTimeout(() => { w.close() }, 2500)
            })
        }
    });
    const div = document.createElement("div");
    div.className = "fh";
    const el = document.createElement("ul");
    el.id = wwid;
    el.className = "tree-view";
    div.append(btn1.dom, " ", btn2.dom, " ", el);
    new WinBox(FILE_PATH.split("/").pop() + " - Txapela", {
        mount: div,
        template,
        class: ["window", "fontpix"],
        width: 400,
        height: 300,
        x: "center",
        y: "center"
    });
    refresh()
};
const index = function () {
    const btn_code = Annapurna.AppSDK.UIKit.components.button({
        title: '<img src="https://win98icons.alexmeub.com/icons/png/executable-0.png" height="48"><br>Nuevo programa',
        onclick: () => {
            Annapurna.DesktopEnv.prompt(
                (fname) => {
                    if (fname != false) {
                        FILE_PATH = "Programas/" + fname + ".js"
                        editCode("")
                    }
                }, "Nombre del programa")
        }
    });
    const btn_compra = Annapurna.AppSDK.UIKit.components.button({
        title: '<img src="https://win98icons.alexmeub.com/icons/png/printer-0.png" height="48"><br>Nueva compra',
        onclick: () => {
            Annapurna.DesktopEnv.prompt(
                (fname) => {
                    if (fname != false) {
                        FILE_PATH = "Documentos/Compras/" + fname + ".txa_c"
                        compra({})
                    }
                }, "Nombre de la compra")
        }
    });
    var div = document.createElement("div")
    div.append(btn_compra.dom, " ", btn_code.dom)
    new WinBox("Txapela", {
        mount: div,
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
} else if (CUSTOM_ARGS == "new") {
    compra({})
} else {
    var ext = FILE_PATH.split(".").pop()
    switch (ext) {
        case "txa_c":
        case "txapela-compra":
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
            break;
    
        case "txa_p":
        case "js":
            var w = new WinBox("Abriendo programa...", {
                html: "<h4>Abriendo programa...</h4>",
                template,
                class: ["window", "fontpix"],
                width: 300,
                height: 150,
                x: "center",
                y: "center"
            });
            Annapurna.Kernel.files.open("text", FILE_PATH, (file) => {
                w.close()
                editCode(file)
            })
            break;
            
    }
}