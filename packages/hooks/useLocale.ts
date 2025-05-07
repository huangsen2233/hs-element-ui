import { inject, ref, unref, computed, type Ref } from "vue";
import { omit } from "lodash-es";
import { createI18n, i18nSymbol, type I18nInstance } from "vue3-i18n";
import type { Language } from "@hs-element-ui/locale";
import English from "@hs-element-ui/locale/lang/en";

// 移除 i18nInstance 实例上的 install 方法
const omitInstall = (obj: I18nInstance) => omit(obj, "install");

// 实现国际化
export function useLocale(localeOverrides?: Ref<Language>) {
    if (!localeOverrides) {
        const i18n: Ref<I18nInstance> =
            inject(i18nSymbol) ??
            ref(createI18n({ locale: English.name, messages: { en: English.el } }));

        return computed(() => omitInstall(unref(i18n)));
    }

    return computed(() =>
        omitInstall(
            createI18n({
                locale: localeOverrides.value.name,
                messages: {
                    en: English.el,
                    [localeOverrides.value.name]: localeOverrides.value.el,
                },
            })
        )
    );
}

export default useLocale;