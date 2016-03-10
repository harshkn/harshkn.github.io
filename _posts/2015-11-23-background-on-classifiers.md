---
layout: post
title: Background on Classifiers
date: 2015-11-23 16:46:00
ispublished: true
status: published
tags: [surveyman]
author:
  display_name: Emma Tosch
---

Sometimes I think we should give up on the classification of bad actors in SurveyMan -- it's a very hard problem and developing solutions feels very far afield from what I want to be doing. Then I see [blog posts like this one](http://andrewgelman.com/2015/11/16/is-84-less-than-3-11-of-respondents-say-yes/) that show the limitations of _post-hoc_ modeling and the pervasiveness of bad actors. As some of the commenters pointed out, if people were responding randomly, then we could treat their responses as noise. However, what they are pointing out is that people in fact do not respond randomly -- there may be some questions that are more likely to elicit "incorrect" responses than others, which puts us in bias detection territory.
<!--summary-->
SurveyMan comes equipped with a variety of classifiers for deciding whether a response comes from a bad actor. Different classifiers come with different sets of assumptions and different power. In particular, I was focused on developing classifiers that leveraged SurveyMan's randomization and structural features. Since we have a simulator, it might make sense to take a look at classifiers that make modeling assumptions as well.

<!-- What are the differences between classifiers? Some responses are classified the same way, regardless of classifier, but what do the boundary cases look like? How might we systematically bias results -->

## Prior work

Given the amount of work on other aspects of survey design, we initially found it surprising that there wasn't much on the quality of responses. Part of the reason why this kind of modeling is difficult is because it is so contingent on the survey instrument. When we began investigating bad actors in 2013, we cited [Meade and Craig](http://ubc-emotionlab.ca/wp-content/uploads/2012/06/Meade-Craig-2012-Careless-Responding-in-Survey-Data.pdf). According to Google Scholar, this paper (published in 2012) now has 180 citations and so far as I can tell, it is still the best review of the problem. I thought it would be good to revisit this paper, since it's been a while.


### Literature

