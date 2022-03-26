import { VNode } from "./types/vnode";

// 创建一个虚拟节点
export function h (tag: string, props: Map<string, string> | null, childern: Array<VNode> | string | null): VNode {
    return {
        tag,
        props,
        childern
    }
}