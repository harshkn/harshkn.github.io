---
layout: post
type: post
comments: true
author:
  display_name: Emma Tosch
---

Back in October, [Brendan](http://brenocon.com/) mentioned that [some](http://www.hsph.harvard.edu/miguel-hernan/) [folks](http://www.hsph.harvard.edu/james-robins/) at Harvard were working on [a new book](http://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/) for causal inference that unifies concepts from both the graphical models literature and the counterfactual reasoning literature.

So far, I've found the drafts they've posted online very accessible. In fact, I strted reading it after writing a few blog posts on PlanOut and what I've been learning from the social science causal inference literature, and this book has put things in terms similar to how I explain the concepts to myself.

One particularly cool insight is this very evocative image in their first chapter, used to describe the difference between causation and correlation:

<!--summary-->

![Correlation vs. Causation]({{ base.url }}/assets/corr_cause.png){:style="width:100%"}

Another gem, this time from Chapter 2:

> Randomization is so highly valued because it is expected to produce exchangability. When the treated and the untreated are exchangable, we sometimes say that treatment is exogenous, and thus *exogeneity* is commonly used as a synonym for exchangability.

*Exchangability* and *independence* are concepts we're introduced to in machine learning or statistics. I've found myself having to recite "endogenous == correlated with the outcome" to remember what *endogenous* and *exogenous* variables are. The confusion arises, of course, from the fact that *endogenous* and *exogenous* are overloaded terms in computer science. It isn't surprising that *exogenous* $$\leftrightarrow$$ *exchangable*, but it isn't something I would have come up with on my own, at least not without sitting around and thinking about it for a while.

