---
layout: post
title: Data Flow in PlanOut Programs
permalink: data_flow_planout_programs.html
type: post
comments: true
author:
  display_name: Emma Tosch
---

PlanOut programs have a simple syntax:

    Program ::= Stmt*
    Stmt ::=
	| if <Bexpr> { <Stmt>* } else { <Stmt>* } <Stmt>*
	| **id** <- <Expr> ; <Stmt>*
	| return <Bexpr> ; <Stmt>*

    Expr ::=
    | <Aexpr> | <Bexpr> | <Cexpr> | <Sexpr>
	| <Get>
	| <ExternalGet>
	| coalesce ( <Expr> , <Expr> )
	| <Cexpr> [ <Expr> ]
	| <RandomVariable>

	RandomVariable ::=
	| bernoulliTrial( p = <Aexpr> , unit = <Uexpr> ) | bernoulliTrial( p = <Aexpr> , unit = <Uexpr>, salt = <Sexpr> )
	| weightedChoice( weights = <Cexpr> , choices = <Cexpr> , unit = <Uexpr>) | weightedChoice( weights = <Cexpr> , choices = <Cexpr> , unit = <Uexpr>, salt = <Sexpr> )
	| uniformChoice( choices = <Cexpr> , unit = <Uexpr> ) | uniformChoice( choices = <Cexpr> , unit = <Uexpr> , salt = <Sexpr>)
	| randomFloat ( min = <Aexpr> , max = <Aexpr> , unit = <Uexpr> ) | RandomFloat ( min = <Aexpr> , max = <Aexpr> , unit = <Uexpr> , salt = <Sexpr> )
	| randomInteger ( min = <Aexpr> , max = <Aexpr> , unit = <Uexpr> ) | RandomInteger ( min = <Aexpr> , max = <Aexpr> , unit = <Uexpr> , salt = <Sexpr> )
	| sample ( choices = <Cexpr> ) | sample ( choices = <Cexpr> , num_draws = <Aexpr> ) | sample ( choices = <Cexpr> , num_draws = <Aexpr> , unit = <Uexpr> ) 

<!--summary-->

There are no function definitions, and there is no looping. The language is very generous -- it allows users to access free variables, and these variables may refer to functions whose co-domain is unknown.

Expressions (`<Expr>`) are typed -- we have arithmetic expressions (`<Aexpr>`s), boolean expressions (`<Bexpr>`s), string expressions (`<Sexpr>`s) and container expressions (`<Cexpr>`s) (currently either an array, a map, a JSON blob, or a container of these types).

Each of these four types has its own typed `Get`s, `Iexpr`s, and `Coalesce`s. We use the untyped `Get`s  for retrieving references and `IExpr`s for encoding evaluation of indexing that results in the appropriate type (e.g., we have a `CIexpr` to denote a map whose values are containers. That is, if we were to evaluate a closed expression $$e$$ denoted by the `CIexpr` constructor, we would get a container (of unknown type) out of that evaluation.). The presence of free variables, whose types may not be known statically, means that we need to allow for an untyped $$\top$$ value for certain operators. 

Operators that must have a top-level $$\top$$ type include the three examples above (`Get`, `Iexpr`, and `Coalesce`), as well as an `ExternalGet` and a `RandomVariable`.

**`Get` vs. `ExternalGet`**

We use `Get` to *temporarily* store references with unknown types. When we finish analyzing a PlanOut script, there should be no more `Get`s in our AST -- they should all be replaced by one of three values:

1. The concrete (non-random) value they refer to.
2. A typed `Get` if (a) the value is external with a known type or (b) the support of the random variable has a known type.
3. Otherwise, an `ExternalGet`.


Note that we do not replace references to random variables with the random variable, since instantiation of a random variable happens when the script is loaded, and not when the value is set. As such, we treat random variables as a delayed computation that is potentially partially complete. So, it is never the case that for

	foo = bernoulliTrial(p=0.1, unit=userid);
	bar = foo;

`foo` and `bar` refer to different truth values. 

`ExternalGet` denotes a call to an unknown external value. Suppose all users of our system have a variable in their current client-side environment called `config`. We are implementing a new feature and want to run an A/B test on users who have been selected to see feature x:

	foo = coalesce(config[feature_x], x_default);
	if (old_default != x_default) {
		delay = uniformChoice(choices=[1,10,100], unit=userid);
	}

We can infer the following things from this script:

1. `config` is an external call to a container. It is stored using the type constructor `GetContainer`.

2. `feature_x` is an external call of an unknown type. It is stored using the type constructor `ExternalGet`.

