# Projects From GitHub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将指定的 GitHub 完整项目补充到 Projects 区块，并统一描述与图标路径。

**Architecture:** 仅修改 `index.html` 的 Projects 区块卡片内容与图标路径。

**Tech Stack:** HTML（静态）。

---

### Task 1: 更新 Projects 列表内容

**Files:**
- Modify: `D:\TuDou\SimonHome\index.html`

**Step 1: 替换 Projects 内的卡片为 9 项**

目标顺序：
1. markio
2. SimonHome
3. data-tagger
4. parq-cli
5. uvm
6. daily_ETF_analysis
7. MyNebula
8. IdeaGo
9. MoodShakerFront

**Step 2: 更新描述**
- 重复项目保留原标题，更新为新的中文描述。
- daily_ETF_analysis 描述使用“ETF 日度分析与跟踪”。

**Step 3: 更新图标路径**
- 全部指向 `./static/img/projects/i1.png` ~ `i9.png`，按顺序对应。

---

### Task 2: 验证

**Step 1: 结构检查**
- Projects 区块应只有 9 张卡片。

**Step 2: 文案检查**
- 9 张卡片标题与描述符合设计文档。

**Step 3: 图标路径检查**
- 所有图标路径均为 `./static/img/projects/i*.png`。

---

### Task 3: 提交（可选）

如需提交：
```bash
git add D:\TuDou\SimonHome\index.html
git commit -m "feat: update projects list from GitHub"
```
