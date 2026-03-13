# SimonHome Site 图标统一圆角方形设计

## 目标
- 统一 Site 卡片右侧图标的形态，解决长方形图标突兀问题。
- 仅通过 CSS 调整，无需修改 HTML 结构。

## 范围
- 修改 `D:\TuDou\SimonHome\static\css\style.css`。
- 仅影响 `.projectItemRight img` 的展示。

## 设计方案
- 固定尺寸：50px × 50px（保持现有视觉比例）。
- 圆角方形：`border-radius: 12px`。
- 内容适配：`object-fit: contain`，避免裁切图标。
- 背景与留白：增加柔和背景与内边距，统一透明/长方形图标的观感。

## 验证方式
1. 打开主页，观察 Site 卡片图标是否统一为圆角方形。
2. 确认长方形图标不再突兀。
3. Hover 动效保持正常（旋转、卡片缩放）。
