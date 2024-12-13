import Notification from "./methods";
import { withInstallFunction } from '@hs-element-ui/utils'

export const HsNotification = withInstallFunction(Notification, '$notify')

export * from './types'