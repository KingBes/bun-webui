import { dlopen, FFIType, ptr, JSCallback, CFunction } from "bun:ffi";

// win lib
import win64_lib from "../build/webui-windows-msvc-x64/webui-2.dll" with { type: "file" };
// linux lib
import linux64_lib from "../build/webui-linux-clang-x64/webui-2.so" with { type: "file" };
// macos lib
import macos_lib from "../build/webui-macos-clang-x64/webui-2.dylib" with { type: "file" };

// 动态库文件
let lib_file;

// 获取动态库文件
// get lib file
if (process.platform === "win32") {
    lib_file = win64_lib
} else if (process.platform === "linux" && process.arch === "x64") {
    lib_file = linux64_lib
} else if (process.platform === "darwin" && process.arch === "x64") {
    lib_file = macos_lib
} else {
    throw `不支持平台：${process.platform}-${process.arch}。\n
    unsupported platform: ${process.platform}-${process.arch}`
}

// const [webui_event_t] = getVersionPtrs()

/* const webui_event_t = {
    window: FFIType.i64,
    event_type: FFIType.i64,
    element: FFIType.cstring,
    event_number: FFIType.i64,
    bind_id: FFIType.i64,
    client_id: FFIType.i64,
    connection_id: FFIType.i64,
    cookies: FFIType.cstring
} */

/**
 * 字符串转义C String escape C
 * @param {string} value 
 * @returns 返回安全C字符串 Return a safe C string
 */
export const encodeCString = (value) => {
    return ptr(new TextEncoder().encode(value + "\0"));
}

export const bindCallback = (func) => {
    const res = new JSCallback((event_t) => {
        func(event_t)
    }, {
        args: [FFIType.ptr],
        returns: FFIType.void
    })
    return CFunction(res)
}

// 导出 export
export const lib = dlopen(process.env.WEBUI ?? lib_file, {
    webui_new_window: {
        args: [],
        returns: FFIType.i64
    },
    webui_new_window_id: {
        args: [FFIType.i64],
        returns: FFIType.i64
    },
    webui_get_new_window_id: {
        args: [],
        returns: FFIType.i64
    },
    webui_bind: {
        args: [FFIType.i64, FFIType.cstring, FFIType.function],
        returns: FFIType.i64
    },
    webui_show: {
        args: [FFIType.i64, FFIType.cstring],
        returns: FFIType.bool
    },
    webui_wait: {
        args: [],
        returns: FFIType.void
    },
    webui_return_string: {
        args: [FFIType.pointer, FFIType.cstring],
        returns: FFIType.void
    }
})