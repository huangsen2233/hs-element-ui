import type { Component, Ref } from "vue";

export type ButtonType = "primary" | "success" | "warning" | "danger" | "info";
export type NativeType = "button" | "reset" | "submit";
export type ButtonSize = "large" | "default" | "small";

export interface ButtonProps {
    tag?: string | Component;
    type?: ButtonType;
    size?: ButtonSize;
    nativeType?: NativeType;
    disabled?: boolean;
    loading?: boolean;
    circle?: boolean;
    plain?: boolean;
    round?: boolean;
    autofocus?: boolean;
    useThrottle?: boolean;
    throttleDuration?: number;
    icon?: string;
    loadingIcon?: string;
}

export interface ButtonEmits {
    (e: "click", event: MouseEvent): void; 
}

export interface ButtonInstance {
    ref: Ref<HTMLButtonElement | void>;
}