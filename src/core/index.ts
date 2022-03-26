import { effectWatch } from "./reactivity";
import { diff, mountElement } from "./renderer";
import { MyApp } from "./types/MyApp";
import { VNode } from "./types/vnode";

export function createApp(rootComponent: MyApp) {
    return {
        mount(rootContainer: HTMLElement | null) {
            if (!rootContainer) {
                throw new Error("rootContainer is null");
            }
            const context = rootComponent.setup();
            let isMounted = false;
            let prevSubTree: VNode;
            effectWatch(() => {
                // rootContainer.innerHTML = "";
                if (!isMounted) {  // 初始化的过程
                    isMounted = true;
                    // const element: HTMLElement = rootComponent.render(context);
                    // rootContainer.appendChild(element);
                    const subTree: VNode = rootComponent.render(context);
                    // console.log(subTree);
                    mountElement(subTree, rootContainer);
                    prevSubTree = subTree;  // 老的节点
                } else {
                    const subTree: VNode = rootComponent.render(context);  // 新的节点
                    diff(prevSubTree, subTree);
                    prevSubTree = subTree;  // 更新节点

                }
                console.log(rootContainer);
            })
        }
    }
}