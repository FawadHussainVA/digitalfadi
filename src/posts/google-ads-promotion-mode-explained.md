---
title: "Google Ads Promotion mode: how to use it for a short sale"
description: "How Google Ads Promotion mode lowers your Target ROAS and adds budget for a 3 to 14 day sale, which campaigns qualify, and the rules that catch people out."
topic: "Strategy"
date: 2026-11-05
order: 35
---

**Promotion mode is a Google Ads setting that temporarily lowers a campaign's Target ROAS and, if you choose, adds extra daily budget for a sale lasting 3 to 14 days, then puts both back automatically when the sale ends.** It works only on standard Search and Performance Max campaigns that use campaign-level Target ROAS bidding, and it is still in open beta. Use it when you are deliberately willing to accept a lower return for a few days in exchange for more sales, and set the tolerance so the lowered target never falls below the return you need to break even.

## Why this is in the news

Promotion mode first appeared as a beta in mid 2026. This week Google published a full [help page for Promotion mode](https://support.google.com/google-ads/answer/18111661?hl=en), and [Search Engine Roundtable reported](https://www.seroundtable.com/google-ads-promotion-mode-help-document-42446.html) on it. For the first time the rules are written down in one place: which campaigns qualify, what you can and cannot change while a promotion runs, and how it interacts with other bidding settings. With Black Friday and the year-end sales close, that page is now the one to check your campaigns against.

## What Promotion mode actually does

It changes two settings for a fixed window, then restores them.

- **Target ROAS tolerance.** You choose a percentage between 5% and 90%. During the promotion the campaign's Target ROAS is lowered by that amount, so bidding will accept a lower return to win more auctions
- **Extra daily budget (optional).** You add an amount on top of the normal average daily budget for the promotion dates

When the end date passes, the original target and budget come back on their own. Nobody has to remember to undo anything the morning after the sale, which is where manual changes usually go wrong.

Google also says every campaign in an active promotion uses Smart Bidding Exploration, its feature for bidding on search queries the campaign has not converted on before, even if you have that setting switched off.

## Google's own example

The help page uses a five-day holiday clearance sale. The campaign normally runs at a 500% Target ROAS with a $100 average daily budget. The advertiser sets Promotion mode for those five days with a 20% tolerance and $50 of extra daily budget.

During the sale the effective target becomes 400% and the daily budget becomes $150. On day six the campaign returns to 500% and $100 without any manual edit.

The sum is simple: **lowered target = normal target × (1 minus the tolerance).** A 500% target with 20% tolerance is 500 × 0.8, which is 400%.

## Which campaigns can use it

According to Google's help page, a campaign must meet all of these:

1. **Standard Search or Performance Max.** Shopping campaigns are not listed
2. **Target ROAS bidding.** Maximise conversions, Target CPA, Maximise clicks and manual bidding are not eligible
3. **A campaign-level bid strategy.** Portfolio bid strategies are not supported
4. **Its own budget.** Shared budgets are not supported

Campaign total budgets work with the tolerance, but the extra daily budget option does not. With a total budget, Google says to raise the total yourself in the campaign settings.

For Performance Max, Google says the exploration part of the feature covers Search inventory only to begin with, with retail coverage due in November 2026. A Performance Max campaign that spends mostly outside Search will feel less of that effect.

If your best campaigns sit in a portfolio strategy, moving them out just before a sale is a change in its own right. Do it early or not at all. [Which Google Ads bid strategy should you use?](/learn/which-google-ads-bid-strategy-should-you-use/) explains the trade-offs between strategies.

## How to set it up

1. Open **Campaigns** and go into the settings of an eligible campaign
2. In the budget and bidding section, open the **Promotion mode** panel
3. Tick **Ramp up spend quicker on promotion dates**
4. Choose a start date and an end date between 3 and 14 days apart
5. Enter the Target ROAS tolerance, between 5% and 90%
6. Add an extra daily budget if you want one, then save

While a promotion runs, the panel shows it as on with its dates, and the budget column notes that Promotion mode is active.

Google recommends building a **new** campaign at least 48 hours before the promotion so ads are approved, and running an **existing** campaign for at least one full conversion cycle on a daily budget before applying Promotion mode.

## The rules that catch people out

**The normal target and budget are locked.** While a promotion is live you cannot change the baseline Target ROAS or baseline daily budget. Every change during the sale has to go through the Promotion mode panel.

**The start date cannot move once it begins.** You can bring the end date forward, or switch Promotion mode off to end it early, and the campaign returns to its original settings.

**The tolerances add up.** If Smart Bidding Exploration is already on with its own tolerance, Google adds the two together. Its example is 20% plus 20%, which is 40% in total. On a 500% target that works out at 300%, a much bigger drop than either setting suggests on its own.

**Daily spend limits still apply.** Google can still spend up to twice the daily budget on a single day, and the extra budget raises the figure that limit is based on. Google also warns that if the campaign becomes limited by budget, exploration may stop working.

**Remove CPC bid limits.** Google advises against caps on cost per click in the bid strategy, because they stop the system bidding on new traffic.

**Expect a settling period afterwards.** If the changes were large, Google asks you to allow one to two conversion cycles for bidding to settle before you judge the post-sale numbers.

## Promotion mode, seasonality adjustments and Exploration

These three get confused, and they do different jobs.

- **Seasonality adjustments** tell Smart Bidding to expect a short spike in conversion rate. The target stays the same. Use them when you expect more people to buy but do not want to accept a lower return
- **Promotion mode** lowers the target on purpose for a fixed window. You are choosing to trade some efficiency for volume
- **Smart Bidding Exploration** is a standing setting meant to stay on indefinitely, not a sale tool

The [Black Friday checklist](/learn/google-ads-black-friday-checklist/) covers how to use seasonality adjustments correctly, including the rules on how long they can run.

## Should you use it?

Promotion mode suits an advertiser who has a genuine sale, a campaign that already meets the eligibility rules, and reliable conversion values. If your conversion tracking counts the wrong things, lowering the target simply buys more of the wrong thing faster. [Why are my Google Ads not converting?](/learn/why-are-my-google-ads-not-converting/) covers the tracking checks to do first.

The most important decision is the tolerance. Before you pick a number:

1. **Work out your break-even ROAS for the sale.** A discount cuts your margin, so the return you need during a sale is higher than usual, not lower. The [break-even ROAS calculator](/tools/break-even-roas-calculator/) does this from your margin
2. **Make sure the lowered target stays above it.** Say your normal target is 500% and your break-even during the sale is 300%. Any tolerance above 40% asks Google to bid at a loss, and that 40% includes any Exploration tolerance already switched on
3. **Size the extra budget from past sales.** Google points to the missed opportunity report from previous promotions for this. The [budget calculator](/tools/budget-calculator/) helps you check what you can afford
4. **Agree the floor with whoever owns the numbers** before the sale, not during it, because the baseline is locked once it starts

If you sell services rather than products, or your campaigns use Target CPA, Promotion mode does not apply to you yet. A seasonality adjustment or a planned budget change is the alternative.

## Frequently asked questions

### What is Promotion mode in Google Ads?

Promotion mode is an open-beta setting that lowers a campaign's Target ROAS by 5% to 90% and can add extra daily budget for a scheduled promotion of 3 to 14 days. When the promotion ends, the original target and budget return automatically.

### Which campaigns can use Promotion mode?

Standard Search and Performance Max campaigns that use campaign-level Target ROAS bidding and their own budget. Portfolio bid strategies, shared budgets and other bid strategies are not supported, according to Google's help page.

### How is Promotion mode different from a seasonality adjustment?

A seasonality adjustment tells bidding to expect a higher conversion rate but keeps your target the same. Promotion mode lowers the target itself, so you are deliberately accepting a lower return for more volume during the sale.

### Can I change my Target ROAS while Promotion mode is on?

Not the normal one. While a promotion is live, the baseline Target ROAS and daily budget are locked, and any change has to be made to the tolerance or extra budget inside the Promotion mode settings.

### Can I end a promotion early?

Yes. You can bring the end date forward, within the 3 to 14 day range, or switch Promotion mode off. The campaign then returns to its original target and budget. The start date cannot be changed once the promotion has begun.

If you are planning a sale and want to know whether your campaigns, tracking and targets are ready for it, the [free Google Ads audit](/#contact) lists the issues in your account, and the [$100 account analysis](/google-ads-audit/) adds the solution for each one.
