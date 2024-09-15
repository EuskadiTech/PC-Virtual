const AVISO = ""
var CROUTE = ""

function makedir(paths, el, route = "") {
    CROUTE = route
    el.innerHTML = ""
    paths.forEach((entry) => {
        var li = document.createElement("li")
        var a = document.createElement("a")
        console.log(entry)
        if (!entry.isFolder && entry.name[0] != ".") {
            var img = document.createElement("img")
            img.width = "16"
            img.src = FILE_TYPES[entry.name.split(".").slice(-1)[0]]["icon"]
            var e = entry.name.split(".").slice(0, -1).join(".")
            var dot = document.createElement("small")
            dot.classList = "dotext"
            dot.append(".", entry.name.split(".").slice(-1)[0])

            var btn1 = document.createElement("button")
            var btn1_img = document.createElement("img")
            btn1_img.width = "16"
            btn1_img.src = "https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-3.png"
            btn1.append(btn1_img, "")
            btn1.style.width = "40px"
            btn1.style.minWidth = "10px"
            btn1.onclick = function () {
                // Tab to edit
                var fullpath = route + "/" + entry.name
                Annapurna.DesktopEnv.confirm((result) => {
                    if (result) {
                        Annapurna.Kernel.files.rmfile(fullpath, () => {
                            Annapurna.Kernel.files.list(CROUTE, (paths2) => {
                                makedir(paths2, el, CROUTE)
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
                            setTimeout(() => { e.close() }, 1750)
                        })
                    }
                }, `¿Quieres borrar el archivo "${entry.name}"?`)

            }

            a.append(img, " ", e, dot, " ", btn1)

            a.onclick = function () {
                // Tab to edit
                var fullpath = route + "/" + entry.name
                Annapurna.Kernel.files.open("open_app", fullpath)
            }
            li.append(a, " ", btn1)
        }
        else if (entry.name[0] != ".") {
            var img = document.createElement("img")
            img.width = "16"
            img.src = "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png"
            var e = entry.name
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
                Annapurna.DesktopEnv.confirm((result) => {
                    if (result) {
                        Annapurna.Kernel.files.rmdir(fullpath, () => {
                            var e = new WinBox("Aviso", {
                                html: "<h4>Carpeta borrada</h4>" + AVISO,
                                template,
                                class: ["window", "fontpix"],
                                width: 200,
                                height: 150,
                                x: "center",
                                y: "center"
                            });
                            Annapurna.Kernel.files.list(CROUTE, (paths2) => {
                                makedir(paths2, el, CROUTE)
                            });
                            setTimeout(() => { e.close() }, 1750)
                        })
                    }
                }, `¿Quieres borrar la carpeta "${e}"?`)
            }

            a.append(img, " ", e)

            a.onclick = function () {
                // Tab to edit
                Annapurna.Kernel.files.list(route + "/" + e, (paths2) => {
                    makedir(paths2, el, route + "/" + e)
                });
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
            Annapurna.Kernel.files.list(parent.join("/"), (paths2) => {
                makedir(paths2, el, parent.join("/"))
            });
        }
        li.append(a)
        el.prepend(li)
    }
}


const newitem = function () {
    const el = document.createElement("ul");
    el.className = "tree-view";
    var ft = [
        {
        "name": "Carpeta",
        "icon": "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png",
        "onclick": (CurrentRoute) => {
            Annapurna.DesktopEnv.prompt(
                (fname) => {
                    
                    Annapurna.Kernel.files.mkdir(CurrentRoute + "/" + fname)
                }, "Nombre de la carpeta", "Crear")
        },
        {
        "name": "Documento",
        "icon": "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png",
        "onclick": (CurrentRoute) => {
            Annapurna.DesktopEnv.prompt(
                (fname) => {
                    alert()
                    Annapurna.Kernel.files.write(CurrentRoute + "/" + fname + ".docx", "")
                    Annapurna.Kernel.files.open("open_app", CurrentRoute + "/" + fname + ".docx")
                }, "Nombre del Documento", "Crear")
        }

    }]

    ft.forEach((file_type) => {
        var ele = document.createElement("li")
        var img = document.createElement("img")
        img.src = file_type.icon
        img.width = "16"
        var ele2 = document.createElement("a")
        ele2.append(img, " ", file_type.name)
        ele2.onclick = () => { file_type.onclick(CROUTE) }
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
    const div = document.createElement("div");
    div.className = "fh";
    const el = document.createElement("ul");
    el.id = wwid;
    el.className = "tree-view";
    const btn2 = Annapurna.AppSDK.UIKit.components.button({
        title: "Recargar",
        onclick: () => {
            Annapurna.Kernel.files.list(CROUTE, (paths) => {
                makedir(paths, el, CROUTE)
            });
        }
    });
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
    Annapurna.Kernel.files.list("/", (paths) => {
        makedir(paths, el, "")
    });
};
index();