3. `old_default`, `x_default`, and `foo` have the same type, but that type is unknown. `x_default` and `old_default` are each stored using the type constructor `ExternalGet`. We cannot make progress on `foo`'s type inference, so we store it using an unevaluated, untyped `Coalesce` constructor.

Now suppose that we added a line to the program:

	if (x_default > 256) {
		cache = true;
	}

Then we can do a second pass of our analysis and run the updates update:

1. `old_default` and `x_default` updated from the untyped `Expr` `ExternalGet` to the typed `Aexpr` `GetNumeric`.

2. `foo` updated from the untyped `Coalesce` to the typed `Aexpr` `CoalesceNumeric`. 

# Control Flow
The first pass of analysis through the PlanOut programs splits the program into paths, according to the explicit control flow. We introduce a `Skip` statement into the abstract syntax to facilitate some of our normalizations.

Generating explicit paths from the control flow is straightforward. However, it requires some rewrites of the Planout program. It performs the following operations:

1. **if-statements** All `if`-statements in PlanOut are represented internally as `cond`s. `else` clauses are thus represented with a default guard. We rewrite all if statements so that the guard is the conjunction of the explicitly listed guard and the negation of the disjunction of all previous guards. So,

	    if (foo < 10 || bar == "test") {
	        ...
		} else if (foo == 11) {
			...
		} else if (foo == 12) {
			...
		} else if (foo > 12) {
			...
		}

	becomes

	    if (foo < 10 || bar == "test") {
	        ...
		} else if (foo == 11 && !(foo < 10 || bar == "test")) {
			...
		} else if (foo == 12 && !((foo < 10 || bar == "test")) || (foo == 11)) ) {
			...
		} else if (foo > 12 && !((foo < 10 || bar == "test") || (foo == 11) || (foo == 12))) {
			...
		}
	
	For PlanOut programs that do not have `else` clauses, we inject a default clause with an empty consequent. The above program would then end with:
	
			} else if (!(foo > 12 || (foo < 10 || bar == "test") || (foo == 11) || (foo == 12)))
			}


	These rewrite allow us to evaluate all conditionals in isolation. Later, when we compute the paths through the program, we flatten the structure of the program and treat the guards as asserts. These assertions allow us to prune possible values that random nodes may take on.

2. **indexing expressions** Indexing expressions can be rewritten as branches. For example, the statement

		foo = uniformChoice(choices=["k1", "k2"], unit=userid);
		bar = config[foo];

	can be rewritten as

		foo = uniformChoice(choices=["k1", "k2"], unit=userid);
		if (foo == "k1") {
			bar = config["k1"];
		} else if (foo == "k2") {
			bar = config["k2"];
		}

	The difference between these approaches depends on the underlying abstraction for evaluated code. When I wrote the Javascript-only version of the PlanOut analyzer, which amounts to treating indexing as a control operator. For that implementation, it made reasoning about paths much easier. However, the strongly typed version I have in OCaml has a separate module to represent PlanOut types that have reached a terminal evaluation. It does not treat indexing as a control operator and instead reasons about "branching" via indexing during the data flow analysis. 
	
# Data Flow

The meaty part of analysis of PlanOut programs is related to the data. We come at this from two perpsectives: the PL perspective, which uses traditional program analysis techniques, and a more "graphical model" type perspective, which looks at the DAG induced by the variables in the program.

We can think of PlanOut programs as generative models for the assignment procedure. Some critical information about the semantics of the program and what kinds of analyses we should do gets encoded when we do things like conditional random assignment.

For some analyses, taking a more graphical-model-y approach makes more sense, and for other analyses, a more program-analysis approch makes more sense.

For data flow, we get complexity from branching statements and from logic about assignment -- although we do not have mutable variables, aliasing can cause weird behavior. Treating paths each in isolation helps us get around some of these issues. The trickiest static analysis we do is to compute propensity scores.

Propensity scores in this context might better be described as the probability of exposure. Since PlanOut programs are fairly small, we can typically consider all possible assignments for all variables along a particular path, and prune when appropriate. Every random variable causes us to branch along a particular path, so that every path has some set of possible worlds it inhabits. We ensure there is consistency between the context (i.e. the assignment in logical parlance) and any assertions made along the path. If a path and a context are inconsistent, we remove the context from the set of possible worlds.

All contexts are associated with a probability. If the context contains external values that have been instantiated, we return that context along with the set of parameters it is conditioned on. This allows us to treat this probability as conditional on those parameters, rather than joint between all the parameters set in the context.
