import { Webui } from "./src/index"

// 实例
const webui = new Webui

// 创建窗口
const win = webui.newWindow()

// 显示窗口
webui.show(win, "<html><script src=\"webui.js\"></script> Hello World from BunJs! </html>")

// 等待
webui.wait()