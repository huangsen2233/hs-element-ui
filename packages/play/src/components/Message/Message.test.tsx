import { describe, test, expect } from "vitest";
import { message, closeAll } from "./methods";
import { rAF } from "@hs-element-ui/utils";

// 获取元素top值
function getTopValue(element: Element) {
    // getComputedStyle 返回一个对象，包含了元素的css属性值
    const styles = window.getComputedStyle(element);
    const topValue = styles.getPropertyValue("top");
    return Number.parseFloat(topValue);
}

describe("Message", () => {
    test("message() function", async () => {
        const handler = message({ message: "hello msg", duration: 0 });
        await rAF();
        expect(document.querySelector(".er-message")).toBeTruthy();
        handler.close();
        await rAF();
        expect(document.querySelector(".er-message")).toBeFalsy();
    });

    test("call message() function more than once", async () => {
        message({ message: "hello msg", duration: 0 });
        message({ message: "hello msg1", duration: 0 });
        await rAF();
        expect(document.querySelectorAll(".er-message").length).toBe(2);
        closeAll();
        await rAF();
        expect(document.querySelector(".er-message")).toBeFalsy();
    });

    test("message offset", async () => {
        message({ message: "hello msg", duration: 0, offset: 100 });
        message({ message: "hello msg", duration: 0, offset: 50 });

        await rAF();
        const elements = document.querySelectorAll(".er-message");
        expect(elements.length).toBe(2);

        expect(getTopValue(elements[0])).toBe(100);
        expect(getTopValue(elements[1])).toBe(150);
    });
});