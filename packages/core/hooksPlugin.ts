import { each, isFunction } from 'lodash-es'
import shell from 'shelljs'

// 插件：打包前删除一些文件夹
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