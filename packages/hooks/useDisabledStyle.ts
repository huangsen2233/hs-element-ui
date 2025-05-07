import { each, isFunction, cloneDeep, assign } from "lodash-es";
import { watchEffect, useSlots, getCurrentInstance, type VNode } from "vue";

// 深度优先遍历
const _dfs = (nodes: VNode[], cb: (node: VNode) => void) =>
    each(nodes, (node) => {
        isFunction(cb) && cb(node);
        node.children && _dfs(node.children as VNode[], cb);
    });

// 根据组件的 disabled 属性，给子组件添加或移除的样式
export function useDisabledStyle() {
    // 存储 disabled 属性为 true 的节点和其原始的 props
    const nodePropsMap = new Map();

    const instance = getCurrentInstance();
    const children = useSlots()?.default?.();

    watchEffect(() => {
        if (!instance?.props.disabled) {
            _dfs(children ?? [], (node) => {
                if (!nodePropsMap.has(node)) return;
                // dropdown 组件的 disabled 属性为 false 时，恢复原始的 props
                node.props = nodePropsMap.get(node);
            });
            return;
        }
        // dropdown 组件的 disabled 属性为 true
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