---
title: Design Building System
authors: [Artichoke]
tags: [devlog]
date: 2026-11-18
---


游戏引擎是提供给游戏开发者开发游戏程序的，所以最终在开发者完成游戏开发后游戏引擎需要给出一个可运行的二进制程序。并且这个二进制程序能够加载，或者自包含游戏资产、美术等文件。

## 游戏发布模式

我们决定 Vulcal Engine 第一版 Building System 使用如下游戏发布模式：

### C++ Native 开发模式

目前 C++ Native 开发模式我们还没有进行很好的验证，现在用起来还是比较难用的，我们目前的简单想法是由开发者自行管理程序的发布，你编译好的 C++ 程序就是你的游戏。

### 编辑器开发模式

在游戏开发者使用 Vulcal Editor 完成游戏开发后我们可以在编辑器中找到 Build 按钮，如果没有配置 Build 信息，需要先填写 Build 信息，Build 信息可以保存在 `.vproj` 文件的 `build_info` 字段下面。

## Build Info 字段

Vulcal Engine 第一版 Building System 简单的 build info 应该包含下面的信息：

- 开启场景 `open_scene`：相对于 `.vproj` 路径 （必填）
- 构建产物输出路径 `build_dir`：绝对路径 （选填）默认输出在与 `.vproj` 的同级 `build` 目录
- 再想。（暂时先不支持交叉 Build。即只能发布构建平台的游戏，Windows 只能发布 Windows 版本）

## 调用 vulcal_build

如果已经填写好了 Build 信息，则编辑器会调用 `vulcal_build` CLI 程序。

`vulcal_build` 程序接受如下参数（编辑器调用应使用绝对路径）：

```shell
vulcal_build <project.vproj> <vulcal_player>
```

[Tag:TODO]
它会在 `build_dir` 输出一个 `.vpak` 的文件。`.vpak` 是一个 ZIP 压缩包格式，它打包压缩了 `.vproj` 中 `asset_dir` 下的文件，目前我们没有约束必须所有的 `assets` 都必须放在 `asset_dir` 下，所以这是未来我们需要补齐的。

## 标准项目结构与打包内容

通常对于如下一个标准的 Vulcal Game Project：

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

## .vmanifest 清单文件

`.vmanifest` 记录包格式版本、引擎版本、项目名、开启场景。通常长下面这样：

```yaml
version: 1.0
engine_version: "0.1.0"
name: "vulcal game"
open_scene: assets/scenes/test.vscene
```

## 发布产物与 vulcal_player

在打包完成后我们能得到一个 `.vpak` 文件。目前我们每个项目只能单独得到一个 `.vpak` 文件，如果我们未来能一直保持这样的设计那很好，使用 Vulcal Engine 开发出来的游戏发布起来将非常简单只需要包含一个 `.vpak` 文件，加一个我们的 `vulcal_player` 播放器程序。

`vulcal_player` 程序将会和 editor 等其他 vulcal app 一样放在 `apps` 目录下，开发者下载我们的编辑器时会随编辑器程序一起下载，顺便一说 `vulcal_build`，`model_viewer` 等程序也一并会同编辑器程序下载。

## 编辑器如何调用 vulcal_build

还记得我们说如果你在编辑器中填写好了 build 信息后，编辑器会尝试找到 `vulcal_build` 传递参数并调用，还记得我们需要什么参数吗？如下

`vulcal_build` 程序接受如下参数：

```shell
vulcal_build <project.vproj> <vulcal_player>
```

也就是说 `vulcal_editor` 需要传递两个参数给 `vulcal_build`，第一个参数是 `vulcal_editor` 目前打开的项目，第二个参数是 `vulcal_player` 程序的路径。

如果调用成功 `vulcal_build` 会在 `build_dir` 输出一个 `.vpak` 文件，并将 `vulcal_player` 程序复制到 `build_dir` 下。

## 启动游戏

对于 `vulcal_player` 它会自行尝试在 `vulcal_player` 可执行文件所在目录找到 `.vpak` 文件，如果没找到则启动失败。你也可以通过如下命令启动任何一个由 `vulcal_editor` 开发的游戏。

```shell
vulcal_player <vulcal_game.vpak>
```

如果使用参数启动，则优先使用参数的 `.vpak` 文件。

## 可执行程序路径查找

