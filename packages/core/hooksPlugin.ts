import { each, isFunction } from 'lodash-es'
import shell from 'shelljs'

// 自定义插件：在打包前打包后执行一些操作
export default function hooksPlugin ({
    rmFiles = [],
    beforeBuild,
    afterBuild,
}: {
    rmFiles?: string[],
    beforeBuild?: Function,
    afterBuild?: Function,
}) {
    return {
        name: 'hooks-plugin',
        buildStart () {
            each(rmFiles, (fName) => shell.rm('-rf', fName))
            isFunction(beforeBuild) && beforeBuild()
        },
        buildEnd(err?: Error) {
            !err && isFunction(afterBuild) && afterBuild()
        }
    }
}