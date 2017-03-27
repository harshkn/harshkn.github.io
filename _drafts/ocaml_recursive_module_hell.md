---
layout: post
title: OCaml Recursive Module Hell
type: post
published: false
status: draft
author:
  display_name: Emma Tosch
---

This is a post I've been wanting to write for some time.

A while ago, when I first started on a first pass of a parser and static analyzer in OCaml, I had a giant mutually-recursive function to handle all of the logic. The language contained both typed and untyped expressions. As a result, every time I would add some new functionality, I would need to add a new, giant 

and desperately wanted something macro-like. I found a [cool blog post](https://www.tildedave.com/2011/05/23/mutually-recursive-modules-in-ocaml-and-why-you-might-care.html) on mutually recursive modules in OCaml 