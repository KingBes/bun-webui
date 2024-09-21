import { Webui } from "./src/index"
import Bun from "bun"

// 实例
const webui = new Webui

// 创建窗口
const win = webui.newWindow()

webui.bind(win, "hello", function (event_t) {
    console.log("e:", event_t)
    webui.returnString(event_t, "hello")
})

const content = await Bun.file("./index.html").text()

// 显示窗口
webui.show(win, content)

// 等待
webui.wait()