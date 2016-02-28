---
layout: post
title: Chained Experiments
author:
  display_name: Emma Tosch
---

I was looking back over old GitHub issues and the [oldest one I still have open](https://github.com/SurveyMan/SurveyMan/issues/243) is from two years ago. It's about adding qualifications back into [SurveyMan](http://surveyman.org). I had previously removed all qualifications from SurveyMan, since the way it handles needing to get more data is quite different from [AutoMan](http://automan-lang.org). I wanted to add qualifications back in in the event that we would want to chain together surveys or do more longitudinal studies. Now that I've had some exposure to how experimentation systems are run at large companies, I have a better idea of how to incorporate a general mechanism for managing this kind of data collection at scale.

<!--excerpt-->

# AutoMan vs. SurveyMan

It's helpful to start with a comparison between how AutoMan and SurveyMan ask for more data.

## AutoMan's posting algorithm
1. $$n \gets$$ sample size that will give 95% confidence interval that agreement is an outlier
2. post 1 HIT ($$H_0$$) with no qualifications on AMT having *n* assignments
3. if the observed agreement is sufficiently high then **return**
4. else while we have not observed sufficiently high agreement and we still have money
    1. grant those who have already submitted responses for HIT $$H_{i-1}$$ a qualification $$Q_i$$
    2. post 1 new HIT ($$H_i$$) with qualification $$\neg(Q_1,\ldots Q_i)$$ having *n* assignments

The AutoMan approach considers each round independently. Of course, if respondents where completely random, we would quickly see a false positive and hit stopping condition, generating a false positive. However, in practive, there are significantly fewer random or lazy respondents for these kinds of jobs, so AutoMan jobs either converge quickly, or they reveal ambiguity in the task via divergence on point estimates.

## SurveyMan's posting algorithm

SurveyMan operates a little differently. AutoMan randomizes the response space so that random behavior and positional bias look the same. Agreement amounts to collision, which, if the sample space is sufficiently large, is highly unlikely. So, given the very low probability of randomly agreeing, we can say with high confidence that agreement is evidence of two respondents not behaving randomly. In the context of the kinds of questions AutoMan is trying to answer, low-probability agreement leads us to make a decision -- we have an answer and can stop our polling.

In SurveyMan, we are asking a different question. We are not necessarily looking for agreement -- instead, we are looking for behavioral consistency across a population. Generally when practitioners are doing survey research, they have some prior knowledge of the population ahead of time and use that knowledge to sample the population, *regardless of the composition of the survey instrument itself*. Think about it this way: if our population is sufficiently small, we can just take a census. Let's say I am in a classroom and I require that all of my students vote on whether they want a take-home exam or an in-class exam. After voting, I know the true proportion of the preferences of the  population (of course, this does not take into account the validity of the method chosen -- is voting done by secret ballot or by a raise of hands? Do I allow some students to abstain from voting?). All of this is to say that deciding the sample size is something that's [tricky to do online]({{ site.base_url}}/smarter_scheduling.html) and is typically done offiline. Surveys that use [probability sampling](http://www.people-press.org/methodology/sampling/why-probability-sampling/) must take nonresponse into account when selecting a sample size. Surveys that use [conveninece sampling](https://en.wikipedia.org/wiki/Accidental_sampling) have additional concerns, such as bias introduced by the sampling procedure. Nearly all AMT research is non-probability sampling. The degree to which this matters depends on the population accepting the HITs and the nature of the HIT. For survey research, it's a serious threat to validity and requires throwing out some data. SurveyMan needs a classification scheme to decide when individual responses are sufficiently egregious that they need to be thrown out. This causes the sample size to be larger than optimal.

So how do we handle sample size in SurveyMan? The user specificies a desired $$n$$, computed offline from their knowledge of the survey domain and population:

while true:

  1. Post 1 HIT ($$H$$) containing the survey, with no qualifications, and $$n$$ assignments.
  2. When we have recieved $$n$$ responses, classify the responses $$\mathcal{R}$$ as valid:
     1. $$n' \gets n - \sum_{r\in\mathcal{R}}\mathbb{I}(classify(r))$$.
     2. if $$n' > 0$$ then
         1. renew $$H$$ with no qualifications
         2. update: $$n \gets n'$$
     3. else **return**


There are two major differences between the AutoMan approach and the SurveyMan approach: (1) the AutoMan approach generates new HITs for each round, whereas the SurveyMan approach simply renews the existing HIT and (2) the AutoMan approach discards in


Wantd to have a generalized version that didn't rely too heavily on AMT-specific abstractions
- AMT
- FB (GK internal)
- ads 
