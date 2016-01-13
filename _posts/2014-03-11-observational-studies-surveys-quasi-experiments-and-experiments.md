---
layout: post
permalink: obs_survey_quasi_ex.html
title: Observational Studies, Surveys, Quasi-Experiments, and Experiments
date: 2014-03-11 15:57:28.000000000 -04:00
type: post
published: true
status: publish
categories:
- Research
tags:
- experiman
meta:
  _edit_last: '20775'
author:
  login: etosch
  email: etosch@cns.umass.edu
  display_name: Emma Tosch
  first_name: Emma
  last_name: Tosch
---
Across the sciences, researchers use a spectrum of tools or "instruments'' to collect information and then make inferences about human preferences and behavior. These tools vary in the degree of control the researcher traditionally has had over the conditions of data collection. Surveys are an instance of such an instrument. Though widely used across social science, business, and even in computer science as user studies, surveys are known to have bugs. Although there are many tools for designing web surveys, few address known problems in survey design.

They have also traditionally varied in their media and the conditions under which they are administered. Some tools we consider are:

__Observational studies:__
Allowing no control over how data are gathered, observational studies are analogous to data mining -- if the information is not readily available, the researcher simply cannot get it.

__Surveys:__
The next best approach is to run a survey. Surveys have similar intent as observational studies, in that they are not meant to have an impact on the subject(s) being studied. However, surveys are known to have flaws that bias results. These flaws are typically related to the language of individual survey questions and the structure and control flow of the survey instrument itself.

__True Experiments:__
If a research is in the position of having a high degree of control over all variables of the experiment, they can randomly assign treatments and perform what is known as a "true experiment". These experiments require little modeling, since the researcher can simply using hypothesis testing to distinguish between effect and noise.

__Quasi-Experiments:__
Quasi-experiments are similar to true experiments, except they relax some of the requirements of true experiments and are typically concerned with understanding causality.

In the past, there has been little fluidity between these four approaches to data collection, since the media used to implement each was dramatically different. However, with the proliferation of data on the web and the ease of issuing questionnaires on such platforms as facebook, SurveyMonkey, and Mechanical Turk, the implementation of these studies of human preferences and behavior have come to share many core features.

Despite similarities between these tools, quality control techniques for experiments have been largely absent from the design and deployment of surveys. There has been an outpouring of web tools and services for designing and hosting web surveys, aimed at non-programmers. While there are some tools and services available for experiments, they tend to be domain-specific and targeted to niche populations of researchers. The robust statistical approaches used in experimental design should inform survey design, and the general, programmatic approaches to web survey design should be available for experimental design.
