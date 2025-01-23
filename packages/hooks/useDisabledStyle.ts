import { each, isFunction, cloneDeep, assign } from "lodash-es";
import { watchEffect, useSlots, getCurrentInstance, type VNode } from "vue";

// 深度优先遍历
const _dfs = (nodes: VNode[], cb: (node: VNode) => void) =>
    each(nodes, (node) => {
        isFunction(cb) && cb(node);
        node.children && _dfs(node.children as VNode[], cb);
    });
    

// 动态地根据组件的 disabled 属性状态，为组件的子节点添加或移除特定的样式
export function useDisabledStyle() {
    // 用于存储desable属性为true的节点
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