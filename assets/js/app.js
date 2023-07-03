// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

let Hooks = {}

Hooks.Draggable = {
  mounted(){
    // var debounceTimer;
    var time = Date.now()
    var x
    var y
    this.el.addEventListener("dragstart", e => {
      x = e.offsetX
      y = e.offsetY
      e.dataTransfer.setData("text/plain", e.target.dataset.id)
      document.getElementById(e.target.dataset.dropTarget).classList.add("ring")
    })
    this.el.addEventListener("drag", e => {
      if ((Date.now() - time) > 50) {
        this.pushEvent("drag", {id: e.target.dataset.id, x: e.offsetX - x, y: e.offsetY - y})
        time = Date.now()
      }
    })
    this.el.addEventListener("dragend", e => {
      console.log(e)
      this.pushEvent("drag", {id: e.srcElement.dataset.id, x: 0, y: 0})
    })
  }
}

Hooks.DragTarget = {
  mounted(){
    this.el.addEventListener("dragover", e => {
      e.srcElement.classList.add("ring-offset-2", "border-red-500")
      e.preventDefault()
    })
    this.el.addEventListener("dragleave", e => {
      e.srcElement.classList.remove("ring-offset-2", "ring-2")
      e.preventDefault()
    })
    this.el.addEventListener("drop", e => {
      this.pushEvent("drop", {id: e.dataTransfer.getData("text")})
      e.preventDefault()
    })
  }
}

let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}, hooks: Hooks})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

