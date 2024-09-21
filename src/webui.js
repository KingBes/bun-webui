import { lib, encodeCString, bindCallback } from "./ffi"

export class Webui {

    /**
     * Create a new WebUI window object.
     * 创建一个新的web窗口对象。
     * @returns bigint
     */
    newWindow() {
        return lib.symbols.webui_new_window()
    }

    /**
     * Create a new webui window object using a specified window number.
     * 使用指定的窗口号创建新的web窗口对象。
     * @param {bigint} win The window number (should be > 0, and < WEBUI_MAX_IDS).窗口 number 大于 0 小于 webui_max_ids
     * @returns bigint
     */
    newWindowId(win) {
        return lib.symbols.webui_new_window_id(win)
    }

    /**
     * Get a free window number that can be used with `newWindowId()`
     * 获取一个免费的窗口号，可以使用' newwindowwid () '
     * @returns bigint
     */
    getNewWindowId() {
        return lib.symbols.webui_get_new_window_id()
    }

    /**
     * Bind an HTML element and a JavaScript object with a backend function. Empty element name means all events.
     * 用后端函数绑定一个HTML元素和一个JavaScript对象。空元素名称表示所有事件。
     * @param {bigint} win The window number 窗口号
     * @param {string} element The HTML element / JavaScript object. HTML元素/ JavaScript对象
     * @param {callback} func The callback function. 回调函数
     * @returns Returns a unique bind ID. 返回唯一的绑定ID。
     */
    bind(win, element, func) {
        if (typeof func !== 'function') {
            throw `传入的参数不是一个函数。\n
                The argument passed in is not a function.`
        }
        const callback = bindCallback(func)
        const res = lib.symbols.webui_bind(win,
            encodeCString(element),
            callback)
        return res
    }

    show(win, content) {
        return lib.symbols.webui_show(win, encodeCString(content))
    }

    wait() {
        lib.symbols.webui_wait()
    }

    returnString(event_t, str) {
        lib.symbols.webui_return_string(event_t, encodeCString(str))
    }
}