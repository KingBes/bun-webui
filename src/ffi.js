import { dlopen, FFIType, ptr } from "bun:ffi";

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

/**
 * 字符串转义C String escape C
 * @param {string} value 
 * @returns 返回安全C字符串 Return a safe C string
 */
export const encodeCString = (value) => {
    return ptr(new TextEncoder().encode(value + "\0"));
}

// 导出 export
export const lib = dlopen(process.env.WEBUI ?? lib_file, {
    webui_new_window: {
        args: [],
        returns: FFIType.int
    },
    webui_show: {
        args: [FFIType.int, FFIType.cstring],
        returns: FFIType.bool
    },
    webui_wait: {
        args: [],
        returns: FFIType.void
    }
})