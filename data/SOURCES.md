# Map data: sources, licences, approximations

## Attribution to display on the site

> Basemap and rivers: Made with Natural Earth (public domain), via the world-atlas package.
> Tiber and Tiber Island in the Rome inset: © OpenStreetMap contributors (ODbL).
> Roman frontiers, provinces and the Servian Wall: approximate, drawn for this site.

## External sources used

| File | Source | Licence |
|---|---|---|
| `land.json` | Natural Earth 1:50m land, from `https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json` (TopoJSON). Decoded to GeoJSON, clipped to lon −15…60 / lat 15…60, simplified with a 0.01° tolerance, coordinates rounded to 3 decimals | Natural Earth: public domain (attribution appreciated). world-atlas package: ISC |
| `rivers.json` | Natural Earth 1:10m rivers and lake centerlines, `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson` (Danube, Rhine, Nile, Euphrates, Tigris, Shatt al-Arab), clipped and simplified (0.01°). The 1:50m file has no upper Euphrates, so 1:10m was used | Public domain |
| `empire*.json` | Frontier lines are hand-drawn. River frontiers (Rhine, Danube, Euphrates) and the Tigris edge follow the Natural Earth 1:10m rivers above, and polygons were clipped to the Natural Earth land in `empire.json` | Public domain inputs. The drawing is our own |
| `rome.json` → `tiber`, `tiberIsland` | OpenStreetMap via the Overpass API: ways `366694000` and `547426106` (waterway=river, name=Tevere) and way `126146475` (Isola Tiberina) | ODbL 1.0: "© OpenStreetMap contributors" |

The coordinates in `projects.json`, `rome.json` and `campaigns.json` were checked against the coordinates on the English Wikipedia articles, using the MediaWiki API (`prop=coordinates`). They are facts, not copied text. All the summaries and notes are original writing.

**Looked at but not used:** aourednik/historical-basemaps (`world_100.geojson` and `world_200.geojson`, GPL-3.0). Its AD 100 Roman polygon has errors for 98. It includes Osrhoene/Edessa, Nisibis and Dura, which were all outside the empire in 98. It also leaves out Trapezus, Mainz, Tomis and Cornwall, which were inside. It was used only as a sanity check. AWMC and Pleiades have no ready-made polygon set for the empire in AD 98 or AD 117.

## Winding order (d3-geo)

All polygons in `land.json`, `empire.json` and `empire-unclipped.json`, and the Tiber Island in `rome.json`, use the d3-geo convention. **Exterior rings run clockwise** on a north-up lon/lat plot, and holes run anticlockwise. This is the opposite of the GeoJSON RFC 7946 right-hand rule. All polygons were checked with `d3.geoArea`, and none comes out larger than a hemisphere. If you run these files through a tool that "fixes" RFC winding (for example `@turf/rewind` or `mapshaper -o geojson-type`), d3 will draw each shape as "the whole world minus the shape".

The big land polygon has straight edges along the clip box. They were split into segments of 1° or less, so d3's great-circle edges do not bulge.

## What is approximate

Everything in `empire.json` and `empire-unclipped.json` is approximate (`approximate: true` on every feature):

- **empire-98**: a hand-drawn frontier.
  - Atlantic → Mauretania Tingitana (south to Sala/Volubilis) → the Tell of Mauretania Caesariensis and Numidia, north of the Aurès → the Tripolitanian and Cyrenaican coast strips → Egypt, including the western oases, south to Hiera Sykaminos.
  - Down the middle of the Red Sea and the Gulf of Suez, then the Egypt–Nabataea line (Suez to Rhinocorura).
  - Southern Judaea and the Dead Sea → east of the Decapolis, north of Bostra → the Syrian desert east of Palmyra → the Euphrates from Sura up to Erzincan → Satala → the Black Sea coast near Apsarus.
  - The Danube from the delta to Eining → the Raetian (Alb) limes and the Upper German limes (Neckar–Odenwald–Main–Wetterau–Taunus) → the Rhine → the Oude Rijn to Katwijk.
  - Britain to about the Forth–Clyde lowlands. Southern Scotland was still held in 98.
  - The polygon takes in the whole Mediterranean and the southern Black Sea. The unclipped version includes that sea area. The clipped version is cut to land.
- **dacia**: the Banat, Oltenia (west of the Olt) and Transylvania inside the Carpathian arc. It does not include Wallachia or southern Moldavia, which were briefly attached to Moesia Inferior and given up by Hadrian.
- **arabia**: Sinai, the Negev, Transjordan from the Hauran/Bostra southwards, and the Hejaz to just south of Hegra. The eastern desert edge is notional.
- **armenia**: the Armenian highlands between the upper Euphrates and the Kura/Araxes, including Lake Van.
- **mesopotamia**: between the Euphrates and the Tigris, from the Taurus foothills (Edessa, Nisibis) to the Gulf. It also includes a strip on the right bank around Dura-Europos and the east bank of the lower Tigris (Mesene/Characene, near Charax), where Trajan's hold was nominal.
- **assyria**: drawn east of the Tigris, from Corduene to Ctesiphon (Adiabene). Its location is disputed: some scholars put it in Babylonia. Ctesiphon falls on the Tigris boundary between Assyria and Mesopotamia.
- **southern-scotland**: the part of empire-98 north of the Tyne–Solway line, abandoned c. 105. It is a subset of empire-98.
- **empire-117**: a convenience feature, made as empire-98 + acquisitions − southern Scotland.
- Acquisitions were drawn overlapping empire-98 and then cut by it. Neighbours therefore share edges exactly, without overlaps. The only gaps are hairline slivers under 0.001°² where three borders meet near the Euphrates.

Other approximations:

- `rome.json` `servianWall`: hand-drawn through the known gate sites. It is good to roughly ±50 m.
- `rome.json`: the Temple of the Deified Trajan and the Naumachia of Trajan have uncertain sites (`approximate: true`).
- `campaigns.json`: Tapae and Elegeia are approximate locations.
- `projects.json`: the Via Traiana pin (at Canusium) and the Via Nova Traiana pin (at Petra) stand for whole roads (`representativePin: true`). The Aqua Traiana pin marks its end on the Janiculum.
