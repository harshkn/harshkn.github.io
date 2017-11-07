---
layout: post
title: Could Facebook Block Spam Phone Calls?
comments: true
author:
  display_name: Emma Tosch
  email: etosch@cics.umass.edu
---
During one of my between-tasks pomodoro breaks, I read an [article on Gizmodo about Facebook's "People You May Know" feature](https://gizmodo.com/how-facebook-figures-out-everyone-youve-ever-met-1819822691). The obvious high-level perspective I have on this is the impending culture clash between science and policy: many in the tech industry have some kind of scientific training, which prizes testing hypotheses that may be wrong. Being wrong is not an inherently bad thing, because it leads to an improved understanding of the world. Of course, it's always great when you're right the first time, but learning from mistakes is part of scientific discourse. This ethos clashes with politicians and policy makers, who pay dearly for being wrong. The past elections and the rise of the [314Action PAC](http://www.314action.org/) have had me thinking about the differences in perspectives between politicians who typically have legal training versus those with scientific training.

In any case, that's not the discussion I want to be having about the Gizmodo article. I am more interested in whether so-called "shadow profiles" can be used to cut down on spam phone calls.
<!--summary-->

I don't know about you, but I've been getting a crazy number of spam calls recently. I basically never answer my phone, even when it's someone I know, and have my phone on silent most of the time, so these calls are a minor nuisance to me at best. Anyone who wants to reach me quickly already knows how to do so. However, these calls are still annoying, as they accrue on my phone's list of notifications. I typed in some search term that was probably more informative about myself than I'd prefer and came upon [this Boston Globe article](https://www.bostonglobe.com/ideas/2017/05/11/the-onslaught-spam-calls-will-keep-getting-worse/2w1tyrSnzEj8NPO81hUUBK/story.html).

I'd like to highlight some ideas from both articles:
* Your phone number is almost as trustworthy an identifier of you as your social security number.
* Your phone number can be spoofed.
* Spammers spoof numbers with the same area code to entice people to pick up their phones.
* Spammers are not likely to have information about your contact network.
* Facebook has detailed information on a vast network of people you know, built up through distributed means.

If it isn't obvious, what I'm wondering is whether Facebook could use its app to help filter spam callers. One could identify multiple levels of trust. At the highest level are phone numbers that have been manually entered into your contacts. I believe that if you use an iPhone, all contacts are manually curated, but if you use a Google phone (not sure if it's across all Android), this data might be auto-populated via contacts entered in other Google apps. Supposing that you could say with confidence whether someone manually entered a contact, you would give that the highest trust. You could probably calculate the probability of a manually-entered contact's number being spoofed and would probably find that to be very low.

Next would be verified entities in some cluster. You may have friends whom you never talk to on the phone, but whose contact information is on Facebook. This ring of trust would also include local numbers that can be matched to local businesses. Again, if Facebook really does have this network of information, it could use it to assign a confidence to incoming call the way we do with spam filters.

The outer ring of trust would include non-local numbers on the periphery of a person's social network. Since this ring would presumably be quite large, the probability of a spammer spoofing it would be higher.

Now for the technical details: I am assuming that the app can access at least some of whatever phoning app one uses. For a Facebook spam blocker to work, it would need to:

1. Be triggered by whatever the phone equivalent of a system call is, for incoming phone calls.
2. Have access to metadata about the incoming call.
3. Be able to decide whether a number is a spammer in under, say, five seconds.

The last one might be a tall order. Since the center of the circle of trust is already stored on the phone (or in the SIM card) in the form of the contacts, this would be a quick on-phone lookup. The other rings could be farmed to the cloud. This approach doesn't actually add too much value to a user, since they still have to deal with discerning who is a spammer, and don't get any value out of the additional check against their contacts.

What might actually be useful would be to intercede between when the phone call is triggered and when the phoning app is lauched. Then the user would not be disturbed until the incoming number has been classified appropriately.

On the other hand, I suppose that Facebook could also make its own phone app and try to market that instead. I think a decoupled spam blocker would be better (were it possible), since I could see if having a wider appeal. On the other hand, I don't run a multi-billion dollar company, so what do I know?
