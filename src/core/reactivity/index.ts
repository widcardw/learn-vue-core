// 响应式库

let currentEffect: Function | null = null;

// 依赖
class Dep {
    effects: Set<Function>;
    private _val: number;
    constructor(value?: number) {
        this.effects = new Set();
        this._val = value || 0;
    }
    get value(): number {
        this.depend();   // 则需要在 get 中收集依赖
        return this._val;
    }
    set value(newValue: number) {
        this._val = newValue;
        this.notify();  // 在值更新完成之后触发依赖
    }
    // 1. 收集依赖
    depend() {
        if (currentEffect) {
            this.effects.add(currentEffect);
        }
    }
    // 2. 触发依赖
    notify() {
        // 触发之前收集的依赖
        this.effects.forEach(effect => effect());
    }
}


// 收集依赖
export function effectWatch(effect: Function) {
    // 收集依赖
    currentEffect = effect;
    effect();
    // dep.depend();  // 尝试不在这里收集依赖 1
    currentEffect = null;
}


/////////// test ///////////

// const dep = new Dep(10);

// let b: number;

// effectWatch(() => {
//     // console.log('effect');
//     b = dep.value + 10;
//     console.log(b)
// })

// // 变更检测
// dep.value = 20;
// dep.value = 30;


// reactivity
// 针对对象的响应式
// object -> key -> dep

// 1. 这个对象在什么时候改变
// 使用 Proxy

const targetMap = new Map<Object, Map<any, Dep>>();

function getDep(target: Object, key: any) {
    let depsMap = targetMap.get(target);

    if (!depsMap) {  // 在第一次的时候需要对它进行初始化 
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap && depsMap.get(key);

    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep); // 存储依赖
    }

    return dep;
}

export function reactive(raw: Object) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            // console.log(key)
            // 一个 key 需要对应一个 dep
            // 涉及到 dep 存储在哪里
            const dep = getDep(target, key);
            // 做依赖收集
            dep.depend();
            // 返回值
            return Reflect.get(target, key, receiver);  // 相当于 target[key]
        },
        set(target, key, value, receiver) {  // 触发依赖  
            // 要获取到 dep 
            const dep = getDep(target, key);
            // 更改值
            const result = Reflect.set(target, key, value, receiver);
            // 触发依赖，通知
            dep.notify();
            // 返回值
            return result;
        }
    })
}

/////////// test ///////////

// interface Person {
//     name: string;
//     age: number;
// }

// const user = reactive({
//     name: '张三',
//     age: 18,
// }) as Person;


// let double: number;
// effectWatch(() => {
//     double = user.age;  // 被 get 拦截
//     console.log("reactivity", double);
// })

// user.age = 19;  // 会被 set 拦截
