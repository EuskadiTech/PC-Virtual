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
    class: ["window"],
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

        a.append(path[0])
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