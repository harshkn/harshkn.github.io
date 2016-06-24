---
layout: post
title: Background Assumptions
type: post
comments: true
author:
  display_name: Emma Tosch
---
What are the priniciples that make an experimentation system sound? We'll discuss in a future blog post how to make the experimentation-analysis pipeline correct by construction, and what correctness means in this context. First, however, we need to to look at the set of basic assumptions that allow us to reason about the interactions between concurrently running experiments, variables or parameters not represented in a particular experimental procedure, and those parameters of interest. The underlying experimentation system must reflect these assumptions; if it does not, then all of our analyses may be invalid.

<!--summary-->

Many institutions have invested in experimentation systems over the years. Some of these experimentation systems are vertically integrated, stand-alone applications. Some cordon off a critical part of the experimentation-analysis pipeline and interface with modules used by other systems. Here's a quick sample of available technologies (dear reader, if you can suggest more, please do so below, in [the comments](#disqus_thread)).

| System | Year | Venue | Institution | Purpose
| --- | :---: | :---: | :---: |
| Gatekeeper | [2015](http://sigops.org/sosp/sosp15/current/2015-Monterey/printable/008-tang.pdf) | [SOSP](http://sigops.org/sosp/sosp15/current/index.html) | [Facebook, Inc.](https://www.facebook.com/notes/facebook-engineering/building-and-testing-at-facebook/10151004157328920/) | Configuration Management |
| [PlanOut](https://github.com/facebook/planout) | [2014](http://hci.stanford.edu/publications/2014/planout/planout-www2014.pdf) | [WWW](http://www2014.kr/program/program-at-a-glance/) | [Facebook, Inc.](https://www.facebook.com/notes/facebook-data-science/big-experiments-big-datas-friend-for-making-decisions/10152160441298859/) | Experiment Scripting Language |
| [Trebuchet](https://github.com/airbnb/trebuchet) | [2014](http://nerds.airbnb.com/experiment-reporting-framework/) | Unpublished | [Airbnb, Inc.](http://www.airbnb.com) | Experiment Management |
| [3X](https://github.com/netj/3x) | [2013](http://ilpubs.stanford.edu:8090/1080/1/3x-demo.pdf) | Unpublished | [Stanford Univ.](http://infolab.stanford.edu/db_pages/projects.html) | Experiment Management |
| [Feature](https://github.com/etsy/feature) | 2013 | Unpublished | [Etsy](https://www.etsy.com/) | Experiment Management |
| [psiTurk](https://github.com/NYUCCL/psiTurk) | 2012 | Unpublished | [New York Univ.](http://gureckislab.org/cogsci_workshop/) | Experiment Management |
| [TurkServer](https://github.com/TurkServer/turkserver-meteor) | [2012](https://github.com/TurkServer/turkserver-meteor) | [HCOMP](http://humancomputation.com/2012/Welcome.html) | [Harvard Univ.](http://www.harvard.edu) | Experiment Management
| [Google Analytics](https://developers.google.com/analytics/solutions/experiments-feature-reference) | 2012? | Unpublished | Google | A/B tests |
| [Layers](https://github.com/cloudera/gertrude) | [2010](http://research.google.com/pubs/pub36500.html) | [KDD](http://www.kdd2010.com/) | Google, Inc. <br/> Cloudera, Inc. | Experiment Management |
| Experimentation Platform | [2006+](https://expplatform.sharepoint.com/Pages/default.aspx) | KDD | Microsoft | Unclear |
| Unnamed System | [2004](http://ai.stanford.edu/~ronnyk/emetricsAmazon.pdf) | Unpublished | Amazon.com, Inc. | Automated A/B tests |


Here we describe the issues they've uncovered and attempt to describe the necessary and sufficient assumptions an experimentation system must have, in order for the kinds of analyses we are proposing to be valid: any analysis we do statically is based upon a model of the dynamic part of a system. Randomization may be very sensitive to incorrect modelling in the dynamic part of system, especially when it involves human behavior. We discussed some of these issues previously [in a prior post about the basic requirements for crowdsourcing systems]({{ base.url }}/crowdsourcing_basics.html).

# Sampling-Related Assumptions

At the very start of the experimentation-analysis pipeline, we must have a reliable way to sample the population. The [PlanOut paper](http://hci.stanford.edu/publications/2014/planout/planout-www2014.pdf) describes a system at Facebook that allocates "segments" to experiments. Segments appear to be constant-sized groups of `userid`s. If we were operating over a much smaller population, say on my new business's website, then we might allocate users as they arrive. However, in the face of Internet-scale experimentation, we would want to allocate users in chuncks. In a lot of ways, the segmentation logic sounds a big like memory allocation, where the experimenter "frees" a segment by ending the experiment. The Facebook implementation sounds like it's done mostly over accounts, but you could imagine a general system that allocates segments according to whatever ids are relevant (and for all I know, they could have multiple segment allocators).

<!-- One of the things that makes `userid`s weird/useful is that they allow some degree of replication -- every user is a unique entity, but we want to make inferences over populations.  -->

However, each company/institution/service may institute limitations on sampling policies for their products, since bad experiences have serious consequences for the reputation of the company/institution/service. For example, [Netflix treats existing and new users as different pools](http://dl.acm.org/citation.cfm?id=2843948) for their experimentation system. [Airbnb must account for non-users and unconventional workflow](http://nerds.airbnb.com/experiments-at-airbnb/). 

# Deployment-Related Assumptions

On its surface, controlled experimentation is easy: once we have selected our participants, we just randomly allocate them to variants. However, this simple act of allocation becomes much more thorny when we consider the complexity of users interacting with an online system. Before we can even reason about what might happen when "things go wrong," we must first consider what it means for "things to go right."

The [Google Layers paper](http://dl.acm.org/citation.cfm?id=1835810) gives an informal specification for a massive experimentation system requiring both a large number of participants and a large number of concurrent experiments. In a perfect world, all parameters could be varied independently; this would allow many experimenters to run their experiments concurrently, so long as the parameters of interest do not overlap. Formally, suppose experimenter $$A$$ is doing an experiment using some set of parameters whose names are represented by$$\lbrace A_1, \ldots, A_n\rbrace$$ and experimenter $$B$$ is doing an experiment at the same time using some set of parameters whose names are represented by $$\lbrace B_1, \ldots, B_m\rbrace$$. So long as $$A \cap B = \emptyset$$, the two experimenters may run both of their experiments at the same time, *on the same population*.


However, since we don't live in an ideal world, we need to deal with the fact that many times, parameters of interest may not be varied independently. For example, if $$a_i$$ is `text-color` for buttons and $$b_j$$ is `background-color` for buttons, we will have a disasterous situation if we allow *text-color* and *background-color* to be set to the same value. The quick-and-dirty way of handling this is to just ensure that this never happens. The smarter way is what this paper suggestions:

> The solution we propose in this paper is to parittion the parameters into subsets, and each subset contains parameters that cannot be varied independently of each other. A subset is associated with a layer that contains experiments, and draffic diversion into experiments in different layers is orthogonal.


# Analysis-Related Assumptions

The vast majority of experimentation systems run A/B tests on a target population. This means no conditional random assignment, no complex routing through external services, and in most cases, randomization on `userid`s alone. Under these conditions, we can almost always analyze the experiment variants using [average treatment effect]({{ base.url }}/simple_difference_in_means.html).


# Future Work

**Linking analyses properly** One of the things we'd like to be able to do in the experimentation-analysis pipeline is to formally hook up the generated contrasts with the variable of interest $$Y$$ during the analysis phase. The Google layers authors bring up an important point about analysis and metrics:

> Standardized metrics should be easily available for all experiments so that experiment comparisons are fair: two experimenters should use the same filters to remove robot traffic when calculating a metric such as [click-through rate].

We are agnostic about what $$Y$$ is when we analyze Planout scripts. However, we may want a library of $$Y$$s for users to choose from. That is, instead of allowing users to build their query for $$Y$$ using raw user data, such as a database query of reuslts, they would need to either use a predefined metric or implement a new one with a standard name.

<!-- # Questions/Concerns -->

<!-- The author's mantra for experimentation is *more, faster, better*. When describing what they mean by *better*, they write: -->

<!-- > Invalid experiments should not be allowed to run on live traffic. Valid but bad experiments (e.g., buggy or unintentionally producing really poor results) should be caught quickly and disabled. -->

<!-- Kohavi -->
<!-- "Trustworthy controlled experiments" -->

<!-- **Security and Privacy** -->
