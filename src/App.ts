import { effectWatch, reactive } from "./core/reactivity/index"

// interface Person {
//     age: number;
// }

// let a = reactive({
//     age: 18
// }) as Person;

// let b: number;

// effectWatch(() => {
//     b = a.age + 10;
//     console.log(b);
// })

// a.age = 20;




// Vue3


type IWindow = Window & typeof globalThis & { state: State };

import { State, IObject, MyApp } from "./core/types/MyApp";

export default  {
    render(context: IObject) {
        // view 每次都要重新创建
        // 要计算出最小的更新节点 vdom：diff 算法
        // 构建视图
        const div = <HTMLElement>document.createElement("div")
        div.innerHTML = "" + context.state.count;
        return div;
    },
    setup() {
        const state = reactive({
            count: 0
        }) as State;
        (window as IWindow).state = state;
        return {
            state
        }
    }
}

