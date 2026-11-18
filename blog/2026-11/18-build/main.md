---
title: Design Building System
authors: [Artichoke]
tags: [release]
date: 2026-11-18
---

游戏引擎是提供给游戏开发者开发游戏程序的，所以最终在开发者完成游戏开发后游戏引擎需要给出一个可运行的二进制程序。并且这个二进制程序能够加载，或者自包含游戏资产、美术等文件。

## 游戏发布模式
我们决定 Vulcal Engine 第一版 Building System 使用如下游戏发布模式：

### C++ Native 开发模式
目前 C++ Native 开发模式我们还没有进行很好的验证，现在用起来还是比较难用的，当我们目前的简单想法是由开发者自行管理程序的发布，你编译好的 C++ 程序就是你的游戏。

### 编辑器开发模式
在游戏开发者使用 Vulcal Editor 完成游戏开发后我们可以在编辑器中找到 Build 按钮，如果没有配置 Build 信息，需要先填写 Build 信息，Build 信息可以保存在 .vproj 文件的 build_info 字段下面。

Vulcal Engine 第一版 Builind System 简单的 build info 应该包含下面的信息：
- 开启场景 `open_scene`：相对于 .vproj 路径 （必填）  
- 构建产物输出路径 `build_dir` : 绝对路径 （选填）默认输出在与 `.vproj` 的同级 `build` 目录    
- 再想。（暂时先不支持交叉 Build。即只能发布构建平台的游戏，Windows 只能发布 Windows 版本）    

如果已经填写好了 Build 信息，则编辑器会调用 vulcal_build CLI 程序。

vulcal_build 程序接受如下参数 (编辑器调用应使用绝对路径)：
```shell
vulcal_build <project.vproj> <vulcal_player>
```

[Tag:TODO]  
它会在 `build_dir` 输出一个 `.vpak` 的文件。`.vpak` 是一个 ZIP 压缩包格式，它打包压缩了 `.vproj` 中 `asset_dir` 下的文件，目前我们没有约束必须所有的 `assets` 都必须放在 `asset_dir` 下，所以这是未来我们需要补齐的。

通常对于如下一个标准的 Vulcal Game Project :
```
vulcal_game/
├── .git/
├── .vulcal_engine/
│   ├── 123.vtex
│   ├── 456.vmatc
│   └── 789.vmesh
├── assets/
│   ├── materials/
│   │   ├── test.vmat
│   │   └── test.vmat.meta
│   ├── meshes/
│   │   ├── test.obj
│   │   └── test.obj.meta
│   ├── scenes/
│   │   └── test.vscene
│   ├── scripts/
│   │   └── test.lua
│   └── textures/
│       ├── test.png
│       └── test.png.meta
├── vulcal_game.vproj
└── .gitignore
```

通常 `vulcal_build` 会收集一个标准的 Vulcal Game Project 中的 `.vulcal_engine`、`assets` 目录下的所有 `scene`、`Lua` 最后打包成 `.vpak` ZIP 压缩文件，通常你可以直接解压这个文件，能得到如下结果。

```
vulcal_game/
├── .vulcal_engine/
│   ├── 123.vtex
│   ├── 456.vmatc
│   └── 789.vmesh
├── assets/
│   ├── scenes/
│   │   └── test.vscene
│   └── scripts/
│       └── test.lua
└── vulcal_game.vmanifest
```

`.vmanifest` 记录包格式版本、引擎版本、项目名、开启场景。通常长下面这样：
```yaml
version: 1.0
engine_version: "0.1.0"
name: "vulcal game"
open_scene: assets/scenes/test.vscene
```

在打包完成后我们能得到一个 `.vpak` 文件。目前我们每个项目只能单独得到一个 `.vpak` 文件，如果我们未来能一直保持这样的设计那很好，使用 Vulcal Engine 开发出来的游戏发布起来将非常简单只需要包含一个 `.vpak` 文件，加一个我们的 `vulcal_player` 播放器程序。

`vulcal_player` 程序将会和 editor 等其他 vulcal app 一样放在 `apps` 目录下，开发者下载我们的编辑器时会随编辑器程序一起下载，顺便一说 `vulcal_build`，`model_viewer` 等程序也一并会同 编辑器程序 下载。

还记得我们说如果你在编辑器中填写好了 build 信息后，编辑器会尝试找到 `vulcal_build` 传递参数并调用，还记得我们需要什么参数吗？如下

vulcal_build 程序接受如下参数：
```shell
vulcal_build <project.vproj> <vulcal_player>
```

也就是说 `vulcal_editor` 需要传递两个参数给 `vulcal_build` 第一个参数是 `vulcal_editor` 目前打开的项目，第二个参数是 `vulcal_player` 程序的路径。

如果调用成功 `vulcal_build` 会在 `build_dir` 输出一个 `.vpak` 文件，并将 `vulcal_player` 程序复制到 `build_dir` 下。

对于 `vulcal_player` 它会自行尝试在 `vulcal_player` 可执行文件所在目录找到 `.vpak` 文件，如果没找到则启动失败。你也可以通过，如下命令启动任何一个由 `vulcal_editor` 开发的游戏。

```shell
vulcal_player <vulcal_game.vpak> 
```

如果使用参数启动，则优先使用参数的 `.vpak` 文件