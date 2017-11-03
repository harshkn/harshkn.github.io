---
layout: post
comments: true
author:
  display_name: Emma Tosch
---

I've been working on OCaml 4.02.1 and after a chain of events was forced to upgrade. Here is my previous setup:

- *linter* : ocamlmerlin (`opam install merlin ocp-indent`)
- *build tool* : oasis (`opam install oasis`)

My oasis file used the [sexplib]()


nuke your ~/.opam
opam manages all of your ocaml compilers here. if you nuke this, you will need to start over 

https://blogs.janestreet.com/tag/ppx/

Things I have tried:
dependencies:
- sexplib

udpated tags with 
<**/**>predicate()...

Error: Cannot locate deriver fields


sexplib and fieldslib vs ppx_*



error 
Illegal permutation of structure fields
hella old discussed here: https://groups.google.com/forum/#!topic/fa.caml/dWNR0UcViGs
