const AVISO = "<b>Nota:</b> Debido a un problema tecnico, debes de cerrar y volver a abrir el explorador de archivos."

function makedir(paths, el, route = "", up = []) {
  el.innerHTML = ""
  paths.forEach((entry) => {
    var path = undefined
    if (typeof(entry[1]) != "object") {
      path = entry[1]
    } else {
      path = Array(entry[1])
      path.unshift(entry[0])
    }


    var li = document.createElement("li")
    var a = document.createElement("a")
    if (typeof(path) != "object") {
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
      btn1.onclick = function() {
        // Tab to edit
        var fullpath = route + "/" + path
        if (confirm("¿Quieres borrar el archivo '" + path + "'?")) {
          Annapurna.Kernel.files.rmfile(fullpath, () => {
            var e = new WinBox("Aviso", {
              html: "<h4>Archivo borrado</h4>"+AVISO,
              template,
              class: ["window", "fontpix"],
              width: 200,
              height: 150,
              x: "center",
              y: "center"
            });
            setTimeout(() => {e.close()}, 300)
          })
        }
      }

      a.append(img, " ", e, dot, " ", btn1)

      a.onclick = function() {
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
      btn1.onclick = function() {
        // Tab to edit
        var fullpath = route + "/" + e
        if (confirm("¿Quieres borrar la carpeta '" + path + "'?")) {
          Annapurna.Kernel.files.rmdir(fullpath, () => {
            var e = new WinBox("Aviso", {
              html: "<h4>Carpeta borrada</h4>"+AVISO,
              template,
              class: ["window", "fontpix"],
              width: 200,
              height: 150,
              x: "center",
              y: "center"
            });
            setTimeout(() => {e.close()}, 300)
          })
        }
      }

      a.append(img, " ", e)

      a.onclick = function() {
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

    a.onclick = function() {
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

const index = function() {

  const wwid = Annapurna.AppSDK.uuid();
  const btn1 = Annapurna.AppSDK.UIKit.components.button({
    title: "Nuevo",
    onclick: undefined
  });
  const div = document.createElement("div");
  div.className = "fh";
  const el = document.createElement("ul");
  el.id = wwid;
  el.className = "tree-view";
  div.append(btn1.dom, " ", btn1.dom, " ", el);
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