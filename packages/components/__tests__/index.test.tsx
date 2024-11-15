import type { Plugin } from "vue";
import { describe, it, expect } from "vitest";
import {
    HsAlert,
    HsButton,
    HsButtonGroup,
    HsCollapse,
    HsCollapseItem,
    HsIcon,
    // HsTooltip,
} from "../index";
import { get, map } from "lodash-es";

const comps = [
    HsAlert,
    HsButton,
    HsButtonGroup,
    HsCollapse,
    HsCollapseItem,
    HsIcon,
    // HsTooltip
] as Plugin[];

describe("components/index", () => {
    it.each(map(comps, (c) => [get(c, "name") ?? "", c]))(
        "%s should be exported",
        (_, component) => {
            expect(component).toBeDefined();
            expect(component.install).toBeDefined();
        }
    );
});