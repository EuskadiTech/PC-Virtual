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
let Annapurna = {
  Kernel: {
    load: (url, path = undefined) => {
      fetch(url)
        .then(res => res.text())
        .then(text => {
          Function(text)(FILE_PATH = path);
        });
    },
    files: {
      save: (path, content, callback) => {
        fetch(FS_BASE + "&cmd=upload&file=" + encodeURI(path), { method: "post", body: content })
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
        console.log()
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
  }
};
console.log("Loaded Kernel & SDK");

function FixTabs() {
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
document.addEventListener("DOMContentLoaded", FixTabs);

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

if (window.location.hash != "") {
  function hex_to_ascii(str1) {
    // Convert the input hexadecimal string to a regular string
    var hex = str1.toString();
    // Initialize an empty string to store the resulting ASCII characters
    var str = '';
    // Iterate through the hexadecimal string, processing two characters at a time
    for (var n = 0; n < hex.length; n += 2) {
      // Extract two characters from the hexadecimal string and convert them to their ASCII equivalent
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    // Return the resulting ASCII string
    return str;
  }

  function ascii_to_hexa(str)
  {
    // Initialize an empty array to store the hexadecimal values
    var arr1 = [];

    // Iterate through each character in the input string
    for (var n = 0, l = str.length; n < l; n++)
    {
      // Convert the ASCII value of the current character to its hexadecimal representation
      var hex = Number(str.charCodeAt(n)).toString(16);

      // Push the hexadecimal value to the array
      arr1.push(hex);
    }

    // Join the hexadecimal values in the array to form a single string
    return arr1.join('');
  }
  var val = window.location.hash.toLowerCase().replace("#", "")
  var e = hex_to_ascii(val)
  var url = `https://tech.eus/aos/fs.php?user=${e}`
  localStorage.setItem("annapurna_fs_base", url)
  var FS_BASE = localStorage.getItem("annapurna_fs_base");
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
    function hex_to_ascii(str1) {
      // Convert the input hexadecimal string to a regular string
      var hex = str1.toString();
      // Initialize an empty string to store the resulting ASCII characters
      var str = '';
      // Iterate through the hexadecimal string, processing two characters at a time
      for (var n = 0; n < hex.length; n += 2) {
        // Extract two characters from the hexadecimal string and convert them to their ASCII equivalent
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
      }
      // Return the resulting ASCII string
      return str;
    }

    function ascii_to_hexa(str)
    {
      // Initialize an empty array to store the hexadecimal values
      var arr1 = [];

      // Iterate through each character in the input string
      for (var n = 0, l = str.length; n < l; n++)
      {
        // Convert the ASCII value of the current character to its hexadecimal representation
        var hex = Number(str.charCodeAt(n)).toString(16);

        // Push the hexadecimal value to the array
        arr1.push(hex);
      }

      // Join the hexadecimal values in the array to form a single string
      return arr1.join('');
    }
    var val = document.getElementById("fsact").value.toLowerCase()
    var e = hex_to_ascii(val)
    var url = `https://tech.eus/aos/fs.php?user=${e}`
    localStorage.setItem("annapurna_fs_base", url)
    win.close()
    var FS_BASE = localStorage.getItem("annapurna_fs_base");
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
  }
}