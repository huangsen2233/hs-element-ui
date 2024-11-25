import { each, isFunction, cloneDeep, assign } from "lodash-es";
import { watchEffect, useSlots, getCurrentInstance, type VNode } from "vue";

// 深度优先遍历
const _dfs = (nodes: VNode[], cb: (node: VNode) => void) =>
    each(nodes, (node) => {
        isFunction(cb) && cb(node);
        node.children && _dfs(node.children as VNode[], cb);
    });
    
// 组件禁用状态下的样式
export function useDisabledStyle() {
    const nodePropsMap = new Map();

    const instance = getCurrentInstance();
    const children = useSlots()?.default?.();

    watchEffect(() => {
        if (!instance?.props.disabled) {
            _dfs(children ?? [], (node) => {
                if (!nodePropsMap.has(node)) return;
                node.props = nodePropsMap.get(node);
            });
            return;
        }
        _dfs(children ?? [], (node) => {
            if (!node?.props) return;

            nodePropsMap.set(node, cloneDeep(node.props));
            node.props = assign(node?.props, {
                style: {
                    cursor: "not-allowed",
                    color: "var(--er-text-color-placeholder)",
                },
            });
        });
    });
}

export default useDisabledStyle;