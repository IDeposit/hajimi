# 🚀 HAJIMI Gemini API Proxy

这是一个基于 FastAPI 构建的 Gemini API 代理，旨在提供一个简单、安全且可配置的方式来访问 Google 的 Gemini 模型。适用于在 Hugging Face Spaces 上部署，并支持openai api格式的工具集成。

感谢[@warming-afternoon](https://github.com/warming-afternoon)在技术上的大力支持
###  使用文档
- [【推荐】huggingface的使用文档（手机电脑均可使用）](./wiki/huggingface.md)
- [docker部署的使用文档（服务器自建使用）](./wiki/docker.md) 感谢**北极星星**编写
- [termux部署的使用文档（手机使用）](./wiki/Termux.md) 感谢[@天命不又](https://github.com/tmby)编写
- [zeabur部署的使用文档(需付费)](./wiki/zeabur.md) 感谢**墨舞ink**编写
- [Claw Cloud部署的使用文档](./wiki/claw.md) 感谢[@IDeposit](https://github.com/IDeposit)编写
###  更新日志

* v0.1.2beta
    * 为非流式和假流式传输模式新增动态并发功能，用户可自定义初始并发请求数。在全部请求失败时，系统将增加并发请求数，直至达到最大并发请求数。当收到请求时，程序会首先尝试并发处理，若并发处理失败，则根据设定逐步增加并发数。
    * 重构请求处理逻辑，现在能够正确处理各个模式的请求。
    * 新增手动重置统计数据按钮，用户可在点击按钮后输入password重置统计数据
    * 前端环境配置栏目将展示更多功能配置，同时展示卡可折叠
    * 修改重置统计数据时间为北京时间15点
    * 修复若干bug
    * 新增环境变量`CONCURRENT_REQUESTS`用于设置默认的并发请求数，初始默认值为1。
    * 新增环境变量`INCREASE_CONCURRENT_ON_FAILURE`用于设置当请求失败时增加的并发请求数，初始默认值为1。
    * 新增环境变量`MAX_CONCURRENT_REQUESTS`用于设置允许的最大并发请求数，初始默认值为3。

*   v0.1.1
    * 新增联网模式,为所有gemini2.x模型提供联网能力，在模型列表中选择-serach后缀的模型启用
    * 新增环境变量`SERACH_MODE`是否启用联网模式，默认为true
    * 新增环境变量`SERACH_PROMPT`为联网模式提示词，默认为`（使用搜索工具联网搜索，需要在content中结合搜索内容）`
*   v0.1.0
    * 使用vue重写前端界面，适配移动端
    * 前端界面添加黑夜模式
    * 支持为多模态模型上传图片
    * 可用秘钥数量将异步更新，防止阻塞进程
    * 这次真能北京时间16点自动重置统计数据了
    * 为api秘钥使用统计新增模型使用统计，可分别统计使用不同模型的次数
    * 修改默认api可用次数为100次
    * 降低默认伪装信息长度为5，以减少对上下文的污染

* 历史版本更新日志请查看[update](./wiki/update.md)

## ✨ 主要功能：

### 🔑 API 密钥轮询和管理

### 📑 模型列表接口

### 💬 聊天补全接口：

*   提供 `/v1/chat/completions` 接口，支持流式（streaming）和非流式响应，与 OpenAI API 格式兼容。
*   自动将 OpenAI 格式的请求转换为 Gemini 格式。

### 🔒 密码保护（可选）：

*   通过 `PASSWORD` 环境变量设置密码。
*   提供默认密码 `"123"`。

### 🚦 速率限制和防滥用：

*   通过环境变量自定义限制：
    *   `MAX_REQUESTS_PER_MINUTE`：每分钟最大请求数（默认 30）。
    *   `MAX_REQUESTS_PER_DAY_PER_IP`：每天每个 IP 最大请求数（默认 600）。
*   超过速率限制时返回 429 错误。

### 🧩 服务兼容

*   提供的接口与 OpenAI API 格式兼容,便于接入各种服务

## ⚠️ 注意事项：

*   **强烈建议在生产环境中设置 `PASSWORD` 环境变量，并使用强密码。**
*   根据你的使用情况调整速率限制相关的环境变量。
*   确保你的 Gemini API 密钥具有足够的配额。
