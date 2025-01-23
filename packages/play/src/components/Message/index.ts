import Message from "./methods";
import { withInstallFunction } from "@hs-element-ui/utils";

export const HsMessage = withInstallFunction(Message, "$message");

export * from "./types";