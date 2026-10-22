---
title: Asset Pipeline V1
description: 初步构建 Asset Pipeline
---

## Abstract
在游戏开发中我们通常会用到大量的美术资源，如模型、纹理、音效等等。通常我们需要将这些资源在进入游戏时加载到 RAM 中，所以你在进入游戏的时候通常需要等上那么一会，就是游戏的 Runtime 在加载被游戏引擎打包好的资源。通常在进入游戏的时候不会加载游戏中的所有资源，Runtime 只会加载此时需要的资源，否则 RAM 将很快被撑满。我们都知道很多游戏都是用游戏引擎开发的，那么资源处理问题就是引擎需要考虑的了，引擎需要管理资源的加载，卸载，更新等等。如何设计一个高效的，简单的，快速的 Asset Pipeline 是一个重要的问题。在这篇文章中记载了 Vulcal Engine 的 Asset Pipeline 设计构思，以及最终架构。

## Motivation
我给 Vulcal Engine 的定位是结构清晰、设计优雅、简单易用。所以我们不能设计出一个庞然大物、结构复杂、各种模块交织在一起的东西（至少现在不能，我不知道未来会演变成什么样）。所以 Asset 模块，后面都叫做 Asset Pipeline ，我不清楚其他游戏引擎的 Asset 模块叫什么，但我将 Vulcal Engine 的 Asset 模块称作 Asset Pipeline ，至于为什么这么叫，因为头脑里对资源的处理的样子就像将 Asset 交给一条流水线管线一样经过处理变成 Engine 内部可用的形式。

### How does a Asset Pipeline work
Asset Pipeline 的工作是将外部 资源 如模型文件（obj,GLTF,FBX 等）、图像文件（png,jpg,dds 等）、音频文件（mp3,wav,flac 等）通过处理变成引擎内部可识别资产，一方面不同的引擎独立的维护着自己对资源的解释方式，如 Mesh 的顶点布局等，另一方面引擎希望统一同一类型的资源，而统一方式就是使用引擎自己定义的对资源的解释方式。

我不希望 Runtime 直接通过 Asset Pipeline 加载，因为 Asset Pipeline 是开发游戏期间 (Editor) 需要的功能，而在 Runtime 期间完全用不上，所以给 Runtime 使用 Asset Pipeline 完全多余。

我们需要考虑 Runtime 如何加载资源，另一个需要考虑的是我们未来也会提供使用 Engine Core Libaray 使用 Native C++ 开发游戏的方式，但这种方式就完全不能让在编写 C++ 代码的时候再去使用 Asset Pipeline 去处理外部 Asset 文件，这会让开发者感觉到割裂这种方式在我看来完全不优雅，我认为只需要解决 Native C++ 的 Asset 加载问题，Runtime 如何加载资源的问题也就能一并解决。

首先参考其他游戏引擎，他们的 Runtime 都会直接加载一个将资源全部打包到 .pak 后的文件