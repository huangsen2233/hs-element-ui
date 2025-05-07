import type { Language, TranslatePair } from "@hs-element-ui/locale";

export interface ConfigProviderProps {
    locale?: Language;
    extendsI18nMsg?: TranslatePair;
}