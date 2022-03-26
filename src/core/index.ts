import { effectWatch } from "./reactivity";
import { MyApp } from "./types/MyApp";

export function createApp(rootComponent: MyApp) {
    return {
        mount(rootContainer: HTMLElement | null) {
            if (!rootContainer) {
                throw new Error("rootContainer is null");
            }
            const context = rootComponent.setup();
            effectWatch(() => {
                rootContainer.innerHTML = "";
                const element: HTMLElement = rootComponent.render(context);
                rootContainer.appendChild(element);
            })
        }
    }
}