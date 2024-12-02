# Recipe URL Update Scripts

This directory contains scripts for maintaining the recipe URL database used by the website.

## Scripts

### update_full_recipe_list.py

This script fetches all available recipe URLs from Gousto and saves them to a JSON file that powers the website's recipe search functionality.

#### What it does:
- Scrapes all recipe URLs from Gousto's website
- Converts the recipe data to a JSON format
- Saves the data to `public/data/recipe_urls.json`

#### Usage:
```bash
python update_full_recipe_list.py
```

The generated JSON file is used by the website to enable recipe searching and browsing.
