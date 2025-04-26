import { nextTick } from "vue";

// rAF 函数用于浏览器重绘后和 Vue 的 DOM 更新完成后执行逻辑
// requestAnimationFrame 的作用: 浏览器会在下一次重绘前执行回调，确保 DOM 更新或动画已处理
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