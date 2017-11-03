---
layout: post
title: Ocaml Library Circular Dependencies
comments: true
author:
  display_name: Emma Tosch
  email: etosch@cics.umass.edu
categories:
- programming
tags:
- ocaml
---
Once again I've allowed the list of things I want to blog about to pile up, have been focusing writing energies elsewhere, and now haven't blogged in well over six months. C'est la vie!

What I want to post here is an issue I ran across in August, when I was attempting to refactor some OCaml code. [Javier](https://people.cs.umass.edu/~jburroni/) had asked me to split out an embaressingly long module into smaller ones and I know I had a reason for not doing so, but I couldn't remember it. This post is a summary of me re-discovering why I hadn't done it originally and how part of the rationale was based on a flawed understanding of oasis.

<!--summary-->
The original code had one big file that contained many modules. The interface file exported most of those modules. However, the oasis file only contained the top-level module (i.e., the .ml file) in the list of modules. When I separated the module into many sub-modules, I updated the oasis file to only list modules that would be used by the other libraries. Now why would I do this? Isn't oasis just a build system? Well, to be honest, I suppose I was also thinking about it as a way of specifying what to export. Yeah, yeah, I'm a dumb dumb who should RTFM or something. Now that we have that out of our system, let's look at some behavior that I at least found to be unexpected (and since I'm not a *terrible* programmer, I assume others might make the same mistakes):

# 1. Assertion 1: If oasis is "just" a build system, I would expect a different error from what I actually get.

Here is the setup: I have 12 modules whose dependencies form a DAG inside one master file that I would like to split out into 12 individual files:

![Heirarchical Dependency Graph]({{ site.baseurl }}/assets/dep_graph_heir.png)

...and if you want an easier-to-read representation of the dependencies, check out this rendering:
![Circuluar Dependency Graph]({{ site.baseurl }}/assets/dep_graph_circ.png)

When I originally split these out, as previously stated, I only included the modules actually used by other libraries or executables. Although at the moment I can't remember what exactly those were, I can reproduce the error I got by not including the Parse module, which is not used outside the src_lang library, in the list of modules in the library:

````
Circular dependencies: "tool/src_lang/src_lang.cmxa" already seen in
  [ "tool/src_lang/aux.cmx"; "tool/src_lang/src_lang.cmxa" ]
````

I want to note two things here: (1) It's not that every dependency is required -- when I exclude the Kwd module and the Counts module from the list of library modules, this does not trigger the error, and (2) if the issue were that some dependency was missing or that a linker had an error, wouldn't it give a different error? The error Ocaml gives when I don't have the proper dependencies is pretty clear.

So where does this circular dependency error come from? Clearly oasis is doing some kind of inference over the module dependencies and inferring that there's a cycle when there isn't.

# 2. Can we induce this error with a simpler structure?

I'd like to recreate a similar module structure to what I had previously. However, I started with something simple:

{% highlight yaml %}
OASISFormat: 0.4
Name:        ocaml_module_oasis_example
Plugins:     Meta (0.4), DevFiles (0.4)
Version:     0.1
Synopsis:    Makes a point about modules
Authors:     Emma Tosch
License:     MIT

Library some_lib
  Path:       some_lib
  BuildTools: ocamlbuild
  Modules:    A,
              B

Executable main
  Path:       .
  BuildTools: ocamlbuild
  CompiledObject: best
  MainIs:     main.ml
  BuildDepends:
    some_lib
{% endhighlight %}

Module A refers to in some_lib/A.ml and contains three modules: A1, A2, and A3. A1 is not exported in some_lib/A.mli, but A1 and A2 are. B is just some other module. 

This is what some_lib/A.ml looks like:

{% highlight ocaml %}
module A1 = struct
  let a1_fun arg = arg
end

module A2 = struct
  let a2_fun arg = A1.a1_fun arg
end

module A3 = struct
  let a3_fun = A2.a2_fun
end
{% endhighlight %}

... and this is what some_lib/A.mli looks like:

{% highlight ocaml %}
module A2 : sig
  val a2_fun : 'a -> 'a
end

module A3 : sig
  val a3_fun : 'a -> 'a
end
{% endhighlight %}

We would like to split into separate files: some_lib/A1.ml, some_lib/A2.ml, and some_lib/A3.ml. We also include the interface files, since without them I get some error about "making inconsistent assumptions over interface Pervasives."

