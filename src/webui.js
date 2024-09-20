import { FFIType, CString } from "bun:ffi"
import { lib, encodeCString } from "./ffi"

export class Webui {
    newWindow() {
        return lib.symbols.webui_new_window()
    }

    show(win, content) {
        return lib.symbols.webui_show(win, encodeCString(content))
    }

    wait() {
        lib.symbols.webui_wait()
    }
}