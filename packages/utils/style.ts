import { isNumber, isString } from "lodash-es";
import { debugWarn } from "./error";

const SCOPE = "utils/style" as const;

// 判断字符串内容是否为数字
const isStringNumber = (val: string): boolean => {
    if (!isString(val)) {
        return false;
    }
    return !Number.isNaN(Number(val));
};

// 给数字添加单位 px
export function addUnit(val?: string | number, defaultUnit = "px") {
    if (!val) return "";
    if (isNumber(val) || isStringNumber(val)) {
        return `${val}${defaultUnit}`;
    }
    if (isString(val)) {
        return val;
    }
    debugWarn(SCOPE, "binding value must be a string or number");
}