import { nextTick } from "vue";

// 函数用于浏览器重绘后和 Vue 的 DOM 更新完成后执行逻辑
export const rAF = async () => {
    return new Promise((res) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(async () => {
                res(null);
                await nextTick();
            });
        });
    });
};