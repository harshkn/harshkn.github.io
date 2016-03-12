---
layout: post
type: post
comments: true
title: Simple Difference in Means
author:
  display_name: Emma Tosch
---

When inferring contrasts, we make the simplifying assumption that the unit of randomization is proxy for the experimental subject. We also assume that units are independent of each other and that the parameter of interest can be uniquely determined by the parameters in the program, conditioned on the experimental unit of randomization.

Without more specific domain knowledge, we must treat each PlanOut script as a procedure parameterized by the unit of randomization (i.e., all of the $$r$$ values assigned to the special property $$unit$$ in the random operators) and the parameter of interest (i.e., the dependent variable in the analysis we will do at the end).
<!--summary-->

# A small amount of background

Suppose, for example, we were interested in measuring engagement in terms of seconds spent on a page. We want to compare engagement when the background color of a website is blue versus engagement when the background color of a website is red. Our analysis will be of the form $$Y(background\_color=blue) - Y(background\_color=red)$$, where $$Y$$ in this case is the number of seconds spent on the page. The difference gives us the effect size and direction changing the background color. The causality literature refers to the two values that $$background\_color$$ may take on as *potential outcomes*. If the default backround is $$blue$$ and we are testing out background $$red$$, then we might refer to to $$background\_color=blue$$ as the control and $$backgroud\_color=red$$ as the treatment[^1] and use the shorthand $$Y(0) - Y(1)$$.

