import { VNode } from "./vnode";

export interface State {
    count: number
}

export type IObject = Object & { state: State }


export interface MyApp {
    render(context: IObject): VNode;
    setup(): IObject;
    mount?(rootContainer: HTMLElement | null): void;
}