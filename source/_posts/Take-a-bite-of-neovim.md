---
title: Neovim，要尝一口不？
date: 2023-01-28 20:01:04
tags:
---


**Neovim** 风评很好，我机器上其实早装了它来替代 **vim**。只不过这两年用 **vscode** 较多，冷落了它，除了偶尔改改配置文件，很少用。难得大过年的有点儿空，就来倒腾它一下子，最终效果如下。

![](/images/nvim0.gif)

## 基础配置

从 **0.5** 版开始，**Neovim** 允许使用 **Lua** 代替 **VimL** 作为配置语言，所以这里也直接从 **init.lua** 开始了。

```bash
mkdir -p ~/.config/nvim
touch ~/.config/nvim/init.lua
```

打开此文件，开始配置。

```bash
nvim ~/.config/nvim/init.lua
```

先设置一下缩进，默认是 8 个字符，改为 4 个字符且按 **tab** 键自动补空格：

```lua
vim.g.shiftround = true
vim.bo.expandtab = true
vim.bo.shiftwidth = 4
vim.bo.softtabstop = 4
vim.bo.tabstop = 4
```

再来显示下行号及右边界警示线。右边界一般建议为 80，即代码超过 80 个字符应该注意换行。对现在的屏幕分辨率来说，80 其实有些窄，可以设为 120。

```lua
vim.wo.number = true
vim.wo.colorcolumn = "120"
```

**neovim** 默认打开了不少之前在 **vim** 中需要单独设置的选项，比如说自动缩进、文件类型检测、语法高亮等等。有了上面这几行，基础的配置差不多就够了，其它的安装插件后再调整。

## 插件管理

选用 **lazy**，与 **packer** 相比，它不需要编译、更快、界面也好看些，还有其它优点，不罗列了。总之，就是它了。

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "git@github.com:folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)
```

注意与官方文档相比，我把 clone 地址由 `https://github.com/folke/lazy.nvim.git` 改为了 `git@github.com:folke/lazy.nvim.git`，原因你知道的，国内访问 **Github** 网址抽风，改用后者要好一些。

接着就是让 **lazy** 起作用了，加入如下配置：

```lua
require("lazy").setup({
	-- 插件写这里
}, {
    git = {
        url_format = "git@github.com:%s"
    }
})
```

以上同样加了些针对 git 下载路径的自定义设置，原因同上。

需要特别说明的是，为了节省篇幅，后续凡是提到安装插件的，相关代码都是追加到如下注释的地方：

```lua
-- 以上省略
require("lazy").setup({
	-- 插件相关配置在这里追加
}, {
-- 以下省略
```

然后输入如下命令就可以打开安装界面进行安装了：

```vim
:Lazy
```

## 配色方案

配色方案也是插件，可选的太多了，我使用 **Nightfox**。它本身又包含了多套方案，如下用的是 **nordfox**：

```lua
    {
        "EdenEast/nightfox.nvim",
        lazy = false,
        priority = 1000,
        config = function()
            vim.cmd([[colorscheme nordfox]])
        end,
    },
```

安装之后，界面长这样：

![](/images/nvim1.png)

还是很好看的。

## 字体与图标

