export interface VNode {
    tag: string
    props: Map<string, string> | null
    childern:  Array<VNode> | string | null
    el?: HTMLElement
}