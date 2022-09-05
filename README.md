# tree-sitter-iitran

(Mini)IITRAN grammar for [tree-sitter](https://tree-sitter.github.io/tree-sitter/).

References

- [IITRAN - Wikipedia](https://en.wikipedia.org/wiki/IITRAN)

- [IITRAN / 360: Self-Instructional Manual and Text]() by Charles R. Bauer

- Courtesy to professor Stefan Muller (visit his website [here](http://cs.iit.edu/~smuller/))
  for coming up with the grammar for MiniIITRAN for [CS 443: Compiler Construction](http://cs.iit.edu/~smuller/cs443-f22/index.html)
  course at Illinois Institute of Technology.

## Installation

Follow this [isntruction](https://github.com/nvim-treesitter/nvim-treesitter#adding-parsers)
to add new parser and this [instruction](https://github.com/nvim-treesitter/nvim-treesitter#adding-queries)
to add queries to `nvim-treesitter`.

If you have trouble adding new filetype for `iitran` in `neovim` using [Neovim's `vim.filetype.add()`](<https://neovim.io/doc/user/lua.html#vim.filetype.add()>)
like in the guide, add this line in your `init.vim`

```
autocmd BufNewFile,BufRead *.iit set filetype=iitran
```

to set file type of the current buffer with `.iit` file extension to `iitran`.
