
const template = document.createElement("div");
template.innerHTML = `
  <div class="title-bar wb-header">
    <div class="title-bar-text wb-title wb-drag fw"></div>
    <div class="title-bar-controls wb-control">
      <button class="wb-min" aria-label="Minimize"></button>
      <button class="wb-max" aria-label="Maximize"></button>
      <button class="wb-close" aria-label="Close"></button>
    </div>
  </div>
  <div class="window-body wb-body">
  </div>
`;
var FS_BASE = localStorage.getItem("annapurna_fs_base");
var LICENSENO = localStorage.getItem("annapurna_license");
var FILE_TYPES = {
    "txapela-compra": {
        "program": "static/apps/txapela.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/msagent-3.png"
    },
    "txa_c": {
        "program": "static/apps/txapela.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/msagent-3.png"
    },
    "txt": {
        "program": "static/apps/textedit.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/address_book_pad.png"
    },
    "docx": {
        "program": "static/apps/txapela.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/address_book_pad.png"
    },
    "odt": {
        "program": "static/apps/txapela.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/address_book_pad.png"
    },
    "py": {
        "program": "static/apps/textedit.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/appwizard-5.png"
    },
    "js": {
        "program": "static/apps/txapela.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/appwizard-5.png"
    }
};
/**
 * SDK del sistema operativo de Annapurna.
 */