`vulcal_editor` 一般作为操作终端，它负责找到其它可运行程序的路径。我们可以通过 `SDL_GetBasePath()` 获得 `vulcal_editor` 运行的位置，通常其他可运行程序会与 `vulcal_editor` 在同一路径下，如果没找到则去环境变量中找，如果还没找到则返回找不到。

## 实现细节

具体的我们可以使用 [miniz](https://github.com/richgel999/miniz) 这个单文件库提供给我们的 zip 解压缩功能。 

[Tag:TODO]
目前我们的场景 序列化/反序列化 都放在 editor 下，并且还使用的是文本形式。最直接的做法就是将 场景序列化/反序列化 功能下沉到 kernel 内部，因为我们打包后的 `.vpak` 是直接使用 `.vscene` 的场景文本文件，所以运行时 `vulcal_player` 也需要这个功能适合放到 Kernel ，或者放到 apps/common 下。由于我们 `.lua` `.vscene` 都是文本文件，导致游戏玩家可以进行随意修改，如果开发者不想看到这种情况，我们想到了两种做法：

- 提供 `.lua` `.vscene` 二进制格式文件，如 `.vmatc` 一样，
- 对 `.vpak` 文件进行加密，在 `vulcal_build` 时提供 密码参数

但是第一版我们就不做这些了，我们不加密，并且直接使用 文本文件，即把 场景序列化/反序列化 直接移动到 kernel 。

### vulcal_build
`vulcal_build` 执行类似如下步骤：

1. 加载 `.vproj`
2. ~~先进行验证阶段，我们需要知道的前提是，目前我们没有强制约束 vulcal project 的文件分布，怎么组织全靠开发者自觉（未来我们打算强制将资源都放在 `assets_dir` 下），所以我们假设目前所有的开发者将资源都放入了 `assets_dir` 我们需要递归遍历 `assets_dir` 下的所有 `.vscene` 文件 判断其引用的资源是否存在，（以及资源引用的其他资源是否存在。这个我在 asset_pipeline 添加一个新的概念，叫做 assets_checker 用于判断资源是否能正确的进行打包，结果写入 `.vproj` 的某个字段中）~~(第一次实现先不管)
3. 如果加载成功则，再进行文件归档阶段（我们先假设所有的文件都符合要求），将我们上述 [标准项目结构与打包内容](#标准项目结构与打包内容) 提到的文件复制到 ``build_dir`，并收集字段并写入 `.vmanifest` 最后压缩为 `.vpak`

### ResourceProvider
由于我们在引入 `.vpak` 文件后，我们就会有两种资源寻址方式：
- 在 `vulcal_editor` 中，或者开发阶段，我们通常直接访问操作系统的文件系统。例如读取 assets/scenes/arena.vscene 时，在指定项目根目录下找到对应文件并返回内容。主要供编辑器和打包器使用。
- 在 `vulcal_player` 中，或者运行阶段，我们通常直接访问打包好的 `.vpak` 文件。打开 ZIP、建立条目索引；读取同一路径时，从 ZIP 中找到条目并在内存中解压返回，不需要先把整个包释放到磁盘。主要供 `vulcal_player` 使用。

所以我们可以设计一个 `ResourceProvider` 抽象接口，将资源从哪里来给统一起来，场景加载、Lua 执行、资产读取时只需要给它一个逻辑路径并读取内容，不必知道内容存放在普通目录还是 .pak 里。

```cpp
class ResourceProvider {
public:
    virtual ~ResourceProvider() = default;

    virtual bool contains(std::string_view path) const = 0;
    virtual std::vector<std::byte> read_binary(std::string_view path) const = 0;
    virtual std::string read_text(std::string_view path) const = 0;
};
```

提供两个实现：

- `DirectoryProvider`：编辑器和打包器读取项目目录。
- `PakProvider`：player 使用 miniz 打开 ZIP，建立中央目录索引，按需读取条目。

所有逻辑路径统一为 UTF-8、相对路径、正斜杠格式。

现有系统改为支持 provider：

- `SceneSerializer` 支持从 provider 读取文本。
- `AssetLibrary`/`AssetManager` 支持从 provider 读取 cooked 二进制。
- `MeshAsset`、`MaterialAsset`、`TextureAsset` 增加内存数据读取入口。
- `ScriptRuntime` 支持从 provider 读取 Lua 源码，并使用内存脚本执行。
- 现有基于文件路径的 API 保留为 `DirectoryProvider` 兼容包装。