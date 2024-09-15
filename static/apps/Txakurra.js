function hacer_la_compra(){
    var num = new Date().toISOString().split("T")[0]
    new WinBox("TX: Hacer la compra", {
        template,
        html: `
            <img style="float: left; padding: 5px; margin-right: 15px;" src="https://raw.githubusercontent.com/darealshinji/haiku-icons/master/png/64x64/Misc_Dog.png">
            <h4 style="">Hacer la compra</h4>
            <hr>
            Para hacer la compra puedes seguir estos pasos:
            <ol>
                <li><a onclick="Annapurna.Kernel.load('static/apps/txapela.js', 'Documentos/Compras/Compra del ${num}.txa_c', 'new')">Abre una nueva compra</a> y pulsa "Calcular Precios"</li>
                <li>Busca los precios mas baratos de los productos que quieras comprar</li>
                <li>Guarda la compra</li>
                <li>Y exporta la compra</li>
            </ol>
            `,
        class: ["window", "fontpix"],
        width: 350,
        height: 400
    });
}


HELPS = [
    {
        title: "Hacer la compra",
        onclick: hacer_la_compra
    }
]

function index() {
    var elid = Annapurna.AppSDK.uuid()
    var win = new WinBox("Txakurra", {
        template,
        html: `
            <img style="float: left; padding: 5px; margin-right: 15px;" src="https://raw.githubusercontent.com/darealshinji/haiku-icons/master/png/64x64/Misc_Dog.png"> <h3 style="">Soy Txakurra</h3><h4>Tu asistente digital</h4>
            <hr>
            <h4>¿Que ayuda necesitas?</h4>
            <div id="${elid}"></div>
            `,
        class: ["window", "fontpix"],
        width: 350,
        height: 400
    });
    var el = document.getElementById(elid)
    HELPS.forEach((help) => {
        var btn = document.createElement("button")
        btn.append(help.title)
        btn.onclick = () => {win.minimize(); help.onclick()}
        el.append(btn, " ")
    })

}
index()
