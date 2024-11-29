import { computed, ref } from "vue";

const zIndex = ref(0);

// 组件样式 z-index 的值
export function useZIndex(initVal = 2000) {
    const _initVal = ref(initVal);
    const currentZIndex = computed(() => zIndex.value + _initVal.value);

    const nextZIndex = () => {
        zIndex.value++;
        return currentZIndex.value;
    };

    return {
        initialValue: _initVal,
        currentZIndex,
        nextZIndex,
    };
}

export default useZIndex;