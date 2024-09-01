function makedir(paths, el, route="", up=[]) {
  el.innerHTML = ""
  paths.forEach((path) => {
    console.log(path)
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
  
  
      a.append(img, " ", e, dot, " ", btn1)
  
      a.onclick = function() {
        // Tab to edit
        var fullpath = path
        Annapurna.Kernel.files.open("open_app", fullpath)
      }
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
  
  
      a.append(img, " ", e, " ", btn1)
  
      a.onclick = function() {
        // Tab to edit
        
        up.push(path)
        console.log(up)
        path.shift()
        makedir(path, el, route + "/" + e, up)
      }
    }
    li.append(a)
    el.prepend(li)
  })
  if (route != "") {
    var li = document.createElement("li")
    var a = document.createElement("a")
    a.append("../ (Directorio superior)")
    
    a.onclick = function() {
      // Tab to edit
      
      var parent = route.split("/").splice(0, -2).join("/")
      up.pop()
      makedir(up[up.length-1], el, parent, up)
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