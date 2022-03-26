export interface State {
    count: number
}

export type IObject = Object & { state: State }


export interface MyApp {
    render(context: IObject): HTMLElement;
    setup(): IObject;
    mount?(rootContainer: HTMLElement | null): void;
}