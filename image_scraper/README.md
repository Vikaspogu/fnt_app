# Image scraping service

## Build in openshift

```bash
oc new-app --strategy=docker https://github.com/Vikaspogu/fnt_app  --context-dir='image_scraper' --name=image-scraper
```