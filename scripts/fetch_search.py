"""Explore Commons: python3 fetch_search.py 'query' [ns] — or 'Category:...' to list files."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import commons
q = sys.argv[1]
if q.startswith("Category:"):
    titles = commons.category_members(q)[:200]
else:
    titles = commons.search(q, limit=int(sys.argv[2]) if len(sys.argv) > 2 else 40)
info = commons.imageinfo(titles)
for t in titles:
    i = info.get(t)
    if not i: continue
    m = i["meta"]
    print(f'{i["width"]}x{i["height"]} | {commons.strip_html(m.get("LicenseShortName",""))} | {t}')