let Annapurna = {
    /**
     * Kernel generico Annapurna
     */
    Kernel: {
        /**
         * Registro del sistema operativo
         */
        registry: {
            /**
             * Devuelve una variable del registro
             * @param  {string} key Variable a leer
             * @param  {string} defaultValue Valor por defecto
             * @return {string} Valor de la variable
             */
            get: (key, defaultValue) => {
                return localStorage.getItem("REG_ANNA_" + key) || defaultValue
            }
        },
        /**
         * Descarga y ejecuta el programa en el URL
         * @param  {string} url URL del programa
         * @param  {string|undefined} path Ruta de la carpeta actual
         * @param  {any|undefined} args Parametros extra
         * @return {void}
         */
        load: (url, path = undefined, args = undefined) => {
            fetch(url)
                .then(res => res.text())
                .then(text => {
                    Function(text)(FILE_PATH = path, CUSTOM_ARGS=args);
                });
        },
        /**
         * Sistema de archivos
         */
        files: {
            save: (path, content, callback = () => { }) => {
                fetch(FS_BASE + "?cmd=upload&file=" + encodeURI(path), { method: "post", body: content })
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            mkdir: (path, callback = () => { }) => {
                fetch(FS_BASE + "?cmd=mkdir&file=" + encodeURI(path))
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            rmfile: (path, callback = () => { }) => {
                fetch(FS_BASE + "?cmd=rmfile&file=" + encodeURI(path))
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            rmdir: (path, callback = () => { }) => {
                fetch(FS_BASE + "?cmd=rmdir&file=" + encodeURI(path))
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            open: (mode, path, callback = () => { }) => {
                var pa = FS_BASE + "?cmd=download&file=" + encodeURI(path)
                var fet = fetch(pa);
                switch (mode) {
                    case "text":
                        fet.then(res => res.text()).then(text => {
                            callback(text);
                        });
                        break;
                    case "json":
                        fet.then(res => res.json()).then(text => {
                            callback(text);
                        });
                        break;
                    case "exec":
                        fet.then(res => res.text()).then(text => {
                            Function(text)(FILE_PATH = undefined);
                        });
                        break;
                    case "open_app":
                        var ent = FILE_TYPES[path.split(".").slice(-1)[0]]
                        if (ent["type"] == "executable") {
                            fet.then(res => res.text()).then(text => {
                                Function(text)(FILE_PATH = undefined);
                            });
                        } else {
                            Annapurna.Kernel.load(ent["program"], FILE_PATH = path)
                        }
                        break;
                }

            },
            list: (folder = "/", callback = () => { }) => {
                var fet = fetch(FS_BASE + "?cmd=list&file="+encodeURI(folder))
                    .then(res => res.json())
                    .then(json => {
                        var val = json
                        callback(val);
                    });
            }
        }
    },
    AppSDK: {
        uuid: () => {
            return "UUID-" + crypto.randomUUID();
        },
        UIKit: {
            components: {
                button: config => {
                    var el = document.createElement("button");
                    el.innerHTML = config.title;
                    el.id = Annapurna.AppSDK.uuid();
                    el.onclick = config.onclick;
                    return { dom: el, id: el.id };
                },
                tabs: config => {
                    // section class="tabs fh overy-article"
                    // menu role="tablist" aria-label="Sample Tabs"
                    // button role="tab" aria-selected="true" aria-controls="tab-A"
                    // article role="tabpanel" id="tab-A" class="fontpix"
                    var section = document.createElement("section");
                    section.className = "tabs fh overy-article";

                    var menu = document.createElement("menu");
                    menu.role = "tablist";
                    menu.ariaLabel = config.title;
                    section.append(menu);
                    config.tabs.forEach(tab => {
                        var button = document.createElement("button");
                        button.role = "tab";
                        button.innerText = tab.title;
                        const tabid = Annapurna.AppSDK.uuid();
                        button.ariaControls = tabid;
                        if (tab.selected) {
                            button.ariaSelected = true;
                        }
                        var article = document.createElement("article");
                        article.role = "tabpanel";
                        article.id = tabid;
                        if (tab.usefont) {
                            article.className = "fontpix";
                        }
                        if (!tab.selected) {
                            article.hidden = true;
                        }
                        tab.content.forEach(element => {
                            article.append(element.dom);
                        });

                        menu.append(button);
                        section.append(article);
                    });
                    return { dom: section };
                }
            }
        }
    },
    Activation: {
        load_license: (license, callback_ok = () => { }, callback_fail = () => { }) => {
            fetch("license/" + license.toUpperCase()).then(res => res.json()).then(json => {
                var url = json.fs_baseurl
                localStorage.setItem("annapurna_fs_base", url)
                FS_BASE = url;
                localStorage.setItem("annapurna_license", license.toUpperCase())
                LICENSENO = license.toUpperCase()
                callback_ok()
            }).catch(() => {
                callback_fail()
            })
        }
    },
    DesktopEnv: {
        prompt: (callback, msg, title = "Pregunta") => {
            var inp = Annapurna.AppSDK.uuid()
            var btn1 = Annapurna.AppSDK.uuid()
            var btn2 = Annapurna.AppSDK.uuid()
            var win = new WinBox(title, {
                html: `${msg}<br><input size='35' id='${inp}' placeholder='Introduce...'></input><button id='${btn1}'>OK</button> <button id='${btn2}'>Cancelar</button>`,
                template,
                class: ["window", "fontpix"],
                width: 300,
                height: 200,
                x: "center",
                y: "center"
            });
            document.getElementById(btn1).onclick = () => {
                var val = document.getElementById(inp).value
                win.close()
                callback(val)
            }
            document.getElementById(btn2).onclick = () => {
                win.close()
                callback(false)
            }
        },
        alert: (callback = () => { }, msg, title = "Alerta") => {
            var inp = Annapurna.AppSDK.uuid()
            var btn1 = Annapurna.AppSDK.uuid()
            var win = new WinBox(title, {
                html: `${msg}<br><input size='35' id='${inp}' placeholder='Introduce...'></input<button id='${btn1}'>Cerrar</button>`,
                template,
                class: ["window", "fontpix"],
                width: 300,
                height: 200,
                x: "center",
                y: "center"
            });
            document.getElementById(btn1).onclick = () => {
                win.close()
                callback(val)
            }
        },
        confirm: (callback, msg, title = "Confirma") => {
            var btn1 = Annapurna.AppSDK.uuid()
            var btn2 = Annapurna.AppSDK.uuid()
            var win = new WinBox(title, {
                html: `${msg}<br><button id='${btn1}'>OK</button> <button id='${btn2}'>Cancelar</button>`,
                template,
                class: ["window", "fontpix"],
                width: 300,
                height: 200,
                x: "center",
                y: "center"
            });
            document.getElementById(btn1).onclick = () => {
                win.close()
                callback(true)
            }
            document.getElementById(btn2).onclick = () => {
                win.close()
                callback(false)
            }
        },
        /**
         * Plantilla de WinBox
         */
        WinBoxTemplate: template,
        /**
         * Arreglar las pestañas del documento.
         */
        FixTabs: () => {
            function openTab(event, tab) {
                const articles = tab.parentNode.querySelectorAll('[role="tabpanel"]');
                articles.forEach(p => {
                    p.setAttribute("hidden", true);
                });
                const article = tab.parentNode.querySelector(
                    `[role="tabpanel"]#${event.target.getAttribute("aria-controls")}`
                );
                article.removeAttribute("hidden");
            }
            const tabs = document.querySelectorAll("menu[role=tablist]");

            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];

                const tabButtons = tab.querySelectorAll("menu[role=tablist] > button");

                tabButtons.forEach(btn =>
                    btn.addEventListener("click", e => {
                        e.preventDefault();

                        tabButtons.forEach(button => {
                            if (
                                button.getAttribute("aria-controls") ===
                                e.target.getAttribute("aria-controls")
                            ) {
                                button.setAttribute("aria-selected", true);
                                openTab(e, tab);
                            } else {
                                button.setAttribute("aria-selected", false);
                            }
                        });
                    })
                );
            }
        }
    }
};
console.log("Loaded Kernel & SDK");


if (DE_ENABLED) {
    if (window.location.hash != "") {
        var val = window.location.hash.toLowerCase().replace("#", "")
        Annapurna.Activation.load_license(val, () => {
            var win2 = new WinBox("Activación", {
                html: "<h4>¡Dispositivo activado de forma automatica!</h4><br>Se cerrará esta ventana en 5 segundos",
                template,
                class: ["window", "fontpix"],
                width: 300,
                height: 175,
                x: "right",
                y: "bottom"
            });
            setTimeout(() => { win2.close() }, 5000)
        })
    }

    if (!FS_BASE || !LICENSENO) {
        var win = new WinBox("Activación", {
            html: "<h4>Activa este dispositivo.</h4><br>Debes de activar Annapurna para poder guardar archivos.<br><input size='35' id='fsact' placeholder='AABBCCDDEEFF'></input><button id='fsactbtn'>Activar</button>",
            template,
            class: ["window", "fontpix"],
            width: 300,
            height: 200,
            x: "center",
            y: "center"
        });
        document.getElementById("fsactbtn").onclick = () => {
            var val = document.getElementById("fsact").value.toLowerCase()

            Annapurna.Activation.load_license(val, () => {
                win.close()
                var win2 = new WinBox("Activación", {
                    html: "<h4>¡Dispositivo activado correctamente!</h4><br>Se cerrará esta ventana en 5 segundos",
                    template,
                    class: ["window", "fontpix"],
                    width: 300,
                    height: 175,
                    x: "right",
                    y: "bottom"
                });

                setTimeout(() => { win2.close() }, 5000)
            })
        }
    }
}
