---
layout: post
title: Inferring Causal Estimators
permalink: estimator_inference.html
jsarr:
- graphs/dag_default.js
author:
  display_name: Emma Tosch
---
PlanOut programs are just sets of assignments with some conditions imposed on top of them. If we generate the dependencies between parameters in a PlanOut program, we can use this information to determine which contrasts are valid.
<!--summary-->
All PlanOut programs can be converted into graphs.

From the default example on the [PlanOut editor](http://planout-editor.herokuapp.com/):

    group_size = uniformChoice(choices=[1, 10], unit=userid);
    specific_goal = bernoulliTrial(p=0.8, unit=userid);
    if (specific_goal) {
      ratings_per_user_goal = uniformChoice(choices=[8, 16, 32, 64], unit=userid);
      ratings_goal = group_size * ratings_per_user_goal;
    }

We can visualize the dependence between variables here:

<div id="basic_dag"></div>

Yellow nodes indicate that the parameter is defined outside the program and that its value is not known until runtime. Rectangular nodes are  random variables that are the direct result of random operators. Circular nodes are deterministic. Ellipsoid nodes are random variables through the flow of data. 

`userid` is the only parameter that's external to the program. To reason about its role, we must observe it. All parameters defined in the consequent depend on the parameters in the guard. This is why there is an edge from `specific_goal` to `ratings_per_user_goal`.

When devising causal estimators, we want to know:

1. Under what conditions is a variable a random variable?
2. What are the valid contrasts for the DAG?

Given that `userid` has sufficiently high cardinality, we have complete information about the joint probability distribution of `group_size`, `ratings_per_user`, and `rating_per_user_goal`, conditioned on the distribution of the `userid`. We want to look at changes to the script that could change constrain our understanding of the distribution of variables.

Note that question (1) is not completely trivial: this example illustrates that it is not so simple as detecting assignment from random operators. Since sums and products of random variables are also random variables, and since control flow can define random variables, determining whether a node is an ellipsoid in this graph is non trivial.

## When is a variable a random variable?

**Sums and products of random variables**

What if `ratings_goal` were instead defined to be `2 * group_size`? It would still be a an random variable, and we would still know the full joint probability distribution. In fact, if any of a node's parents is a random variable, then that node is itself a random variable.

**Control flow determines random variables**

It is also completely valid to rewrite the above as:

	coin = bernoulliTrial(p=0.5, unit=userid);
	if (coin) {
	  group_size = 1;
	} else {
	  group_size = 10;
	}
    specific_goal = bernoulliTrial(p=0.8, unit=userid);
    if (specific_goal) {
      ratings_per_user_goal = uniformChoice(choices=[8, 16, 32, 64], unit=userid);
      ratings_goal = group_size * ratings_per_user_goal;
    }
   
The resulting dag is now:

<div id="rewrite"></div>

Since assignment in the consequent and subsequent of an if-statement depends on the guard, we can use the same conditions as for arithmetic operators to infer that `group_size` is a random variable. 

In all of these cases, we have the full joint probability distribution available, enabling us to compare any subset of the factors. All assignments use the same unit of randomization (`userid`), so a simple difference of means for any conditions is valid. 

## Conditioning on the Unknown

Suppose instead that we had the program

    group_size = uniformChoice(choices=[1, 10], unit=userid);
    specific_goal = bernoulliTrial(p=0.8, unit=userid);
    if (specific_goal && gkCheck(gk="people_i_care_about", userid=userid)) {
      ratings_per_user_goal = uniformChoice(choices=[8, 16, 32, 64], unit=userid);
      ratings_goal = group_size * ratings_per_user_goal;
    }

Notice that the guard is different: it is now a conjunction and includes the function call `gkCheck(gk="people_i_care_about", userid=userid)`.

The analyzer rewrites function calls that sit in the guard as assignments that precede the guard, so we can just reason about variable references. This code would then be rewritten as

    group_size = uniformChoice(choices=[1, 10], unit=userid);
    specific_goal = bernoulliTrial(p=0.8, unit=userid);
	uu1 = gkCheck(gk="people_i_care_about", userid=userid);
    if (specific_goal && uu1) {
      ratings_per_user_goal = uniformChoice(choices=[8, 16, 32, 64], unit=userid);
      ratings_goal = group_size * ratings_per_user_goal;
    }

Now that we have moved the function call into a variable, we can treat it as a random variable in a Bayes net:

<div id="with_gk"></div>

Clearly here anything downstream from `uu1` must be conditioned on it being true. Only `specific_goal` does not need to be conditioned on `uu1`. 
