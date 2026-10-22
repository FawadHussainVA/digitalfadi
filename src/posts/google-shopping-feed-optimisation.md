---
title: "Google Shopping feed optimisation: a practical checklist"
description: "Your product feed decides which searches your Shopping ads can appear for. Fix disapprovals, identifiers, titles, images and labels, in that order."
topic: "Shopping"
date: 2026-10-22
order: 19
---

Google Shopping feed optimisation means improving the product data you send to Google Merchant Center so your products appear for more of the right searches and win more clicks. Shopping ads have no keywords: Google reads your feed to decide which searches each product matches. Work in this order: fix disapproved products first, then product identifiers, titles, images, categories and custom labels, then descriptions and the remaining attributes.

A better feed often does more for a Shopping account than any change to bids, because bids only decide how much you pay for searches the feed already qualifies you for.

## Why the feed matters more than the campaign

With Search ads you choose keywords. With Shopping and Performance Max product ads, the feed does that job. Google compares each search with your titles, descriptions, categories, brands and identifiers, then decides whether a product is relevant.

A product with a vague title and a missing brand might be eligible for a few searches. The same product with a precise title, the right category and a valid GTIN can match far more, and look more trustworthy when it does.

## Step 1: fix disapproved and limited products

A disapproved product cannot show at all, so this comes before everything else. In Merchant Center, open the product diagnostics and work through the issues affecting the most products first.

The common causes:

- **Price or availability does not match the website.** The feed says in stock at one price; the page says something else
- **Missing required attributes,** such as image, price, availability or brand
- **Images that break the rules,** with promotional text, watermarks or borders over the main image
- **Landing pages that do not work,** or redirect to a different product
- **Policy issues** for restricted product types

Price and availability mismatches are the most frequent. Keeping the feed in sync with the site, through regular feed updates and structured data on product pages, prevents most of them. Merchant Center can also update price and availability automatically from your pages when it detects a mismatch.

## Step 2: product identifiers

Identifiers tell Google exactly which product you sell, so it can match you to searches for that product and compare you with other sellers.

- **GTIN** (the barcode number, such as an EAN or UPC) for any product the manufacturer has assigned one. If a product has a GTIN, supply it
- **Brand** for every product
- **MPN** (manufacturer part number) where there is no GTIN
- **identifier_exists set to no** only for products that genuinely have no GTIN or MPN, such as handmade or custom items

Missing or wrong identifiers are one of the most common reasons good products get little visibility.

## Step 3: titles

The title is the single strongest signal in the feed. Put the words people actually search near the front, include the attributes they search by (brand, product type, size, colour, material, model), and avoid promotional text.

Titles deserve their own guide, with structures for each product category: [how to write product titles for Google Shopping](/learn/how-to-write-product-titles-for-google-shopping/).

## Step 4: images

The image is what people see first in a Shopping ad, and often what decides the click.

- Use a clear, high-resolution main image of the product itself
- Use a plain or neutral background for the main image, without text, logos or promotional overlays
- Show the exact variant listed: the red version for the red product
- Add extra images with the additional image link attribute: different angles, the product in use, detail shots

## Step 5: categories and product types

Two attributes describe what a product is:

- **google_product_category** places the product in Google's own taxonomy. Google assigns one automatically, but setting the most specific accurate category yourself removes the guesswork
- **product_type** is your own category structure, such as Women > Shoes > Running shoes. Google uses it for context, and it is also how you can split campaigns and reports by category

## Step 6: custom labels for bidding by what matters

Custom labels (custom_label_0 to custom_label_4) let you tag products with anything Google does not know, so you can group them in campaigns and bid differently. Useful labels:

- **Margin band:** high, medium, low margin. Products with a 60% margin can afford a very different return on ad spend from products with 15%. The [break-even ROAS calculator](/tools/break-even-roas-calculator/) works out the threshold for each band
- **Best sellers** versus the rest
- **Price band,** since cheap and expensive items rarely deserve the same bid
- **Seasonal** products, so they can be pushed or paused as a group
- **Clearance** stock

Margin labels matter most. Without them, every product competes for the same budget at the same target, and low-margin products can quietly lose money while the account average looks fine. [Why your Shopping campaign is losing money](/learn/why-your-shopping-campaign-is-losing-money/) covers this in detail.

## Step 7: descriptions and product highlights

Descriptions support the title rather than repeat it. Describe what the product is, what it is made of, what it fits or works with, and who it is for, using the words customers use. Keep it factual and free of promotional claims, links and capital-letter shouting.

Product highlights let you add short, scannable bullet points, such as key features, which can appear in free listings and some ad formats.

## Step 8: the attributes that complete the picture

- **Variants:** use item_group_id to link sizes and colours of the same product, with the colour, size and other variant attributes filled in. Apparel usually needs gender, age group, colour and size
- **Sale price:** use the sale price attribute, with dates, rather than changing the main price, so the discount can display correctly
- **Shipping and returns:** set accurate delivery costs and times and a return policy in Merchant Center. Shoppers compare these, and wrong shipping costs cause disapprovals
- **Condition:** say if items are used or refurbished

## Change the feed without touching the website

You do not need a developer for most of this. Merchant Center supports supplemental feeds, which add or overwrite attributes such as custom labels or improved titles, and feed rules, which transform data automatically, for example adding the brand to the start of every title. Both leave your store's product data unchanged.

## Keep checking

A feed is never finished. Prices change, stock runs out, new products arrive with thin data, and new disapprovals appear. Check Merchant Center diagnostics weekly, and review which products receive impressions but few clicks: that combination usually points to a title, image or price problem rather than a bid problem.

If your Shopping or Performance Max results have stalled and you are not sure whether the feed, the bids or the tracking is the cause, a [Google Ads audit](/google-ads-audit/) checks all three. The [e-commerce service page](/google-ads-for-ecommerce/) explains how we manage feeds alongside Shopping and Performance Max campaigns.