In this post, we will focus on the contributions of Meade and Craig. However, I want to start by pointing out some interesting [prior work](http://www.personal.psu.edu/faculty/j/5/j5j/papers/JRP2005.pdf) that they cite. I found two pieces of these paper particularly interesting and possibly useful for background in future papers:

1. Use of simulators in assessing the validity of psychological instruments:

    > Validity scales must themselves be validated, and this is normally
    > accomplished by instructing experimental participants (or computers) to simulate a
    > particular kind of invalid responding (e.g., responding randomly; faking good or
    > bad). A successful validity scale correctly identifies most simulated protocols as
    > invalid while misidentifying very few unsimulated protocols as invalid.

    I had not seen this mentioned previously and need to look for citations. It gives us a nice precedence in the psychology community for using our simulator.

2. Even more prior work on the tradeoff between improving the accuracy of the instrument (as Gelman would say, a measurement issue) with the effect of identifying (whether accurately or inaccurately) bad actors:

    > Accurately identifying
    > relatively rare events, even with a well-validated scale, is in principle a very difficult
    > psychometric problem (Meehl & Rosen, 1955). Furthermore, research indicates that
    > “correcting” scores with validity scales can actually decrease the validity of the measure
    > (Piedmont, McCrae, Riemann, & Angleitner, 2000). Piedmont et al. conclude
    > that researchers are better off improving the quality of personality assessment than
    > trying to identify relatively infrequent invalid protocols.

    I see several issues with this assessment. Of course, the main problem is that inattentiveness and intensional misrepresentation may not be rare events (and in fact current research and the point of this post is that they are not!). Furthermore, as a computer scientist, I am concerned that we are inducing an arms race here. We know that the instrument is flawed for inattentive respondents. We also assume that inattentive respondents are not malicious. They will not adapt their behavior _in response_ to a change in policy. This isn't to say that their behavior won't change -- over time, we may see survey respondents in general become more or less attentive, or for their attentiveness to respond to different interventions, but the key here is that there is no causal relationship between the policy or protocol or instrument (or whatever term you prefer) and inattentive responses (which of course is not true in the general case, but we'll get to that later). The behavior of inattentive respondents contrasts with the behavior of respondents who deliberately misrepresent themselves (we can update our model later, but for now assume that bad actors belong to one of these two classes, rather than a mixture of them). 



Meade and Craig review five methods of detecting bad actors (i.e., people who provide "careless responses") and perform two studies for measuring the effectiveness of these methods. They estimated 10-12% of their participants (undergraduates) responded carelessly. This proportion is smaller than what [a previous study](http://www.personal.psu.edu/faculty/j/5/j5j/papers/JRP2005.pdf) had estimated.
<!--This previous study looked at three major threats to validity in web surveys: (1) "linguistic incompetence", (2) inattentiveness, and (3) intensional misrepresentation. They defined linguistic incompetence to be issues with reading level. Since SurveyMan permits branching, pollution of the data via linguistic incompetence can easily be prevented by beginning the survey with a branching question that measures comprehension. Indeed, our collaborators in linguistics were very interested in augmenting SurveyMan with pre-tests to determine eligibility. Inattentiveness and intensional misrepresentation form the core challenge with extant methods for identifying bad actors: inattentiveness may be random, but intentional misrepresentation is not.
The authors propose using the same methods that have been used to detect linguistic incompetence to detect careless responses. This might work for us, since we randomize surveys, but it does not detect fatigue. -->
In any case, what I see as perhaps the most important contribution from Meade and Craig to SurveyMan is that they found that features of the data (the topics being measured, the features of the survey) had a strong influence on their ability to identify careless responses. Their recommendations are features that SurveyMan might suggest the survey writer add, if the static analyses find it especially difficult to classify respondents as bad actors.

Meade and Craig make the following contributions:


1. 
    > ...we provide the first investigation of a
    > comprehensive set of methods for screening for careless responding
    > and provide an understanding of the way in which they relate
    > to one another and observed data responses.

    This comparison very nicely provides empirical backing for some suggestions for best practices. Although not all of them will be applicable to SurveyMan, it's nice to see them laid out in a clear and well-thought-out study.

	In particular, they break their classification into two stages: those that involve augmenting the survey before deployment, and those that include specialized analyses.

	Methods that involved tweaking the survey instrument included:

	* **Prompts urging respondents to pay attention, and reduce their anonymity**. Respondents were asked to either electronically "sign" a statement of good faith, or initial each page of questions. 
	* **Social desirability scales**. These are culturally relative. The idea is that there is a general gold standard of qualities we expect respondents to identify as strongly desirable or strongly undesirable. The paper included a citation (Paulhus 2002), but I have not read this paper, so I don't entirely know what this means. My interpretation is that respondents who are acting in good faith will respond to questions in a way that is consistent with general social mores (e.g., theft and murder are generally bad, no one thinks of themselves as racists, etc.). 
	* **[Lie scales](http://www.mmpi-info.com/mmpidict1)**. I really don't know what these are, and not being part of the community, I suspect I'm not going to anytime soon. From what I gather, they are part of a psychological battery that only a sociopath would answer "correctly."
	* **Nonsensical, bogus items**. These are the closest to things I've seen in the general survey literature, and are commonly described as being a subset of "attention-check questions." These are questions with a single, known valid response and can be used to flag potentially inattentive respondents. They are the kinds of questions we could automatically inject into surveys that have insufficient entropy bounds (assuming that entropy is actually a useful measure).
	* **Scales of consistent responding**. This is another idea drawn from the psychology literature, and is the sort of thing we have actually talked about trying to optimize: some questions are essentially redundant, and this index is supposed to measure internal correlations in the survey. SurveyMan allows respondents to flag questions whose responses we expect to be correlated (although this method advocates for a much stronger condition--that the questions be statistically identical). Ideally, once we have collected enough information to learn a reliable classifier for a particular survey, we should be able to prune these questions.
	* **Self-report measures**. Ask the respondents whether they really tried, and whether we should use their results.


	Methods that involve performing specialized analysis include:

	* **Response consistency**. The previously mentioned consistency method above involves injecting questions *known* to be essentially identical. This method looks at questions that are either suspected to be correlated, or are found to be correlated empirically. SurveyMan actually performs this analysis in practice (and has since we released the software two years ago).
    * **Response pattern indices**. The authors look for unlikely strings of responses. This approach should be a relative non-issue for us, due to the pervasive randomization in SurveyMan, but we should probably implement something like it for cases where people turn randomization off.
	* **Outlier analysis**. This, of course, is the heart of what we try to do in SurveyMan, since it is almost totally domain-agnostic. The work of Meade and Craig is informed by some domain knowledge, and I would like to see if anything they do is applicable to SurveyMan.
	* **Response time**. This is hands-down the most asked-about feature that we don't provide as a default. My main reasoning is that classifiers based on timing can be gamed. In contexts such as AMT, you provide a time limit for tasks, which should be an upper bound, but inevitably it changes user behavior. It isn't clear that response time is interpretable across tasks, nor across platforms. Within tasks and platforms, perhaps we are interested in outlier analysis. However, I suspect this will only catch a few very very very stupid respondents (who should be caught by other methods anyway). In conclusion, I feel it's a bit of a strawman, but in past versions, I have provided [example injectable Javascript](https://gist.github.com/etosch/9241545).

2. 
    > ... we examine
    > the latent class structure of a typical undergraduate respondent
    > sample using both latent profile analysis and factor mixture modeling,
    > revealing data patterns common among careless responders.

    It wasn't entirely clear to me how they did this. They say that "raw item-level data matrix" is very large. Presumably this meant that there were many questions with many options. Here is the setup: the authors administered a mix of several personality assessments. One of them was a 300-item personality test (the [International Personality Item Pool (IPIP)](http://ipip.ori.org/)). I took a version of the test [here](http://www.personal.psu.edu/~j5j/IPIP/ipipneo300.htm). Some of the questions were clearly rephrasings of the synonymous or antonymous versions of other questions, meant to build in some redundancy to increase accuracy. You can see an example of the assessment that's returned in [a previous post]({{ site.base_url}}/my_personality.html). This is what the text says:

    > Recent evidence suggests that Mahalanobis
    > distance can be effective at identifying inattentive responses
    > (Ehlers et al., 2009). Given the large size of the raw item-level data
    > matrix, using all survey items simultaneously would have been
    > computationally intensive. Instead, five Mahalanobis distance
    > measures were computed for each respondent, one for each of the
    > five broad personality factors (60 items per factor). The correlations
    > among the five Mahalanobis distance measures were in
    > excess of .78 (p < .05) and were averaged to a single Mahalanobis
    > distance value.

    It looks like they took the codings for each of the personality domains and clustered those questions together before performing outlier analysis. In the past, the only mechanism we have given survey writers to describe clusters in their surveys has been the correlation column, which allows them to tag questions. Here is my best guess for the procedure they used: every 7-point scale is treated as  a random variable. Each question has as tag known *a priori* indicating which of the five measures it belongs to. For each measure (i.e. domain), it treats some set of questions that measure that domain as its own dimension. For the 300-question inventory I took, this gives us approximately 60 questions per domain -- therefore, it gives us a 60-dimensional space in which we need to find the center. Note that the analysis requires that the space we are analyzing be $$\mathbb{R}^{60}$$. (It isn't clear if the 60 questions that would make up one of these factors are they same 60 questions that make up their analyses, since they used a series of personality tests).

    <!--
**Digression:** Many analyses have a mismatch between the scale we use to measure and the true, underlying scale we wish to estimate. Regression analysis works best when we are at least on an *interval scale*, if not a *ratio scale* of measurement. What this means is that we at least need to be able to make meaningful arguments about the sizes of differences between measurements, and it would be even better if there were a meaningful notion of what zero means. Self-assessment via Likert scales presents three major measurement issues: (1) it requires that the user discretize their response, (2) scales are individualized and therefore potentially incomparable across subjects and (3) the lack of objectivity (these instruments ask people how they feel
-->

    **Side Note:** I think the alternative analysis they were talking about might have to look at outliers from the center of a 300-dimensional random variable. Instead, they averaged these 5 60-dimensional ones. Note that we can construct an example where these two methods are not equivalent.

    Anyway, I see three main ways we can use Mahalanobis distance in SurveyMan:

    1. **As part of the cluster classifier.** Right now, we try to cluster all responses into *valid* and *invalid*. I've rotated through several ways of using it, and right now we inject sufficient known random respondents so that we have at least 10% bad actors, and use the majority of respondents in a cluster to determine the cluster's classification (where "real" data is initially classified as unknown, but gets counted as valid). I've also used it in the "stacked" strategy, which first clusters, then labels using the LPO strategy, and again uses the majority label of the cluster to update the labels on the remaining cluster. I see Mahalanobis distance as useful to update the score for individual responses. At the moment, we don't have a summary statistic to attach to each response, so comparing within the cluster isn't easy. Adding Mahalanobis distance for each response from the distribution should help.
	2. **As its own classifier**. I'm not really sold on this one, but we could just treat an $$n$$-question survey as an $$n$$-dimensional random variable. It isn't great for heterogeneity in responses, but if we break out the analysis by path (which we should be doing anyway), it might work nicely.
	3. **In conjunction with user-provided correlation labels.** This I think would be really cool. It would basically be the same strategy as what this paper is suggesting, where, if the psychometric questionnaire the paper uses were a SurveyMan program, we would just label the questions with their appropriate domain.

    The authors were also interested in whether there were different types of careless respondents. They did a "latent factor analysis," which so far as I can tell was something like PCA on the "indices." In particular, since they were using a psychometric survey, they wanted to see if there was some correlation between the subdomains of agreeableness and the indices they tabulated. This isn't particularly generalizable to SurveyMan, but is clearly of interest to people who run psychometric surveys. 


3. 
    > ... we provide an estimate to the prevalence of careless responding
    > in undergraduate survey research samples.

    They reported 10-12% careless responses. 

4. 
    > ... we
    > examine the role of instruction sets (anonymous vs. identified) as
    > well as the efficacy of response time and self-report indicators of
    > careless responding.

    They performed some nice simulations with injected data and generally found what you would expect -- when responses are clearly clustered (uniform random vs. true or gaussian random vs. true), it's much easier to identify careless responses than when a given respondent exhibits a mixture of behavior. In SurveyMan, we try to use the option of submitting early as a proxy for self-classification of the time of the changepoint when a respondent goes from being conscientious to being careless. 


We'll see if we can validate some of these contributions in simulation and work them into SurveyMan's classifier system. One thing I would like to note is that there was no discussion of partitioning or resampling the data for the hypothesis tests. There are *a lot* of hypotheses being tested in this paper. However, it's pitched in an exploratory way, and there aren't any strong recommendations that come out of the paper, so I am not too bothered by it.


Note: [Gelman](http://www.stat.columbia.edu/~gelman/) [posted a response](http://andrewgelman.com/2015/11/16/just-filling-in-the-bubbles/) from [someone](http://www.uaedreform.org/collin-hitt/) who is currently looking at [the effect of non-cognitive tasks on standardized test performance](http://www.uaedreform.org/downloads/2015/07/edre-working-paper-2015-06.pdf). I only skimmed this paper, but standardized testing might be a good way to test the effectiveness of our classifiers in the wild. 
