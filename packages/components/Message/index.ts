import message from "./methods";
import { withInstallFunction } from "@hs-element-ui/utils";

export const HsMessage = withInstallFunction(message, "$message");

export * from "./types";