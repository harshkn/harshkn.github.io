---
layout: post
title: Data-Driven Correctness
comments: true
type: post
status: publish
published: true
author:
  display_name: Emma Tosch
---

In the [CheckCell work](htttp://checkcell.org), [Emery](http://cics.umass.edu/~emery) often says "garbage in, garbage out." However, when chatting with [Dan](http://cics.umass.edu/~dbarowy) about this idea, we realized that it was really a specific instance of a more general concept, which I will call "data-driven correctness."

In logic, we have the notion of "suitability."  An _assignment_ in logic is a mapping from variables (or names) to truth values, and an assignment is _suitable_ for a formula if it contains all of the variable names in that formula. One might argue that all correctness in PL comes out of suitability; we need suitability to talk about satisfiability and we use satisfiability to model systems. Formal verification and correctness in PL addresses the complexity of surface strings (i.e., the literal text of programs) and the tension that causes with the semantics of a system, which depends on the machine that interprets computer programs. 

In statistics and machine learning, we say that a formula _models_ the data when it _explains_ the data, and when it can be used in a _predictive_ capacity. (Here is a [link](http://andrewgelman.com/2012/09/04/model-checking-and-model-understanding-in-machine-learning/) to a discussion about the goals and priorities of machine learning and statistics, which I have lumped together in this statement.) As I understand it, correctness in machine learning is empirically driven. ML researchers compare the results of a system against a human-annotated gold standard data set.

What I'm getting at here is that the tradition in PL that we inherit from logic focuses on the structure of the program. We talk about data in terms of the sets they belong to (i.e., the types). However, when we write programs for things like machine learning tasks, types may not help us. There are probably many reasons for this, but two in particular come to mind: (1) since type-checking amounts to checking set-membership, this poses a serious issue for data drawn from distributions and (2) even with input drawn from a distribution, the correctness of your program may depend on what you do with the data downstream.

Note that type-checking typically does not include restrictions that depend on the _value_ of the datum being checked, unless the type system supports _dependent types_. Consider a system where you want to restrict the input to a function to a value less than a particular bound. You can, of course, write an assertion at runtime. However, to ensure this value statically, without dependent types, you will need to create a new type, say `RealsLessThanN`, and perform computations on this type. If your whole program depends on inputs being `RealsLessThanN`, then you write the program so that all numbers are of type `RealsLessThanN`. Your parser will have to handle converting values into the appropriate type.

The problem here is that it is typically quite difficult to tell if a single datum is drawn from a particular distribution. For example, we don't get much information from type-checking a random variable that has infinite support on the reals when the input is a floating point number that is drawn from another distribution having a different shape. Instead, we can make certain probabilistic decisions. For example, we test whether the datum is an outlier for the expected distribution. This does not guarantee that the datum is not a member of the expected distribution, but it does alert us to something suspicious, which is better than what we had before.

This kind of outlier analysis operates on two basic types of assumptions: that the model in the program (the type specification for the variable) is correct, and that most of the data is correct. The latter is especially important if we specify the former using the latter (hopefully with a burn-in period, or at least some provision for "throwing away" that early data). If we instead operate from the assumption that the data is mostly pretty representative, we would instead take a Bayesian approach that includes an update rule.

In any case, if the data is always representative, then having the wrong type presents a different issue. Machine learning uses [BIC](https://en.wikipedia.org/wiki/Bayesian_information_criterion) and [AIC](https://en.wikipedia.org/wiki/Akaike_information_criterion) to determine whether a model is a good fit (relative to other models).

Are there ever cases where, if we knew sufficient information ahead of time, types wouldn't solve our problem? I would argue that there are. This happens when we are considering how the data will be used later.

So far, we have PL handling correctness almost exclusively in the context of the surface text of the program. We statistical methods for finding outliers in the data and for comparing fit between models. Looking at the "correctness" of the input (this is what the whole "garbage in, garbage out" thing is about) makes intuitive sense, especially if we assume that we have some kind of monotonicity in our data analysis pipeline -- in PL, we assume that the program is central, but there exists some [potentially] flawed entity that precedes the program, and there exists a some [potentially] flawed entity that follows the program.

One of the arguments I've made about the [SurveyMan](http://surveyman.org) work is that in the context of data-intensive tasks, when we talk about correctness, we *don't* consider the structure (or errors or discontinuities induced by the structure). Now I'm making the converse argument -- that in PL we don't consider the data when talking about correctness. SurveyMan and CheckCell both focus on the data that exists before pushing it through various computer programs. We could see the analysis work for PlanOut as a case where the monotonicity described above breaks down: incorrectly applied analyses tarnish otherwise correct programs. 

So what is data-driven correctness? It's a correctness criterion that considers the whole data-analysis pipeline. 
