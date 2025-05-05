import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, createApp } from "vue";

import { makeInstaller, withInstall, withInstallFunction } from "../install";

const AppComp = defineComponent({
    setup() {
        return () => <div>App</div>;
    },
})

const compA = withInstall(defineComponent({
    name: 'CompA',
    setup() {
        return () => <div>CompA</div>;
    },
}))

const compB = withInstall(defineComponent({
    name: 'CompB',
    setup() {
        return () => <div>CompB</div>;
    },
}))

const compC = withInstall(defineComponent({
    name: 'CompC',
    setup: () => () => <div>CompC</div>
}));

describe('makeInstaller', () => {
    it('should register multiple components when using installer', () => {
        const installer = makeInstaller([compA, compB, compC]);
        const app = createApp(AppComp);

        app.use(installer);
        app.mount(document.createElement('div'));

        // 验证组件注册状态
        expect(app._context.components.CompA).toBeTruthy();
        expect(app._context.components.CompB).toBeTruthy();
        expect(app._context.components.CompC).toBeTruthy();
    });

    it('should handle empty component list gracefully', () => {
        // 创建空组件安装器
        const emptyInstaller = makeInstaller([]);
        const app = createApp(AppComp);

        expect(() => {
            app.use(emptyInstaller);
        }).not.toThrow();
        });
});

describe('install', () => {
    it('withInstall should be worked', () => {
        const wrapper = mount(() => <div id="app"></div>)
        const app = createApp(AppComp)

        app.use(compA).mount(wrapper.element)

        expect(compA.install).toBeDefined()
        expect(compB.install).toBeDefined()
        expect(app._context.components['CompA']).toBeTruthy()
        expect(app._context.components['CompB']).toBeFalsy()
    })
    it('withInstall should throw error if component has no name', () => {
        const namelessComponent = withInstall(defineComponent({ 
            setup: () => () => <div>No Name</div>
        }));

        expect(() => {
            const app = createApp(AppComp);
            app.use(namelessComponent);
        }).toThrowError('Component must have a name property');
    });
})

describe('withInstallFunction', () => {
    it('should attach function to globalProperties', () => {
        const mockFn = () => console.log('test');
        const installedFn = withInstallFunction(mockFn, 'testFn');

        const app = createApp(AppComp);
        app.use(installedFn);
        expect(app.config.globalProperties.testFn).toBe(mockFn);
    });

    it('should avoid duplicate installation', () => {
        const mockFn = () => {};
        const installedFn = withInstallFunction(mockFn, 'testFn');

        const app = createApp(AppComp);
        app.use(installedFn).use(installedFn); // 重复安装

        expect(app.config.globalProperties.testFn).toBeDefined();
    });
});