import type { Meta, StoryObj } from "@storybook/vue3"
import { HsCollapse, HsCollapseItem } from "hs-element-ui"
// import 'hs-element-ui/dist/theme/Collapse.css'

import 'hs-element-ui/dist/theme/Collapse.css'

type Story = StoryObj<typeof HsCollapse>;

const meta: Meta<typeof HsCollapse> = {
    title: "Example/Collapse",
    component: HsCollapse,
    subcomponents: { HsCollapseItem },
    tags: ["autodocs"],
};

export const Default: Story = {
    render: (args) => ({
        components: {
            HsCollapse,
            HsCollapseItem,
        },
        setup() {
            return {
                args,
            };
        },
        template: `
            <hs-collapse v-bind="args">
            <hs-collapse-item name="a" title="Title a">
                <div>this is content a</div>
            </hs-collapse-item>
            <hs-collapse-item name="b" title="title b">
                <div>this is content b</div>
            </hs-collapse-item>
            <hs-collapse-item name="c" title="title c  disable" disabled>
                <div>this is content c</div>
            </hs-collapse-item>
            </hs-collapse>
        `,
    }),
    args: {
        accordion: true,
        modelValue: ["a"],
    },
    };

export default meta;