import { VNode } from "../types/vnode";

export function mountElement(vnode: VNode, container: HTMLElement) {
    const { tag, props, childern } = vnode;
    // tag
    const el = (vnode.el = document.createElement(tag))
    // props
    if (props) {
        for (const key in props) {
            const val = props.get(key);
            el.setAttribute(key, val || "");
        }
    }
    // childern
    // 可以接受一个字符串
    if (typeof childern === 'string') {
        const textNode = document.createTextNode(childern);
        el.append(textNode);
    } else if (Array.isArray(childern)) {
        childern.forEach(v => {
            mountElement(v, el);
        })
    }
    // 也可以接受一个数组

    // 插入
    container.append(el);
}

export function diff(n1: VNode, n2: VNode) {
    // 1. tag
    const el = (n2.el = n1.el) as HTMLElement;// 给 el 进行交换，保证在下次执行的时候是走的这一条路线 
    if (n1.tag !== n2.tag) {
        n1.el?.replaceWith(document.createElement(n2.tag));
    } else {
        // 2. props
        // old { id: "foo", class: "bar" }
        // new { id: "foo", class: "baz", a: "a" }
        const { props: newProps } = n2;
        const { props: oldProps } = n1;

        if (newProps && oldProps) {
            for (const key in newProps) {
                const newVal = newProps.get(key);
                const oldVal = oldProps.get(key);
                if (newVal !== oldVal) {
                    n1.el?.setAttribute(key, newVal || "");  // 有值更新的情况
                }
            }
        }

        if (oldProps) {
            for (const key in oldProps) {
                if (!newProps?.get(key)) {
                    n1.el?.removeAttribute(key);  // 新的节点没有这个属性
                }
            }
        }

    }
    // 3. childern  暴力法
    //    1. string -> string
    //    2. string -> Array
    //    3. Array  -> string
    //    4. Array  -> Array
    const { childern: newChildern = [] } = n2;
    const { childern: oldChildern = [] } = n2;

    if (typeof newChildern === 'string') {
        if (typeof oldChildern === 'string') {
            if (newChildern !== oldChildern) {
                n2.el && (n2.el.textContent = newChildern);
            }
        } else if (Array.isArray(oldChildern)) {
            n2.el && (n2.el.textContent = newChildern);
        }
    } else if (Array.isArray(newChildern)) {
        if (typeof oldChildern === 'string') {
            n2.el && (n2.el.innerText = "");
            mountElement(n2, el);
        } else if (Array.isArray(oldChildern)) {
            const length = Math.min(newChildern.length, oldChildern.length);
            for (let index = 0; index < length; index++) {
                const newVNode: VNode = newChildern[index];
                const oldVNode: VNode = oldChildern[index];
                diff(newVNode, oldVNode);
            }

            if (newChildern.length > length) {
                // 创建新的节点
                for (let index = length; index < newChildern.length; index++) {
                    const newVNode:VNode = newChildern[index];
                    mountElement(newVNode, el);
                }
            }

            if (oldChildern.length > length) {
                // 删除节点
                for (let index = length; index < oldChildern.length; index++) {
                    const oldVNode:VNode = oldChildern[index];
                    oldVNode.el?.parentNode?.removeChild(oldVNode.el);
                }
            }
        }
    }
}