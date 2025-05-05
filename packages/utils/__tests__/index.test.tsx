import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, h } from "vue";
import {
    debugWarn,
    throwError,
    withInstall,
    typeIconMap,
    RenderVnode,
} from "../index";
import { each } from "lodash-es";

const TestComponent = defineComponent({
    name: 'TestComponent', // 明确命名
    template: '<div class="test-component">Test Component</div>'
});

const SlotComponent = defineComponent({
    setup(_, { slots }) {
      return () => slots.default?.(); // 返回插槽的虚拟节点
    },
});

describe("RenderVnode", () => {
    it("should render string vNode", () => {
        const wrapper = mount(RenderVnode, {
            props: { vNode: "Hello World" }
        });
        expect(wrapper.text()).toBe("Hello World");
    });

    it("should render object vNode from slots", () => {
        // 创建包含插槽的虚拟节点对象
        const slotVNode = h(SlotComponent, {}, () => h('div', {}, 'Slot Content'));

        const wrapper = mount(RenderVnode, {
            props: {
            vNode: slotVNode // 传入对象类型的 vNode
            }
        });

        // 验证是否渲染了插槽内容
        expect(wrapper.findComponent(SlotComponent).exists()).toBe(true);
        expect(wrapper.text()).toContain('Slot Content');
    });

    it("should render function vNode by invoking it", () => {
        const dynamicFn = () => h('span', { class: 'dynamic' }, 'Function Result');

        const wrapper = mount(RenderVnode, {
            props: { vNode: dynamicFn }
        });

        expect(wrapper.find('span.dynamic').exists()).toBe(true);
        expect(wrapper.text()).toBe('Function Result');
    });

});

describe("utils/index", () => {
    it("debugWarn should be exported", () => {
        expect(debugWarn).toBeDefined();
    });
    it("throwError should be exported", () => {
        expect(throwError).toBeDefined();
    });
    it("withInstall should be exported", () => {
        expect(withInstall).toBeDefined();
    });
    it("typeIconMap should be worked", () => {
        expect(typeIconMap).toBeDefined();
        each(
            [
                ["info", "circle-info"],
                ["success", "check-circle"],
                ["warning", "circle-exclamation"],
                ["danger", "circle-xmark"],
                ["error", "circle-xmark"],
            ],
            ([type, icon]) => {
                expect(typeIconMap.get(type)).toBe(icon);
            }
        );
    });
});