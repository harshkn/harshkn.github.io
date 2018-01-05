---
layout: post
title: Replication vs. Reproducibility
comments: true
author:
  display_name: Emma Tosch
  email: etosch@cics.umass.edu
categories:
 - research
---
**Note: I am posting this from home today, where we cancelled our internet service. I am pushing over my phone's mobile data. Since I'm not sure how much data I'll be using, and since I don't want to wait and then forget to post this, I'm not putting links into this particular post. Apologies!**

Reproducibility is something I first started to care about while working with my first PhD supervisor, Lee Spector. One of the things that really drew me to PL was the growing community interest in reproducibility. However, it was only after looking at the ISSTA CfP and its discussion of reproducible studies that the distinction between replication and reproduction really started to gnaw at me.

<!--summary-->

The concept of a *unit* is central to the Rubin causal model and completely absent from the Pearl model. Pearl addresses it in a footnote in Causality, effectively asserting that units are a collection of covariates drawn from a distribution and could be incorporated as needed into a causal DAG. I had previously read a book that discussed units in terms of replication; I believe it was a book on experimentation by George Casella (and someone else) and I also recall it referring to units as replicates (or at least I think that was the term). In any case, it struck me that units or replicates or the Pearl model all deal very well with replicating an experiment (or replication within an experiment), but don't address at all reproducing an experiment. I know that randomization, field experiments, sampling, and other techniques/approaches/methodologies can be framed as measures to ensure reproducibility, but I'm not familiar with any formal frameworks for discussing reproducibility. The only thing I can think of at the moment is a  statistic called $$prep$$, which I believe was supposed to be a p-value for the reproducibility of p-values (though my recollection may be entirely incorrect).

Mostly I'm just wondering whether it would be fruitful to have a different framework for discussing repdocubility, or the conditions of experimentation. I know that one can always plugs those variables into the causal DAG, but should one? (Insert clever comparison of Lisp and ML here.)
