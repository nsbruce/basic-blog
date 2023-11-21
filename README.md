# A bloggy blog

## Tasks

This repository is [xc](https://xcfile.dev) compliant. The following tasks are available:

## build
There is no build stage per-say but the [post manifest file](./posts/manifest.json) has to be updated. This should allow you to write "drafts". Anyway, to generate the manifest programmatically you can do something like:

```bash
docker run -v $PWD:/site node node /site/scripts/generate_post_manifest.js
```
