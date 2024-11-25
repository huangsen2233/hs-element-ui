import { type Ref, computed } from "vue";

const defaultIdInjection = {
    prefix: Math.floor(Math.random() * 10000),
    current: 0,
};

// 提供给 DropdownItem 组件的属性 command 的默认id
export function useId(namespace: string = "er"): Ref<string> {
    const idRef = computed(
        () =>
            `${namespace}-${defaultIdInjection.prefix}-${defaultIdInjection.current++}`
    );
    return idRef;
}

export default useId;