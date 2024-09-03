
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
var FILE_TYPES = {
    "txapela-compra": {
        "program": "apps/txapela.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/msagent-3.png"
    },
    "txt": {
        "program": "apps/textedit.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/address_book_pad.png"
    },
    "py": {
        "program": "apps/textedit.js",
        "icon": "https://win98icons.alexmeub.com/icons/png/appwizard-5.png"
    },
    "js": {
        "type": "executable",
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
         * @return {void}
         */
        load: (url, path = undefined) => {
            fetch(url)
                .then(res => res.text())
                .then(text => {
                    Function(text)(FILE_PATH = path);
                });
        },
        /**
         * Sistema de archivos
         */
        files: {
            /**
             * Consigue la lista recursiva de archivos desde una ruta
             * @param  {object} RecursiveFileList Lista recursiva de archivos
             * @param  {string|object} route Ruta
             * @return {object} Lista recursiva de archivos
             */
            RouteFixer: (RecursiveFileList, route) => {
                // Convert string to Array
                // Convertir una cadena a un Array
                if (typeof (route) == "string") {
                    console.debug("Route: Got string " + route)
                    route = route.split("/")
                }
                // Remove empty values in the route
                // Eliminar valores vacios en la ruta
                route = route.filter(i => i)
                var currentRoute = []
                var OutputRFL = RecursiveFileList
                var currentDepth = 0
                var iterations = 0
                var maxIterations = parseInt(Annapurna.Kernel.registry.get("Kernel__files__RouteFixer__MaxIterations", "250"))
                // Stop when the iterations exceed the max
                // Parar cuando se pasa el limite de iteraciónes (para no sobrecargar el navegador)
                while (iterations <= maxIterations) {
                    iterations += 1
                    // If the routes match
                    // Si las rutas coinciden
                    if (currentRoute.join("/") == route.join("/")) {
                        console.debug("Route: Path Fixed")
                        // Return the contents of the correct folder.
                        // Devolver el contenido de la carpeta correcta.
                        return OutputRFL;
                    }

                    // Folder name that we want for this iteration
                    // Nombre de la carpeta que queremos
                    var wantedName = route[currentDepth]
                    console.debug("Route: Wants " + wantedName)
                    OutputRFL.forEach((RFLEntry) => {
                        if (typeof (path) == "object") {
                            var folderName = RFLEntry[0]
                            console.debug("Route: Subitem " + folderName)
                            // If this folder and the folder we want are the same
                            // Si la carpeta actual y la carpeta que queremos se llaman igual
                            if (folderName == wantedName) {
                                console.debug("Route: Tested " + folderName)
                                // Go deeper
                                // Ir mas profundo
                                currentDepth += 1
                                // Add folder to current route
                                // Añadir carpeta a la ruta actual
                                currentRoute.push(folderName)
                                // Contents of the folder
                                // Contenidos de la carpeta
                                var folderContents = Object.entries(RFLEntry[1])
                                // Set the (temporary) output to this folder's contents
                                // Establece la salida (temporal) a el contenido de esta carpeta
                                OutputRFL = folderContents
                            }
                        }
                    })
                }
            },
            save: (path, content, callback) => {
                fetch(FS_BASE + "&cmd=upload&file=" + encodeURI(path), { method: "post", body: content })
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            mkdir: (path, callback) => {
                fetch(FS_BASE + "&cmd=mkdir&file=" + encodeURI(path))
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            rmfile: (path, callback) => {
                fetch(FS_BASE + "&cmd=rmfile&file=" + encodeURI(path))
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            rmdir: (path, callback) => {
                fetch(FS_BASE + "&cmd=rmdir&file=" + encodeURI(path))
                    .then(res => res.text())
                    .then(text => {
                        callback()
                    });
            },
            open: (mode, path, callback) => {
                var pa = FS_BASE + "&cmd=download&file=" + encodeURI(path)
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
            list: (callback) => {
                var fet = fetch(FS_BASE + "&cmd=list")
                    .then(res => res.json())
                    .then(json => {
                        var val = Object.entries(json)
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
            fetch("https://tech.eus/aos/license.php?user=" + license.toUpperCase()).then(res => res.json()).then(json => {
                var url = json.fs_baseurl
                localStorage.setItem("annapurna_fs_base", url)
                FS_BASE = url;
                callback_ok()
            }).catch(() => {
                callback_fail()
            })
        }
    },
    DesktopEnv: {
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

    if (!FS_BASE) {
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