首先打开 [NERD FONTS](https://www.nerdfonts.com/font-downloads)，找一款你喜欢的编程字体装进系统里，然后设置你的终端使用该字体。接下来安装插件 **nvim-web-devicons**：

```lua
    "nvim-tree/nvim-web-devicons",
```

以上操作目的是为了给 **neovim** 提供图标支撑，目前暂时看不到变化，算是为后续做些准备工作。

## 状态栏

选用 **lualine** 插件：

```lua
    {
        "nvim-lualine/lualine.nvim",
        opts = {
            options = {
                section_separators = '',
                component_separators = ''
            }
        }
    },
```

其实可以只保留如下一行，显示效果可能还好一些。我个人偏爱简洁样式，用上述选项是为了去掉分隔符。

```lua
    "nvim-lualine/lualine.nvim",
```

## 文件管理

选 **nvim-tree**，用的人多，比较活跃。

```lua
    {
        "nvim-tree/nvim-tree.lua",
        config = function()
            vim.g.loaded_netrw = 1
            vim.g.loaded_netrwPlugin = 1
            vim.g.termguicolors = true

            require("nvim-tree").setup({
                sort_by = "case_sensitive",
            })
        end,
    },
```

安装后，输入命令：

```vim
:NvimTreeToggle
```

就会打开文件树，如下图：

![](/images/nvim2.png)

但是每次输入命令打开关闭文件树不太爽，用快捷键就好多了。

## 快捷键

先定义一下全局的快捷起始键，通常用空格或逗号，如下定义为逗号：

```lua
vim.g.mapleader = ","
```

如下定义 `,+空格` 取消搜索高亮：

```lua
vim.keymap.set("n", "<leader><space>", "<cmd>nohlsearch<cr>", { silent = true })
```

快捷键用熟了很好，刚定义时容易忘。想要提示的话，可以用 **which-key** 插件来定义快捷键。

```lua
    {
        "folke/which-key.nvim",
        config = function()
            vim.o.timeout = true
            vim.o.timeoutlen = 300

            local wk = require("which-key")
            -- 快捷键在这里定义
            wk.setup()
        end,
    },
```

注意其中的注释，后续对快捷键定义如无特殊说明，都写在上述注释所在的位置。

现在可以试一下了，按下 `Ctrl-W` 组合键，效果如下：

![](/images/nvim3.png)

Amazing，比较带劲是不是？

接下来注册自己想要的快捷键，比如：

```lua
            wk.register({
                ["<space>"] = { "<cmd>nohlsearch<cr>", "取消搜索高亮" },
                ["d"] = { "<cmd>NvimTreeToggle<cr>", "显示/隐藏目录树" },
            }, { prefix = "<leader>" })
```

这样就可以用 `,+d` 来切换目录树的显示了。顺便的，当使用 **/** 或 **?** 搜索时，匹配项会高亮显示，现在可以使用 `,+空格` 来取消高亮了。如果按下 **,** 键，则会弹出以上快捷键的说明。相当不错！

## 多文档

**vim/neovim** 有两种模式支持多文档编辑：标签页或缓冲区。这里选择使用缓冲区，**bufferline** 插件可以展示多个缓冲区的文档标签：

```lua
    {
        "akinsho/bufferline.nvim",
        tag = "v3.*",
        config = function()
            vim.g.termguicolors = true

            require("bufferline").setup()
        end,
    },
```

试下效果吧。用 `,+d` 打开目录树，按 `j` 或 `k` 选中个文件，再按 `o` 或直接回车就打开了，注意上方多出来的**标签页**。

![](/images/nvim4.png)

试试用鼠标点击**标签页**以及其中的关闭按纽，功能正是你想要的，对吧？不过在 **vim** 中用鼠标似乎有些 low，用命令 `:bn`、`:bp` 算是正常途径。也可以定义快捷键，如下：

```lua
            vim.keymap.set("n", "<leader>bp", "<cmd>BufferLineCyclePrev<cr>", { silent = true })
            vim.keymap.set("n", "<leader>bn", "<cmd>BufferLineCycleNext<cr>", { silent = true })
            vim.keymap.set("n", "<leader>bd", "<cmd>bd<cr>", { silent = true })
```

配置到现在，乍一看很象回事了。但是用来写代码的话，还不太够，所以继续。

## 参考线及特殊字符

先加两行全局配置，以区分空格与制表符、以及折行与回车换行:

```lua
vim.o.listchars = "eol:↵,lead:‧"
vim.wo.list = true
```

然后装个 **indent-blankline** 插件：

```lua
    {
	    "lukas-reineke/indent-blankline.nvim",
    },
```

## 代码片断

使用插件 **luasnip**，与自动完成的集成稍后再说。

```lua
    {
        "L3MON4D3/LuaSnip",
        version = "^1.1.0",
        dependencies = {
            "rafamadriz/friendly-snippets",
        },
        config = function()
            require("luasnip.loaders.from_vscode").lazy_load()
        end,
    },
```

## 自动完成

从这里开始，进入稍微复杂的配置部分。先来弄自动完成。自动完成的原材料可以来源于当前文档关键字、可以来源于代码片断，当然我们更希望它来源于我们的编程上下文语义，即 **LSP** 集成。如下是相关插件配置。

```lua
    {
        "hrsh7th/nvim-cmp",
        dependencies = {
            "hrsh7th/cmp-buffer",
            "hrsh7th/cmp-path",
            "hrsh7th/cmp-nvim-lsp",
            "L3MON4D3/LuaSnip",
            "saadparwaiz1/cmp_luasnip",
        },
        config = function()
            local cmp = require("cmp")

            cmp.setup({
                snippet = {
                    expand = function(args)
                        require("luasnip").lsp_expand(args.body)
                    end,
                },
                mapping = cmp.mapping.preset.insert({
                    ['<C-b>'] = cmp.mapping.scroll_docs(-4),
                    ['<C-f>'] = cmp.mapping.scroll_docs(4),
                    ['<C-Space>'] = cmp.mapping.complete(),
                    ['<C-e>'] = cmp.mapping.abort(),
                    ['<CR>'] = cmp.mapping.confirm({ select = true }),
                }),
                sources = cmp.config.sources({
                    { name = 'nvim_lsp' },
                    { name = 'luasnip' },
                }, {
                    { name = 'buffer' },
                    { name = "path" },
                }),
            })
        end,
    },
```

看起来比较复杂，对吧？简单解释一下：

- 自动完成使用了 **nvim-cmp** 插件；
- 提示内容可以来源于当前文档、路径、代码片断及上下文语义；
- 定义了几个快捷键；

## 上下文语义（LSP）

可能是最复杂的部分，配置如下：

```lua
    {
        "neovim/nvim-lspconfig",
        dependencies = {
            "williamboman/mason.nvim",
            "williamboman/mason-lspconfig.nvim",
            "hrsh7th/cmp-nvim-lsp",
        },
        config = function()
            require("mason-lspconfig").setup({
                ensure_installed = {
                    "bashls",
                    "clangd",
                    "denols",
                    "pyright",
                    "rust_analyzer",
                },
            })

            local capabilities = require('cmp_nvim_lsp').default_capabilities()

            local lspcfg = require("lspconfig")
            lspcfg.bashls.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.clangd.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.denols.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.pyright.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.rust_analyzer.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
        end,
    },
```

仍然是最简单的解释一下：

- 使用了 **nvim-lspconfig** 插件来做 LSP 的配置；
- 不同的编程语言要安装不同的语言服务，使用 **mason** 来统一管理这些语言服务组件；
- 自动安装 bash、c/c++、js/ts、python、rust 语言服务；
- 集成上述编程语言的语义化自动完成功能；

其中有个 `on_attach` 在给出的配置代码中暂未给出，是因为这是个公用函数，下文的代码格式化也会用到，所以稍后再描述。

## 格式化及诊断

这两项内容均使用 **null-ls** 插件实现，配置如下：

```lua
    {
        "jose-elias-alvarez/null-ls.nvim",
        dependencies = {
            "nvim-lua/plenary.nvim",
        },
        config = function()
            local nl = require("null-ls")
            local sources = {
                nl.builtins.diagnostics.eslint_d,
                nl.builtins.diagnostics.ruff,
                nl.builtins.formatting.beautysh,
                nl.builtins.formatting.black,
                nl.builtins.formatting.clang_format,
                nl.builtins.formatting.prettierd,
                nl.builtins.formatting.rustfmt,
                nl.builtins.formatting.sql_formatter,
            }
            nl.setup({
                sources = sources,
                on_attach = on_attach,
            })
        end,
    },
```

很明显，诊断与格式化也都与编程语言相关，同样依赖一些第三方组件。尽管上述配置没用明确给出，也可以通过 **mason** 管理，之前已经安装过些插件。输入 `:Mason` 即可打开其界面如下：

![](/images/nvim5.png)

可以看到我已经安装了 LSP 及格式化与诊断相关的几个组件。

是时候说一下 `on_attach` 了，其代码如下：

```lua
local on_attach = function(client, bufnr)
    vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')

    local bufopts = { noremap=true, silent=true, buffer=bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
    vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
    vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, bufopts)
    vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, bufopts)
    vim.keymap.set('n', '<leader>wl', function()
        print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
    end, bufopts)
    vim.keymap.set('n', '<leader>D', vim.lsp.buf.type_definition, bufopts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, bufopts)
    vim.keymap.set('n', '<leader>f', function()
        vim.lsp.buf.format { async = true }
    end, bufopts)

    local augroup = vim.api.nvim_create_augroup("LspFormatting", {})
    if client.supports_method("textDocument/formatting") then
        vim.api.nvim_clear_autocmds({ group = augroup, buffer = bufnr })
        vim.api.nvim_create_autocmd("BufWritePre", {
            group = augroup,
            buffer = bufnr,
            callback = function()
                vim.lsp.buf.format({
                    filter = function(client)
                        return client.name == "null-ls"
                    end,
                    bufnr = bufnr,
                })
            end,
        })
    end
end
```

主要是定义了一些快捷键，例如：

- `gd` 可以跳转至关键字定义；
- `gi` 可以跳转至类型实现；
- `,D` 可以跳转至类型定义；
- `,f` 代码格式化；
- 保存时自动进行代码格式化；

## 其它

- 注释，使用插件：comment.nvim；
- 错误列表，使用插件：trouble.nvim；

## 完整配置

```lua
vim.o.listchars = "eol:↵,lead:‧"
vim.wo.list = true
vim.wo.number = true
vim.wo.signcolumn = "yes"
vim.wo.colorcolumn = "80"

vim.g.shiftround = true
vim.bo.expandtab = true
vim.bo.shiftwidth = 4
vim.bo.softtabstop = 4
vim.bo.tabstop = 4

vim.g.termguicolors = true
vim.g.completeopt = "menu,menuone,noselect"

vim.g.mapleader = ","
vim.keymap.set("n", "<leader><space>", "<cmd>nohlsearch<cr>", { silent = true })

-- vim.lsp.set_log_level("debug")
local on_attach = function(client, bufnr)
    vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')

    local bufopts = { noremap=true, silent=true, buffer=bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
    vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
    vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, bufopts)
    vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, bufopts)
    vim.keymap.set('n', '<leader>wl', function()
        print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
    end, bufopts)
    vim.keymap.set('n', '<leader>D', vim.lsp.buf.type_definition, bufopts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, bufopts)
    vim.keymap.set('n', '<leader>f', function()
        vim.lsp.buf.format { async = true }
    end, bufopts)

    local augroup = vim.api.nvim_create_augroup("LspFormatting", {})
    if client.supports_method("textDocument/formatting") then
        vim.api.nvim_clear_autocmds({ group = augroup, buffer = bufnr })
        vim.api.nvim_create_autocmd("BufWritePre", {
            group = augroup,
            buffer = bufnr,
            callback = function()
                vim.lsp.buf.format({
                    filter = function(client)
                        return client.name == "null-ls"
                    end,
                    bufnr = bufnr,
                })
            end,
        })
    end
end

local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
    vim.fn.system({
        "git",
        "clone",
        "--filter=blob:none",
        "git@github.com:folke/lazy.nvim.git",
        "--branch=stable",
        lazypath,
    })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
    "nvim-tree/nvim-web-devicons",
    {
        "EdenEast/nightfox.nvim",
        lazy = false,
        priority = 1000,
        config = function()
            vim.cmd([[colorscheme nordfox]])
        end,
    },
    {
        "nvim-tree/nvim-tree.lua",
        config = function()
            vim.g.loaded_netrw = 1
            vim.g.loaded_netrwPlugin = 1

            require("nvim-tree").setup({
                sort_by = "case_sensitive",
            })

            vim.keymap.set("n", "<leader>d", "<cmd>NvimTreeToggle<cr>", { silent = true })
        end,
    },
    {
        "nvim-lualine/lualine.nvim",
        dependencies = {
            "nvim-tree/nvim-web-devicons",
        },
        opts = {
            options = {
                section_separators = "",
                component_separators = "⁞",
            },
        },
    },
    {
        "akinsho/bufferline.nvim",
        version = "^3.1.0",
        config = function()
            require("bufferline").setup()

            vim.keymap.set("n", "<leader>bp", "<cmd>BufferLineCyclePrev<cr>", { silent = true })
            vim.keymap.set("n", "<leader>bn", "<cmd>BufferLineCycleNext<cr>", { silent = true })
            vim.keymap.set("n", "<leader>bd", "<cmd>bd<cr>", { silent = true })
        end,
    },
    {
        "lukas-reineke/indent-blankline.nvim",
        opts = {
            show_end_of_line = true,
            space_char_blankline = " ",
        },
    },
    {
        "L3MON4D3/LuaSnip",
        version = "^1.1.0",
        dependencies = {
            "rafamadriz/friendly-snippets",
        },
        config = function()
            require("luasnip.loaders.from_vscode").lazy_load()
        end,
    },
    {
        "hrsh7th/nvim-cmp",
        dependencies = {
            "hrsh7th/cmp-buffer",
            "hrsh7th/cmp-path",
            "hrsh7th/cmp-nvim-lsp",
            "L3MON4D3/LuaSnip",
            "saadparwaiz1/cmp_luasnip",
        },
        config = function()
            local cmp = require("cmp")

            cmp.setup({
                snippet = {
                    expand = function(args)
                        require("luasnip").lsp_expand(args.body)
                    end,
                },
                mapping = cmp.mapping.preset.insert({
                    ['<C-b>'] = cmp.mapping.scroll_docs(-4),
                    ['<C-f>'] = cmp.mapping.scroll_docs(4),
                    ['<C-Space>'] = cmp.mapping.complete(),
                    ['<C-e>'] = cmp.mapping.abort(),
                    ['<CR>'] = cmp.mapping.confirm({ select = true }),
                }),
                sources = cmp.config.sources({
                    { name = 'nvim_lsp' },
                    { name = 'luasnip' },
                }, {
                    { name = 'buffer' },
                    { name = "path" },
                }),
            })
        end,
    },
    {
        "williamboman/mason.nvim",
        opts = {
            ui = {
                check_outdated_packages_on_open = false,
            },
        },
    },
    {
        "neovim/nvim-lspconfig",
        dependencies = {
            "williamboman/mason.nvim",
            "williamboman/mason-lspconfig.nvim",
            "hrsh7th/cmp-nvim-lsp",
        },
        config = function()
            require("mason-lspconfig").setup({
                ensure_installed = {
                    "bashls",
                    "clangd",
                    "denols",
                    "pyright",
                    "rust_analyzer",
                },
            })

            local capabilities = require('cmp_nvim_lsp').default_capabilities()

            local lspcfg = require("lspconfig")
            lspcfg.bashls.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.clangd.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.denols.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.pyright.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
            lspcfg.rust_analyzer.setup({
                capabilities = capabilities,
                on_attach = on_attach
            })
        end,
    },
    {
        "jose-elias-alvarez/null-ls.nvim",
        dependencies = {
            "nvim-lua/plenary.nvim",
        },
        config = function()
            local nl = require("null-ls")
            local sources = {
                nl.builtins.diagnostics.eslint_d,
                nl.builtins.diagnostics.ruff,
                nl.builtins.formatting.beautysh,
                nl.builtins.formatting.black,
                nl.builtins.formatting.clang_format,
                nl.builtins.formatting.prettierd,
                nl.builtins.formatting.rustfmt,
                nl.builtins.formatting.sql_formatter,
            }
            nl.setup({
                sources = sources,
                on_attach = on_attach,
            })
        end,
    },
    {
        'numToStr/Comment.nvim',
        config = true,
    },
    {
        "folke/trouble.nvim",
        dependencies = {
            "nvim-tree/nvim-web-devicons",
        },
        config = true,
    },
}, {
    git = {
        url_format = "git@github.com:%s",
    },
})
```
