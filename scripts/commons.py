"""Small Wikimedia Commons API helper (stdlib only)."""
import json, time, urllib.parse, urllib.request, re, html

API = "https://commons.wikimedia.org/w/api.php"
UA = "TrajansColumnSchoolProject/0.1 (raula517@gmail.com)"

def api(**params):
    params.setdefault("format", "json")
    params.setdefault("formatversion", "2")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:
            time.sleep(2 + attempt * 3)
            last = e
    raise last

def category_members(cat, cmtype="file", limit=500):
    out, cont = [], {}
    while True:
        d = api(action="query", list="categorymembers", cmtitle=cat, cmtype=cmtype,
                cmlimit=limit, **cont)
        out += [m["title"] for m in d["query"]["categorymembers"]]
        if "continue" in d:
            cont = {"cmcontinue": d["continue"]["cmcontinue"]}
        else:
            return out

def strip_html(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    return html.unescape(s).strip()

def imageinfo(titles, width=None):
    """Return dict title -> info (url, thumburl, size, extmetadata flattened)."""
    res = {}
    for i in range(0, len(titles), 40):
        chunk = titles[i:i+40]
        p = dict(action="query", titles="|".join(chunk), prop="imageinfo",
                 iiprop="url|extmetadata|size|mime")
        if width:
            p["iiurlwidth"] = width
        d = api(**p)
        for pg in d["query"]["pages"]:
            if "imageinfo" not in pg:
                continue
            ii = pg["imageinfo"][0]
            em = {k: v.get("value") for k, v in ii.get("extmetadata", {}).items()}
            res[pg["title"]] = dict(
                title=pg["title"], url=ii["url"], thumburl=ii.get("thumburl"),
                thumbwidth=ii.get("thumbwidth"), thumbheight=ii.get("thumbheight"),
                width=ii["width"], height=ii["height"], mime=ii.get("mime"),
                descurl=ii.get("descriptionurl"), meta=em)
        time.sleep(0.5)
    return res

def credit(info):
    m = info["meta"]
    return dict(
        title=info["title"].replace("File:", ""),
        author=strip_html(m.get("Artist", "")),
        license=strip_html(m.get("LicenseShortName", "")),
        licenseUrl=strip_html(m.get("LicenseUrl", "")) or "",
        sourceUrl=info["descurl"],
    )

def license_ok(info):
    m = info["meta"]
    lic = (strip_html(m.get("LicenseShortName", "")) + " " + strip_html(m.get("License", ""))).lower()
    if "nc" in re.split(r"[^a-z]+", lic) or "nd" in re.split(r"[^a-z]+", lic):
        return False
    return any(k in lic for k in ("public domain", "pd", "cc0", "cc-by", "cc by", "cc-by-sa"))

def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
                f.write(r.read())
            time.sleep(0.7)
            return path
        except Exception as e:
            last = e
            time.sleep(3 + attempt * 5)
    raise last

def search(q, ns=6, limit=50):
    d = api(action="query", list="search", srsearch=q, srnamespace=ns, srlimit=limit)
    return [s["title"] for s in d["query"]["search"]]

def wikitext(titles):
    out = {}
    for i in range(0, len(titles), 50):
        d = api(action="query", prop="revisions", rvprop="content", rvslots="main",
                titles="|".join(titles[i:i+50]))
        for pg in d["query"]["pages"]:
            if "revisions" in pg:
                out[pg["title"]] = pg["revisions"][0]["slots"]["main"]["content"]
        time.sleep(0.5)
    return out
