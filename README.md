# BMI 计算器

一个简单的网页版 BMI 计算器，可以帮助用户计算和了解自己的身体质量指数（BMI）。

## 功能

- 输入身高和体重
- 计算 BMI 值
- 显示体重状态分类

## 未来计划

- 添加科学体重建议功能
- 集成大模型 API
- 考虑更多健康指标（年龄、性别、血压等）

## 部署

本项目使用 GitHub Pages 部署。每次当你推送代码到 `main` 分支时，GitHub Actions 会自动构建并将网站部署到 GitHub Pages。

访问地址：[your-github-username.github.io/bmi-calculator]  （请替换 `your-github-username` 为你的 GitHub 用户名，`bmi-calculator` 为你的仓库名）

## API 密钥配置

**安全警告：请勿将真实的 API 密钥直接提交到公共代码仓库！**

本项目使用了第三方 API 来提供健康建议功能。你需要配置 API 密钥才能使该功能正常工作。

1.  **获取 API 密钥**:  你需要注册并获取第三方 API 的密钥。请将你的 API 密钥替换 `js/main.js` 文件中的 `__API_KEY__` 占位符。
2.  **配置 API Endpoint**:  同样，你需要将 API 的 Endpoint 替换 `js/main.js` 文件中的 `__API_ENDPOINT__` 占位符。

**再次强调，目前 API 密钥是直接硬编码在前端代码中的，这** **非常不安全** **。  在实际项目中，请务必使用更安全的 API 密钥管理方式，例如使用后端代理。**

## 使用方法

1.  访问 GitHub Pages 部署的网页 [your-github-username.github.io/bmi-calculator]
2.  输入您的身高（厘米）
3.  输入您的体重（公斤）
4.  点击 "计算 BMI" 按钮
5.  查看 BMI 结果和健康建议 (如果 API 密钥配置正确)
6.  浏览健康知识文章

## 技术栈

- HTML
- CSS
- JavaScript

## 部署

本项目使用 GitHub Pages 部署，访问地址：[bmicalculatorz.pages.dev] 