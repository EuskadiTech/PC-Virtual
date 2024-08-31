var FS_BASE = "https://es01-fs.tech.eus/";
let Annapurna = {
    Kernel: {
        load: url => {
            fetch(url)
                .then(res => res.text())
                .then(text => {
                    Function(text)();
                });
        },
        files: {
            open: (mode, path, callback) => {
                var fet = fetch(FS_BASE + path);
                switch (mode) {
                    case "textfile":
                        fet.then(res => res.text()).then(text => {
                            callback(text);
                        });
                        break;
                    case "exec":
                        fet.then(res => res.text()).then(text => {
                            Function(text)();
                        });
                        break;
                }
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
