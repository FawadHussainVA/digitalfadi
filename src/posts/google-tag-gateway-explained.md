---
title: "Google tag gateway: what it is and should you use it?"
description: "What Google tag gateway does, how it serves Google tags from your own domain, how to set it up with Cloudflare, and what it does not do."
topic: "Tracking"
date: 2026-11-01
order: 32
---

Google tag gateway serves your Google tags from your own website's domain instead of from Google's servers, and sends the measurement data back through your domain too. Because the requests look first-party, they are less likely to be lost to browser restrictions and blockers, so Google Ads and Google Analytics record more of the conversions that actually happen. It is worth using for most advertisers who run on a supported content delivery network such as Cloudflare, where it can be switched on in a few clicks. It does not replace consent, and it only applies to Google tags.

## Why measurement gets lost

A normal Google tag loads from Google's domain and sends data to Google's servers. Browsers increasingly restrict third-party scripts and cookies, and some extensions block known tracking domains. Each lost request can mean a conversion that happened but never reached Google Ads.

That matters more than it sounds. Smart Bidding, broad match and Performance Max all learn from your conversion data. When part of that data is missing, the account under-reports results and bidding learns from an incomplete picture. [Why are my Google Ads not converting?](/learn/why-are-my-google-ads-not-converting/) covers other ways tracking breaks.

## How Google tag gateway works

With the gateway switched on:

1. A path on your own domain, such as `/metrics`, is set aside for Google measurement
2. Your Google tag is delivered from that path, so it loads as part of your own website
3. Measurement requests are sent to the same path and forwarded to Google by your content delivery network
4. Cookies are set as first-party cookies on your domain

From the browser's point of view, everything happens on your website. Your existing tag code usually does not need to change.

## What it does not do

- **It does not bypass consent.** If a visitor rejects analytics or advertising cookies, consent mode should still be respected. A first-party route is a more reliable delivery method, not permission to track people who said no
- **It only covers Google tags.** Google Ads, Google Analytics and Google Tag Manager benefit. Other platforms' tags stay as they are
- **It is not full server-side tagging.** Server-side tagging lets you change or remove data before it reaches Google. The gateway mainly changes the route the data takes
- **It does not fix bad tracking.** If your conversion actions count the wrong things, the gateway delivers wrong data more reliably. Check what you count first

## How to set it up with Cloudflare

If your website already runs through Cloudflare, the setup is mostly automatic:

1. Open **Google Tag Manager**, the Google tag settings in **Google Ads**, or **Google Analytics**, and go to **Admin, then Google tag gateway**
2. Let it scan your site and choose **Cloudflare**
3. Confirm a measurement path that is not used by anything else on your site, such as `/metrics`
4. Sign in to Cloudflare, choose your domain and select **Complete setup**

You can also start from the Cloudflare dashboard, where Google tag gateway has its own settings page. Other content delivery networks and load balancers are supported through a manual setup, which needs someone comfortable with your server configuration.

### Check that it works

- In your browser's developer tools, open the **Network** tab, reload the page and look for requests to your chosen path, such as `/metrics`, on your own domain
- In the Google tag gateway settings, your domain should show as active
- Compare conversions in Google Ads with your own records over the following weeks. You are looking for Google Ads to record closer to the true number

### If you use a consent banner

Test the whole consent flow after setup: reject cookies and confirm nothing is stored, then accept and confirm measurement starts. Some sites with custom consent setups use the manual setup route for more control.

## Who should use it

**Worth doing now:**

- Advertisers on Cloudflare or another supported content delivery network, because setup takes minutes
- Accounts using Smart Bidding, broad match or Performance Max, where more complete conversion data improves bidding
- Online shops, where lost purchase data directly understates return on ad spend

**Less urgent:**

- Accounts whose conversion tracking is already broken. Fix what you count first
- Sites that already run full server-side tagging, which can serve Google tags first-party itself

## Where it fits with other tracking improvements

Google tag gateway works alongside other ways to improve measurement, not instead of them:

- **Enhanced conversions** match conversions using hashed customer details. See [enhanced conversions for leads](/learn/google-ads-enhanced-conversions-for-leads-guide/)
- **Offline conversion imports** bring in sales that close by phone or in person
- **Consent mode** keeps measurement compliant with your visitors' choices

Together they give bidding the most complete and accurate data you can legitimately collect.

## Frequently asked questions

### Is Google tag gateway free?

Google does not charge for it. Whether your content delivery network charges depends on your plan with that provider.

### Do I need to change my website code?

Usually not. With the Cloudflare setup, your existing Google tag keeps working and is served first-party automatically. Manual setups may need changes to your server configuration.

### Does Google tag gateway get around ad blockers and cookie rules?

It makes measurement more reliable by using your own domain, but it does not override consent. Visitors who reject cookies should still be respected through consent mode, and you remain responsible for complying with privacy law.

### Does it work for Meta, LinkedIn or other platforms?

No. It only applies to Google tags, such as Google Ads, Google Analytics and Google Tag Manager.

### Will it increase my conversions?

It does not create new sales. It helps Google Ads record more of the conversions that already happen, which gives Smart Bidding better data to work with.

If you are not sure whether your conversion tracking is counting the right things, a [free Google Ads audit](/#contact) lists the tracking issues in your account, and the [$100 account analysis](/google-ads-audit/) adds the solution for each one.