In a perfect world, we would have [mastered the ability](http://www.imdb.com/title/tt1119644/) [to cross between parallel universes](http://www.imdb.com/title/tt0112167/). This would allow us to know the result of both outcomes and to measure the effect exactly for every individual. However, since we have not yet developed the ability to conduct experiments in parallel universes, we will have to settle with some mathematical reasoning instead.

[Rubin's potential outcomes](https://en.wikipedia.org/wiki/Rubin_causal_model) allow us to think about effects in aggregate and reason backwards to the individual. The simplest path from aggregate data to individual inference is the *average treatment effect*, or $$ATE$$. The $$ATE$$ measures the average $$Y(0)-Y(1)$$ across the whole population. If we run a single experiment, we get a single estimate of the $$ATE$$, which we denote $$\widehat{ATE}$$. We also get a single estimate of the variance around the $$\widehat{ATE}$$, which allows us to estimate how far off a single individual might be from the average effect. If we were to run many experiments and measure many $$\widehat{ATE}$$s, we would converge on the true $$ATE$$ and its true variance. Then for any individual we could bound the effect of the treatment[^2].

# Assumptions that permit estimation of ATE

There are other avenues to estimating the treatment effect for an individual experimental unit, but the $$ATE$$ is the simplest. I'll talk about how to deal with comparisons having more than two values in a later post (e.g., comparing $$blue$$, $$red$$, and $$green$$); for now, let's assume that we are always comparing a treatment and a control.

Before we are able to programmatically generate the set of comparisons, we must first ensure that we are even *allowed* to compare different factors.

**An example**

Here is the PlanOut version of the example above:

    background_color = weightedChoice(
      choices=["#0000FF", "#FF0000"],
      weights=[0.9, 0.1],
      unit=userid);

We might run the analysis by querying a log database. The system would need to automatically log the number of seconds spent on the page; support for this kind of feature is not available in PlanOut directly.

Now what would happen if we instead randomized the background on the basis of the browser version id (assuming that the cardinality of `versionid` is sufficiently high):

    background_color = weightedChoice(
      choices=["#0000FF", "#FF0000"],
      weights=[0.9, 0.1],
      unit=versionid);

If we are still measuring engagement in terms of seconds, we can no longer use the simple difference in means -- the same user may have multiple browsers and/or multiple machines. This means that we may get multiple readings from the same user in one or both of the treatment and the control. If users were unaffected by background color, or had very short-term memories, it is possible that the multiple readings wouldn't matter. Since this is unlikely to be the case, we cannot use $$ATE$$ for engagement here.

On the other hand, what if our $$Y$$ were something indepenent of users? For example, we might be interested in the effect of our treatment on browser load time. Of course, we care about browser load time because it influences engagement, but if change our question (and thus our analysis) to be about the effect of treatment on a feature of the browser, then we can use $$ATE$$ again.

Now suppose we instead set our unit of randomization to `(userid, versionid)`. It is not clear here that there exists a parameter of interest proxied by this tuple.

Since we do not know what the parameter of interest is, we can only reason about what we see in the program. In order to compute estimators, we require that:

1. Units of randomization are the same throughout the PlanOut script.
2. Units or randomization are single values (i.e., not tuples or lists).

**Extracting Contrasts**

We start with the simplifying assumption that there are no return statements. We can reaon about return statements later by copying the program graph and removing unreachable edges. Nodes with no edges will be pruned from the graph.


    function IsConstant(Program graph G, node) 
        For a given node, traverses the program to see if the value is constant, iff:
        1. The variable is set only once.
        2. The value the variable is set to is not random, nor external.

    function InferRand(Program graph G, Set of random nodes S, node, n)
        if n in S
        then
            1. S' <- S + node
            2. return S'
        else 
            1. for n' in Parents(n)
                  if n' in S
                  then
                      1. S' <- S + node
                      2. return S' 
                  else 
                      1. S' <- InferRand(F, S, node, n')
                      if S' <> S
                      then 
                          1. return S'
            2. return S

    function GetContrasts(Program graph G, Set of random nodes S)
	    1. C <- List of contrast tables, initialized empty
        2. for each node in a topological sort of nodes in G
           if not IsConstant(G, param) and not External(G, param) 
           then
               1. LHS <- {}
               2. RHS <- {}
               3. for each parent of node
                  if parent is in S
                  then
                      1. LHS <- LHS + parent
                      if parent has a contrast in C
                      then
                          1. c <- parent's contrast from C
                          2. RHS <- RHS + c.rhs
                  else 
                      1. RHS <- RHS + parent
              4. C <- {rhs: RHS, rhs: LHS}::C
        3. return C

**IsConstant**
We don't always know whether a parameter is constant at assignment. The following two scripts produce equivalent contrasts and propensity scores:

    foo = "foo!";    
    group_size = uniformChoice(choices=[1, 10], unit=userid);

<br/>

    foo = "foo!";
    if (bernoulliTrial(p=0.5, unit=userid, salt="coin")){
        group_size = 1;
    } else {
        group_size = 10;
    }

We do not want to treat `group_size` as a constant in the second script, even though we only observe it taking on constant values. We also do not want to treat constants as factors in our experiment -- there is no point in cluttering our analysis or contrast tables with parameters like `foo`.  `IsConstant` helps us filter these variables from valid contrasts of interest.

**InferRand**
`InferRand` classifies a node as a random variable iff:

1. It is the direct result (i.e. an $$l$$ value) of an assignment by a random operator OR
2. It has at least one ancestor that is in the set of known random operators.

There might be some edge case where an operator has an ancestor that is a random variable, but itself is not a random variable. The only thing I can think right now is where there is some random variable that flows into a function that produces a deterministic outcome. For example, would we consider `bar` below to be a random variable?

    foo <- uniformChoice(choices=[1,2,3], unit=userid);
    bar <- foo * 0;

Clearly `bar` is always 0 -- but could we also say that `bar` is a random variable with measure 0? This specific case follows from the data involved, but it's concievable that we might have a function like Scott's [**K** combinator](https://en.wikipedia.org/wiki/Combinatory_logic#Examples_of_combinators). It's unclear to me whether this is truly problematic.

**GetContrasts**
`GetContrasts` operates over a toplogical sort of the program graph, from roots to leaves. If a parameter is not a random variable, then we skip over it. If a parameter is a random variable, then we partition its parents so that random variables are listed in the LHS and variables of unknown distribution are listed in RHS. Since the parents may themselves be conditioned on values in their RHSs, we check to see if we have already processed their dependencies, and we add these to the current node's RHS[^3].

Some of the parameters on the RHS will be conditioned on specific values. Consider the example in [my previous post]({{base.url}}/estimator_inference.html). Since there is no subsequent in the if-statement, the set of values on the on edges from parameters in the guard to their descendents are only those that make the guard true. These values can be populated in a post-processing step.

Finally: HAPPY LEAP DAY!!


[^1]: <small> Note that in this example, and indeed for any example related to changing the status quo, we will have a latent dependency on subjects' aversion to change: the comparison between the two colors doesn't really compare apples to apples, since users have become accustomed to the blue background. The only way we could truly know the best background color would have been to roll out the website with multiple possible background colors. The way I've framed the problem assumes that the question we are asking is: which background color leads to the highest engagement? Knowing the answer to this question is important for a freelance graphic designer, but it typically isn't the hypothesis that a company would be testing. A company *wants* to roll issues of aversion to change into the experiment, since they pay a cost for this latent variable when users leave the website. </small>

[^2]: <small>See [Gerber and Green's excellent book](http://www.amazon.com/Field-Experiments-Design-Analysis-Interpretation/dp/0393979954/ref=sr_1_1?ie=UTF8&qid=1456762904&sr=8-1&keywords=field+experiments) for a more in-depth discusson of these concepts, aimed at social scientists.</small>

[^3]: <small> The main case where I could see this not working is if we have a dependency of the form $$X|A$$, where $$A$$ does not appear alone on the LHS of any of the already processed nodes. Note that if $$A$$ does not appear at all on the LHS of the already processed contrasts, this means it's either constant or external. If it is not alone, then there is some contrast of the form $$A,B_1,\ldots B_n | C$$, where $$n\geq 1$$ and $$C$$ is possibly empty/null. I suppose this would only happen if B > A in the sort. Since $$B$$ is on the LHS, we can always marginalize it out, giving us $$A|C$$. So, I guess it isn't a problem after all...
</small>
