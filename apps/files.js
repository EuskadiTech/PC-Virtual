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
    Object.entries(paths).forEach((path) => {
      var li = document.createElement("li")
      var a = document.createElement("a")
      if (path[1] == null) {
        var img = document.createElement("img")
        img.width="16"
        img.src = FILE_TYPES[path[0].split(".").slice(-1)[0]]["icon"]
        var e = path[0].split(".").slice(0, -1).join(".")
        var dot = document.createElement("small")
        dot.classList = "dotext"
        dot.append(".", path[0].split(".").slice(-1)[0])
        
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
          var fullpath = path[0]
          Annapurna.Kernel.files.open("open_app", fullpath)
        }
      }
      li.append(a)
      el.append(li)
    })
  });
};
index();