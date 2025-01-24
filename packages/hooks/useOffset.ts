import { type Ref, computed } from "vue";

interface UseOffsetOptions {
    offset: number;
    boxHeight: Ref<number>;
    getLastBottomOffset(): number;
}

interface UseOffsetResult {
    topOffset: Ref<number>;
    bottomOffset: Ref<number>;
}

export function useOffset(opts: UseOffsetOptions): UseOffsetResult {
    // 获取上一个message组件的bottomOffset
    const lastBottomOffset = computed(() => opts.getLastBottomOffset());

    const topOffset = computed(() => opts.offset + lastBottomOffset.value);

    const bottomOffset = computed(() => topOffset.value + opts.boxHeight.value);

    return {
        topOffset,
        bottomOffset,
    };
}

export default useOffset;