+++
title = "Using Github Pages to host a documentation site built with Hugo"
author = "Xavier Tilley"
tags = ["hugo", "github pages", "hosting", "web development"]
categories = ["docs"]
+++

## What is Hugo?

Hugo is an open-source static site generator written in Go. It's pretty stable 
and requires a lot less maintanence than all those JS based generators. You can 
find the Quick Start documentation [here](https://gohugo.io/getting-started/quick-start/)

## Build your Hugo site per the Hugo docs.

Hugo has several [themes](https://themes.gohugo.io/tags/docs/) availble for documenation sites.
Pick one and run with it.

Content in Hugo lives in the `/content` directory. HTML and Markdown are supported out of the box.
AsciiDoc, RST, and Pandoc can be supported if you install Asciidoctor, RST, or Pandoc. More information
can be found [here](https://gohugo.io/content-management/formats/)

Don't forget to configure your site in `config.toml` and build the static pages with `hugo -D`.

## Github Pages

If you want to use a custom domain for your site you will need to put your custom domain in `static/CNAME`.

Github Pages deployment is handled by a Github Action. Hugo [documents](https://gohugo.io/hosting-and-deployment/hosting-on-github/#build-hugo-with-github-action) this pretty well.
But the gist is that we want to run a job that sets up Hugo, builds and minifies the site, and then deploys it.