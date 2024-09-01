var uid1 = Annapurna.AppSDK.uuid()
new WinBox("Visual Builder", {
    template,
    html: `
    <textarea id="${uid1}"></textarea>
`,
    class: ["window", "fontpix"],
    width: 350,
    height: 400
});
FixTabs();
var editor = CodeMirror.fromTextArea(document.getElementById(uid1), {
    styleActiveLine: true,
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    mode: "javascript",
});
