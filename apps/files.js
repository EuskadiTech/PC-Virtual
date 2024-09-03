const AVISO = "<b>Nota:</b> Debido a un problema tecnico, debes de cerrar y volver a abrir el explorador de archivos."
var CROURE = ""

function makedir(paths, el, route = "", up = []) {
    CROURE = route
    el.innerHTML = ""
    paths.forEach((entry) => {
        var path = undefined
        if (typeof (entry[1]) != "object") {
            path = entry[1]
        } else {
            path = Array(entry[1])
            path.unshift(entry[0])
        }


        var li = document.createElement("li")
        var a = document.createElement("a")
        if (typeof (path) != "object") {
            var img = document.createElement("img")
            img.width = "16"
            img.src = FILE_TYPES[path.split(".").slice(-1)[0]]["icon"]
            var e = path.split(".").slice(0, -1).join(".")
            var dot = document.createElement("small")
            dot.classList = "dotext"
            dot.append(".", path.split(".").slice(-1)[0])

            var btn1 = document.createElement("button")
            var btn1_img = document.createElement("img")
            btn1_img.width = "16"
            btn1_img.src = "https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-3.png"
            btn1.append(btn1_img, "")
            btn1.style.width = "40px"
            btn1.style.minWidth = "10px"
            btn1.onclick = function () {
                // Tab to edit
                var fullpath = route + "/" + path
                if (confirm("¿Quieres borrar el archivo '" + path + "'?")) {
                    Annapurna.Kernel.files.rmfile(fullpath, () => {
                        Annapurna.Kernel.files.list((paths2) => {
                            makedir(Annapurna.Kernel.files.RouteFixer(paths2, route), el, route, up)
                        });
                        var e = new WinBox("Aviso", {
                            html: "<h4>Archivo borrado</h4>" + AVISO,
                            template,
                            class: ["window", "fontpix"],
                            width: 200,
                            height: 150,
                            x: "center",
                            y: "center"
                        });
                        setTimeout(() => { e.close() }, 300)
                    })
                }
            }

            a.append(img, " ", e, dot, " ", btn1)

            a.onclick = function () {
                // Tab to edit
                var fullpath = route + "/" + path
                Annapurna.Kernel.files.open("open_app", fullpath)
            }
            li.append(a, " ", btn1)
        }
        else {
            var img = document.createElement("img")
            img.width = "16"
            img.src = "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png"
            var e = path[0]
            var btn1 = document.createElement("button")
            var btn1_img = document.createElement("img")
            btn1_img.width = "16"
            btn1_img.src = "https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-3.png"
            btn1.append(btn1_img, "")
            btn1.style.width = "40px"
            btn1.style.minWidth = "10px"
            btn1.onclick = function () {
                // Tab to edit
                var fullpath = route + "/" + e
                if (confirm("¿Quieres borrar la carpeta '" + path + "'?")) {
                    Annapurna.Kernel.files.rmdir(fullpath, () => {
                        Annapurna.Kernel.files.list((paths2) => {
                            makedir(Annapurna.Kernel.files.RouteFixer(paths2, route), el, route, up)
                        });
                        var e = new WinBox("Aviso", {
                            html: "<h4>Carpeta borrada</h4>" + AVISO,
                            template,
                            class: ["window", "fontpix"],
                            width: 200,
                            height: 150,
                            x: "center",
                            y: "center"
                        });
                        setTimeout(() => { e.close() }, 300)
                    })
                }
            }

            a.append(img, " ", e)

            a.onclick = function () {
                // Tab to edit
                var en = Object.entries(entry[1])
                up.push(en)
                makedir(en, el, route + "/" + e, up)
            }
            li.append(a, " ", btn1)
        }

        el.prepend(li)
    })
    if (route != "") {
        var li = document.createElement("li")
        var a = document.createElement("a")
        a.append("../ (Directorio superior)")

        a.onclick = function () {
            // Tab to edit
            var parent = route.split("/")
            parent.pop()
            var u = up.pop()
            makedir(up[up.length - 1], el, parent.join("/"), up)
        }
        li.append(a)
        el.prepend(li)
    }
}


const newitem = function () {
    const el = document.createElement("ul");
    el.className = "tree-view";
    var ft = [{
        "name": "Carpeta",
        "icon": "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png",
        "onclick": (CurrentRoute) => {
            Annapurna.Kernel.files.mkdir(CurrentRoute + "/" + confirm("Nombre de la carpeta"))
        }

    }]

    ft.forEach((file_type) => {
        var ele = document.createElement("li")
        var img = document.createElement("img")
        img.src = file_type.icon
        img.width = "16"
        var ele2 = document.createElement("a")
        ele2.append(img, " ", file_type.name)
        ele2.onclick = () => { file_type.onclick(CROURE) }
        ele.append(ele2)
        el.append(ele)
    })
    new WinBox("Crear", {
        mount: el,
        template,
        class: ["window", "fontpix"],
        width: 300,
        height: 300,
        x: "center",
        y: "center"
    });
};

const index = function () {

    const wwid = Annapurna.AppSDK.uuid();
    const btn1 = Annapurna.AppSDK.UIKit.components.button({
        title: "Nuevo",
        onclick: () => { newitem() }
    });
    const btn2 = Annapurna.AppSDK.UIKit.components.button({
        title: "Recargar",
        onclick: () => {
            Annapurna.Kernel.files.list((paths) => {
                Annapurna.Kernel.files.RouteFixer(paths, CROURE)
            });
        }
    });
    const div = document.createElement("div");
    div.className = "fh";
    const el = document.createElement("ul");
    el.id = wwid;
    el.className = "tree-view";
    div.append(btn1.dom, " ", btn2.dom, " ", el);
    new WinBox("Mis Archivos", {
        mount: div,
        template,
        class: ["window", "fontpix"],
        width: 300,
        height: 300,
        x: "center",
        y: "center"
    });
    Annapurna.Kernel.files.list((paths) => {
        makedir(paths, el, "", [paths])
    });
};
index();