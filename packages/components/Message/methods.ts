import { isVNode, render, h, shallowReactive } from "vue";
import type {
    CreateMessageProps,
    MessageInstance,
    MessageFn,
    Message,
    MessageParams,
    MessageProps,
    MessageHandler,
    MessageType,
} from "./types";
import { messageTypes } from "./types";
import { useId, useZIndex } from "@hs-element-ui/hooks";
import { isString, findIndex, set, each, get } from "lodash-es";
import MessageConstructor from "./Message.vue";

// 存放实例的数组
const instances: MessageInstance[] = shallowReactive([]);

const { nextZIndex } = useZIndex();

export const messageDefaults = {
    type: "info",
    duration: 3000,
    offset: 10,
    transitionName: "fade-up",
};

// 规范化 options
const normalizedOptions = (opts: MessageParams): CreateMessageProps => {
    const result =
        !opts || isVNode(opts) || isString(opts)
            ? { message: opts }
            : opts;
    return { ...messageDefaults, ...result } as CreateMessageProps;
};

// 创建 message 实例
const createMessage = (props: CreateMessageProps): MessageInstance => {
    const id = useId().value;
    const container = document.createElement("div");

    // 销毁实例
    const destory = () => {
        const idx = findIndex(instances, { id });
        if (idx === -1) return;

        instances.splice(idx, 1);
        render(null, container);
    };

    const _props: MessageProps = {
        ...props,
        id,
        zIndex: nextZIndex(),
        onDestory: destory,
    };
    // h 函数生成vnode
    const vnode = h(MessageConstructor, _props);
    // render 函数生成 vnode树
    render(vnode, container);

    document.body.appendChild(container.firstElementChild!);

    const vm = vnode.component!;
    const handler: MessageHandler = {
        // 关闭
        close: () => vm.exposed!.close(),
    };
    const instance: MessageInstance = {
        props: _props,
        id,
        vm,
        vnode,
        handler,
    };
    instances.push(instance)
    return instance
};

// 获取上一个 message 的 bottomOffset
export function getLastBottomOffset(this: MessageProps) {
    const idx = findIndex(instances, { id: this.id });
    if (idx <= 0) return 0;
    // get 访问对象指定属性的值
    return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}

export const message: MessageFn & Partial<Message> = (options = {}) => {
    const normalized = normalizedOptions(options);
    const instance = createMessage(normalized);

    return instance.handler;
}

export function closeAll(type?: MessageType) {
    each(instances, (instance) => {
        if (type) {
            instance.props.type === type && instance.handler.close();
            return;
        }
        instance.handler.close();
    });
}
message.closeAll = closeAll;

// 设置 message 类型
each(messageTypes, (type) => {
    // set 设置对象的属性值
    set(message, type, (opts: MessageParams) => {
        const normalized = normalizedOptions(opts);
        return message({ ...normalized, type });
    });
});

export default message as Message;