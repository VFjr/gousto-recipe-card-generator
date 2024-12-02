# get all recipe urls from gousto
# save to json file

import json
import os
import asyncio
import gousto_scraper

FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'recipe_urls.json')

async def main():
    recipe_links = await gousto_scraper.get_all_recipes(max_concurrent_requests=20)
    recipe_dicts = [recipe.to_dict() for recipe in recipe_links]

    with open(FILE_PATH, 'w') as f:
        json.dump(recipe_dicts, f)
    print(f'Successfully saved {len(recipe_dicts)} recipes to {FILE_PATH}')

if __name__ == '__main__':
    asyncio.run(main())
