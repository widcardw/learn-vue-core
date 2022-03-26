import { effectWatch, reactive } from "./core/reactivity"

interface Person {
    age: number;
}

let a = reactive({
    age: 18
}) as Person;

let b: number;

effectWatch(() => {
    b = a.age + 10;
    console.log(b);
})

a.age = 20;


const App = {
    render() {},
    setup() {}
}