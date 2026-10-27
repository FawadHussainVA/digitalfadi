---
title: "Google Ads experiments: how to run a useful A/B test"
description: "A practical guide to Google Ads campaign experiments: choose a hypothesis, split traffic, read qualified-lead results and avoid misleading A/B tests."
topic: "Strategy"
date: 2026-10-27
order: 25
---

Changing a Google Ads campaign and watching results for a week is not the same as running an experiment. Demand changes, competitors adjust bids, auctions fluctuate and customers behave differently from one day to the next.

**A Google Ads experiment compares a controlled version of a campaign with a modified version, helping you evaluate a change before applying it permanently.** The key is to test one meaningful idea and measure an outcome that matters to the business.

This guide covers Search campaign experiments, practical test design and the mistakes that make results hard to trust.

## What is a Google Ads experiment?

Google Ads supports custom experiments that compare a base campaign with an experiment version. Depending on campaign type and configuration, traffic or eligibility can be split between versions so you can observe performance while the experiment runs.

For Search campaign custom experiments, Google documents options including search based and cookie based splits. The split you choose affects how users may encounter each version; it is **not** a promise that both variants will receive exactly the same impressions or spend.

A campaign experiment is useful when you want to test a specific account level change, for example, a bidding strategy, targeting configuration or campaign structure, while avoiding an uncontrolled before and after comparison.

Google's current instructions are available in [Set up a custom experiment](https://support.google.com/google-ads/answer/6261395?hl=en).

## Start with a testable business question

A useful hypothesis has four parts:

1. **Audience or campaign:** which traffic will be affected?
2. **Change:** what single factor is different?
3. **Outcome:** which result should improve?
4. **Guardrail:** what must not become unacceptably worse?

For example:

> In our existing lead generation Search campaign, testing a more specific landing page should increase qualified lead rate without increasing cost per qualified lead beyond our agreed limit.

That is more useful than "try a new landing page and see what happens."

### Good Google Ads experiment ideas

### Landing page experiment

**Question:** Does a specialist landing page outperform a general landing page?

**Primary outcome:** Qualified lead rate.

**Guardrail:** Cost per qualified lead.

### Bidding strategy experiment

**Question:** Does a different bidding strategy attract more valuable prospects?

**Primary outcome:** Number of qualified leads.

**Guardrail:** Total spend and overall lead volume.

### Keyword targeting experiment

**Question:** Does narrowing keyword targeting reduce irrelevant enquiries?

**Primary outcome:** Qualified leads per 100 clicks.

**Guardrail:** Relevant search reach.

### Offer experiment

**Question:** Does a more specific offer generate better sales opportunities?

**Primary outcome:** Booked consultations.

**Guardrail:** Lead quality and acquisition cost.

A landing page test can also be conducted with a dedicated website experimentation platform. Google Ads campaign experiments are not a replacement for every kind of on site A/B testing; use the method that can isolate the actual variable.

## Step 1: Fix tracking before testing

If your contact form fires a conversion when the Submit button is clicked, even when submission fails, the test may reward the variant that creates more attempts rather than more leads.

Check that successful forms and purchases are counted once, with consistent attribution and values across both versions. For service businesses, consider evaluating **qualified leads** or booked appointments alongside raw form submissions.

An A/B test cannot compensate for faulty conversion measurement. The [Google Ads audit checklist](/learn/what-a-google-ads-audit-should-check/) explains the tracking issues worth checking first.

## Step 2: Change one meaningful variable

Suppose you want to compare a general landing page with a service specific page.

Keep the keyword set, location targeting, offer, conversion definition and other major settings stable where practical. If you simultaneously switch bid strategy, rewrite ads, change budget and launch a new landing page, any improvement becomes difficult to attribute.

There is one important exception: some campaign level tests necessarily alter several connected settings. When that happens, define the test as a **package of changes** rather than claiming a single feature caused the result.

Write down the exact settings of the original and experiment versions before launch.

## Step 3: Pick an appropriate traffic split

An experiment may let you select a portion of the base campaign's traffic or budget for the test, depending on the setup.

A balanced split can make comparison easier when both alternatives are acceptable and the campaign has enough volume. But the correct allocation depends on risk, available traffic and business constraints.

A smaller experiment allocation may protect performance while testing a high risk idea, at the cost of slower learning.

**Important:** A 50 to 50 split does not guarantee a 50 to 50 share of impressions, conversions or spending. Auction eligibility, Ad Rank, bidding and daily budget limits can cause different delivery, as Google's documentation notes.

## Step 4: Decide on success criteria before launch

Choose one primary metric and a small number of guardrails. For lead generation, a practical primary metric might be **cost per qualified lead** rather than click through rate.

Consider this hypothetical result:

### Original campaign

**Clicks:** 600.

**Form enquiries:** 30.

**Qualified enquiries:** 12.

**Spend:** $1,500.

**Cost per qualified enquiry:** $125.

### Experiment campaign

**Clicks:** 590.

**Form enquiries:** 34.

**Qualified enquiries:** 18.

**Spend:** $1,550.

**Cost per qualified enquiry:** $86.11.

> **Interpretation:** The experiment produced six more qualified enquiries with a slightly higher spend. This is a useful observed difference, but the figures alone do not prove statistical significance. The results are hypothetical.

