---
layout: post
title: Data Flow in PlanOut Programs
author:
  display_name: Emma Tosch
---

PlanOut programs have a simple syntax:

    Program ::= Stmt*
    Stmt ::=
	| if <Bexpr> { <Stmt>* } else { <Stmt>* } <Stmt>*
	| **id** <- <Expr> ; <Stmt>*
	| return <Bexpr> ; <Stmt>*

<!--summary-->

There are no function definitions, and there is no looping. The language is very gnerous -- it allows users to bind expressions 

Expressions (`<Expr>`) are typed -- we have arithmetic expressions (`<Aexpr>`s), boolean expressions (`<Bexpr>`s), string expressions (`<Sexpr>`s) andcontainer expressions (`<Cexpr>`s) (currently either an array, a map, or a JSON blob). Each of these four types has its own typed `Get` for retrieving references and `IExpr`s for encoding complex indexing into objects that map into their appropriate type (e.g., we have a `SMap` to denote a map whose values are strings). We also have top-level types for cases when we do not know the appropriate type for a reference or resolved indexing expression. Finally, we have a top-level `RandomVariable` expression. Since we typically don't want to re-evaluate the random choice, the `Expr` constructor of `RandomVariable` is sufficient to express the type the random variable resolves to when used in conjunction with the typed `Get` operators.


# Control Flow
The first pass of analysis through the PlanOut programs splits the program into paths, according to the explicit control flow. We introduce a `Skip` statement into the abstract syntax to facilitate some of our normalizations.

Generating explicit paths from the control flow is straightforward. It performs the following operations:

1. **if-statements** All `if`-statements in PlanOut are represented internally as `cond`s. `else` clauses are thus represented with a default guard. For PlanOut programs that do not have `else` clauses, we   We rewrite all conditionals so that they can be evaluated in isolation. 


### Rewrite Rules
In the first pass through the PlanOut program, we rewrite expressions to normalize them. This includes the following modifications to the PlanOut Programs::

* **
