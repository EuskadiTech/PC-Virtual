var uid1 = Annapurna.AppSDK.uuid()
const editCode = (path, type, def) => {
    new WinBox("Editar - Visual Builder", {
        template,
        html: `
	    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/codemirror.css'>
	    <textarea id="${uid1}"></textarea>`,
        class: ["window", "fontpix"],
        width: 400,
        height: 400
    });
    FixTabs();
    var editor = CodeMirror.fromTextArea(document.getElementById(uid1), {
        styleActiveLine: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        mode: type,
        value: def,
    });
    editor.setValue(def)
    Annapurna.Kernel.files.open("text", path, (content) => {
        if (content != "") { editor.setValue(content) }
    });
}
const newFromTemplate = (path) => {
    const btn = Annapurna.AppSDK.UIKit.components.button({
        title: 'Pagina web incrustada',
        onclick: () => {
            editCode(path, "javascript", `// Cambia los valores TITULO_VENTANA y URL_IFRAME
new WinBox("${prompt("Nombre de la nueva ventana")}", {
    html: '<iframe src="${prompt("URL a Incrustar")}" width="100%"></iframe>',
    template,
    class: ["window", "nomarg"],
    width: 300,
    height: 400
});`)
        }
    });
    const div = document.createElement("div")
    div.append(btn.dom)
    new WinBox("Crear archivo - Visual Builder", {
        template,
        mount: div,
        class: ["window", "fontpix"],
        width: 400,
        height: 400
    });
}
const projectIndex = (path) => {
    const btn = Annapurna.AppSDK.UIKit.components.button({
        title: '<img src="https://win98icons.alexmeub.com/icons/png/printer-0.png"><br>Crear',
        onclick: () => {
            newFromTemplate(path + "/" + prompt("Nombre del ejecutable") + ".js")
        }
    });
    const div = document.createElement("div")
    div.append(btn.dom)
    new WinBox("Proyecto - Visual Builder", {
        template,
        mount: div,
        class: ["window", "fontpix"],
        width: 400,
        height: 400
    });
}
projectIndex("Documentos/VisualBuilder/" + prompt("Nombre del proyecto"))