## Step 5: Allow enough time and avoid mid test interference

Google advises that experiments can take time to stabilize and that changing either version during the test complicates interpretation.

Do not declare a winner merely because one variant has a better cost per conversion after two days. The conversion cycle, days of the week and bidding learning can affect the early numbers.

Before launch, estimate the traffic and conversions realistically available during the test. Campaigns that generate only a few conversions per month may not support a trustworthy decision over a short window.

For a business with long sales cycles, evaluate both the immediate enquiry and later sales outcomes where data is available.

## A simple way to think about statistical uncertainty

Suppose Variant A converts 10 of 200 visits and Variant B converts 14 of 200 visits.

1. Variant A observed conversion rate: **5%**
1. Variant B observed conversion rate: **7%**
1. Observed relative lift: **40%**

That sounds decisive. But 10 versus 14 conversions is still a small sample, and random variation could explain part or all of the difference.

**Observed lift is not the same as a proven causal improvement.** A trustworthy decision depends on the full experimental design, variation, conversion volume and uncertainty, not a single percentage.

Avoid repeatedly checking the report and stopping at the first favorable result. Decide your approximate minimum evaluation window and decision criteria up front.

## Step 6: Check the right performance breakdowns

Once enough data has accumulated, look beyond the main average.

Review:

1. **Qualified lead quality:** Did sales accept the enquiries?
1. **Device performance:** Was one version particularly weak on mobile?
1. **Location mix:** Did the split attract different regional demand?
1. **Search term quality:** Did traffic intent change unexpectedly?
1. **Conversion delay:** Are late conversions still arriving?
1. **Budget constraints:** Did one version stop serving because it reached its limit?

Use these cuts to diagnose unexpected results, not to manufacture a winning story from a tiny subgroup.

For international campaigns, avoid assuming results in the US will automatically replicate in the UK, Canada or Australia. If behavior materially differs, the markets may require their own test plan.

## Step 7: Make a decision you can explain

At the end of the test, there are three useful outcomes:

**Adopt:** The experiment provides sufficiently strong evidence of improvement on the agreed business metric, with acceptable risk.

**Reject:** The change appears worse or violates an important guardrail.

**Inconclusive:** There is not enough evidence to justify a firm choice. The next step may be a longer test, a cleaner hypothesis or simply retaining the current approach.

"Inconclusive" is not a failed test. It is a more disciplined answer than pretending the data proves something it does not.

Google Ads may provide an option to apply an experiment to its original campaign or convert it into a separate campaign, depending on the experiment type and current product interface. Recheck settings and monitoring after applying a change.

## Common mistakes when testing Google Ads campaigns

### Comparing this week with last week

Before and after results can reflect changes in demand, competition, holidays or budget. A controlled comparison is better when one is feasible.

### Testing too many changes at once

If the landing page, bidding, keywords and ad creative all change together, you cannot isolate what helped.

### Choosing CTR instead of business outcomes

More clicks are useful only when they advance qualified leads, revenue or another genuine goal. A higher click through rate may produce worse prospects.

### Ending the experiment too early

Small samples fluctuate. A promising first few days are not reliable proof of a winner.

### Ignoring conversion tracking and lead quality

When the measurement is wrong, the experiment can optimize the wrong behavior. If leads are not becoming customers, review [why Google Ads calls are not becoming jobs](/learn/why-google-ads-calls-are-not-becoming-jobs/) and [which bidding strategy to use](/learn/which-google-ads-bid-strategy-should-you-use/).

## Frequently asked questions

### Can I A/B test campaigns in Google Ads?

Yes. Google Ads custom experiments let eligible campaigns run an original and a modified experiment version so you can compare performance before committing to changes.

### Is a 50 to 50 experiment split always best?

No. A balanced split is often easy to interpret, but the appropriate allocation depends on volume, risk and campaign constraints. Equal eligibility does not guarantee equal impressions or spend.

### How long should a Google Ads experiment run?

There is no universal answer. The required duration depends on conversion volume, conversion delay, normal performance variability and the size of the change you hope to detect. Avoid deciding solely from a few days of data.

### Should I test keywords, ads or landing pages first?

Start with the largest well supported business problem. If tracking is broken, fix that. If traffic intent is poor, investigate search terms. If relevant visitors do not enquire, test the landing page experience.

### What if neither version wins?

Keep the current setup or plan a better test. An inconclusive result is useful if it prevents an expensive change based on weak evidence.

## Final takeaway: experiments should answer decisions

An experiment is not a ritual that makes every change scientific. Its value comes from a clear hypothesis, stable measurement, a sensible comparison and an honest interpretation of uncertainty.

Start with one important decision. Identify the business metric, define what you will change, allow sufficient evidence to develop and write down the conclusion before making the result permanent.

If you're unsure which campaign change deserves testing, a [Google Ads audit](/google-ads-audit/) can help prioritize tracking, search intent and landing page problems before you commit more budget.

### Official documentation

1. [Google Ads: Set up a custom experiment](https://support.google.com/google-ads/answer/6261395?hl=en)
1. [Google Ads: About custom experiments](https://support.google.com/google-ads/answer/10683687?hl=en)
