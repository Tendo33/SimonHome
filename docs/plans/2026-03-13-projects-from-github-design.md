# Projects 从 GitHub 仓库补充设计

## 目标
- 将你指定的完整项目补充到 Projects 区块。
- 重复项目仅保留一张卡片，保留原标题，更新为新的中文描述。
- Projects 统一使用 `static/img/projects/i1.png` ~ `i9.png` 作为图标。

## 项目清单与描述（中文）
重复项目（保留原标题，更新描述）：
- SimonHome：SimonSun 的个人主页
- markio：将多种文件格式转换为结构化 Markdown 的文档处理服务
- data-tagger：高效、灵活的多任务批量 SFT 数据标注工具
- parq-cli：Parquet 文件命令行工具
- uvm：用 UV 的超快性能与类 Conda 命令简化 Python 虚拟环境管理

新增项目（追加卡片）：
- daily_ETF_analysis：ETF 日度分析与跟踪
- MyNebula：把 GitHub Stars 变成语义知识星云
- IdeaGo：面向创业想法的 AI 竞品研究引擎
- MoodShakerFront：鸡尾酒推荐网站

## 顺序与图标分配
顺序（保持原有 5 个在前，新增 4 个在后）：
1. markio
2. SimonHome
3. data-tagger
4. parq-cli
5. uvm
6. daily_ETF_analysis
7. MyNebula
8. IdeaGo
9. MoodShakerFront

图标路径：`./static/img/projects/i1.png` ~ `i9.png`
- markio -> i1
- SimonHome -> i2
- data-tagger -> i3
- parq-cli -> i4
- uvm -> i5
- daily_ETF_analysis -> i6
- MyNebula -> i7
- IdeaGo -> i8
- MoodShakerFront -> i9

## 实现范围
- 修改 `D:\TuDou\SimonHome\index.html` 的 Projects 区块。
- 不新增/修改样式文件。

## 验证
1. Projects 显示 9 张卡片。
2. 重复项目标题不变，描述已更新。
3. 图标路径均指向 `static/img/projects/i*.png`。
