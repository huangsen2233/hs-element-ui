import type { StoryObj, Meta } from "@storybook/vue3";

import { fn } from "@storybook/test";
import { HsTooltip } from "hs-element-plus";
import 'hs-element-plus/dist/theme/Tooltip.css'

type Story = StoryObj<typeof HsTooltip>;

const meta: Meta<typeof HsTooltip> = {
    title: "Example/Tooltip",
    component: HsTooltip,
    tags: ["autodocs"],
    argTypes: {
        trigger: {
            options: ["hover", "click", "contextmenu"],
            control: {
                type: "select",
            },
        },
        placement: {
            options: ["top", "bottom", "left", "right"],
            control: {
                type: "select",
            },
        },
    },
    args: {
        "onVisible-change": fn(),
    },
};

export const Default: Story = {
    args: {
        content: "This is a tooltip",
        placement: "top",
        trigger: "hover",
    },
    render: (args) => ({
        components: { HsTooltip },
        setup() {
            return {
                args,
            };
        },
        template: `
        <HsTooltip v-bind="args">
            <div style="height:30px;width:200px;background:red;padding:auto">trigger</div>
        </HsTooltip>
    `,
    }),
};

export default meta;