In my main executable, which I've creatively called main.ml, I have: 

{% highlight ocaml %}
let () =
  ignore (A.A3.a3_fun 5);
  ignore (B.foo ("a", 5))
{% endhighlight %}

I then update my _oasis file to so that the some_lib library entry looks like this:
{% highlight yaml %}
Library some_lib
  Path:       some_lib
  BuildTools: ocamlbuild
  Modules:    A3,
              B
{% endhighlight %}

However, when I run `oasis setup && make`, I *do not* get the error I'm trying to induce. This shouldn't be totally surprising -- my earlier comment about not needing to include, e.g. the Kwd module indicated that the problem is probably more subtle than just including all of the dependent modules. Some notes about the module dependency structure that caused the circular dependency:

1. The only modules that could be removed safely were those with no intra-library dependencies (i.e., roots).
2. Not all roots could be removed.
3. Removing an intermediate node in the dependency graph *that was not used outside the library* caused a circular dependency issue.
4. The circular dependency error induced by this intermediate node arose from an inference issue at least partially related to a parent of this node.

Point (4) is something I want to look at more -- the actual error message does not say where the duplicate src_lang.cmxa dependence arose -- only that it was previously seen in the Aux module. Inside _build/_log there are a bunch of commands. First I looked for the one that built aux.cmx:

````
# Target: tool/src_lang/aux.cmx, tags: { package(core), package(dolog), package(fieldslib), package(ppx_fields_conv), package(ppx_sexp_conv), package(sexplib), package(str), package(threads), package(yojson), annot, bin_annot, compile, debug, extension:cmx, extension:ml, file:tool/src_lang/aux.cmx, file:tool/src_lang/aux.ml, implem, native, ocaml, quiet, tests, traverse, use_annotations, use_corepo, use_graphs, use_oratio, use_utils }

/Users/etosch/.opam/4.04.2/bin/ocamlfind ocamlopt -c -g -annot -bin-annot -I tool/utils -I tool/oratio -I tool/annotations -I tool/graphs -I tool/corepo -thread -package yojson -package threads -package str -package sexplib -package ppx_sexp_conv -package ppx_fields_conv -package fieldslib -package dolog -package core -I tool/src_lang -I tool/annotations -I tool/corepo -I tool/graphs -I tool/oratio -I tool/utils -o tool/src_lang/aux.cmx tool/src_lang/aux.ml
````

Well, this looks like a dead end -- I don't see any mention of src_lang.cmxa in this log...let's look for cases where we are using aux.cmx. The first hit is in the call to build the final executable, and I am pretty sure this is not the source of the problem. The next usage is in the call to build src_lang.cmxa:

````
# Target: tool/src_lang/src_lang.cmxa, tags: { annot, bin_annot, debug, extension:cmxa, file:tool/src_lang/src_lang.cmxa, library, link, native, ocaml, quiet, tests, traverse }

/Users/etosch/.opam/4.04.2/bin/ocamlfind ocamlopt -a -I tool/src_lang tool/src_lang/basetypes.cmx tool/src_lang/syntax.cmx tool/src_lang/env.cmx tool/src_lang/aux.cmx tool/src_lang/eval.cmx tool/src_lang/format.cmx tool/src_lang/normalize.cmx tool/src_lang/ddg.cmx tool/src_lang/ast.cmx tool/src_lang/transform.cmx -o tool/src_lang/src_lang.cmxa
````

This looks pretty boring/innocent. There's a call to build src_lang.cmxs that basically looks the same, i.e. not too promising for debugging purposes. There are no other calls to src_lang.cmx. So basically this feels like a dead end.


So now let's get back to figuring out if we can induce this error using a simpler dependency graph. The module dependencies

````
A1 -> A2 -> A3
````

didn't trigger our error. In this scenario, A2 is analogous to Parse. Let's give it another parent, and make that parent an inner node:

````
A4 -> A5 
          \
      A1 -> A2 -> A3 
````

We keep the oasis file the same, and just update the codebase so that A2.ml calls a function from A5.ml, and A5.ml calls a function defined in A4.ml. Unfortunately, I still can't induce the error. It's possible that the function definitions, which are all just the identity function, are too simple and are processed in a way that that makes inference easier. However, I still don't know what caused the erroneous circular dependency issue and will post updates if if comes up again or if I figure this one out!
