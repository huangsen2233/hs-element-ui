# 介绍
该项目基于 Vue3 + TypeScript + Vite 构建，主要目的是提供一个基于 Vue3 的组件库。分享组件库搭建过程与思路，提高开发设计能力

# 项目亮点
Vite + Vitest + Vitepress 全工具链
monorepo 分包管理
github actions 实现 CI/CD "自动化部署"
“大模型”辅助设计与开发
发布一个“开箱即用”的 npm 包

# 技术实现
Button、Collapse “开胃菜” - 依赖注入，同步上下文信息
“反馈组件”“小高潮” - 指令式的范式来调用组件，我们日常开发业务封装的组件一般都是声明式调用
基于 Tooltip 衍生出的一系列“气泡弹出层”组件
Form 表单组件 “集大成者” - 依赖注入、开源库封装实现表单校验、“气泡弹出层”实现 Select 选择组件。

# 目录结构
为了扁平化，根目录创建 packages 这么一个 pnpm 工作区
    - components # 组件目录
    - core # npm 包入口
    - docs # 文档目录
    - hooks # 组合式API hooks 目录
    - locales # 国际化
    - play # 组件开发实验室
    - theme # 主题目录
    - utils # 工具函数目录

## packages/components
存放 SFC 单文件组件的目录文件，例如 Button 文件夹下：
    - Button.vue # 组件
    - Button.test.tsx # 单元测试
    - type.ts # 类型定义
    - style.css # 样式
    - constants.ts # 常量