+++
title = "Adventures with the Alma API"
description = "How Alma drove me to asynchronicity"
date = "2025-08-07"
author = "Xavier Tilley"
tags = ["django", "django-channels", "alma", "api", "async", "htmx", "websockets", "ux"]
categories = ["library tech", "user experience", "portfolio"]
draft = true
+++

Lockwood Library at the University at Buffalo has a renovation coming up soon. We also have
too many books and not enough places to stuff them while the renovation is happening. Therefore,
we have a huge weeding project going on. If the idea of weeding is unfamiliar to you, [99% Invisible](https://99percentinvisible.org/episode/weeding-is-fundamental/)
recently had a great episode about it. Even if you are familiar with weeding, it's a great listen or read.

Anyways, so we have this big weeding project to do. There's an existing python based application that queries our
library management system, Alma, to figure out if the book you just scanned should be weeded.