# Moj raspored — PWA

Samostalna web-app za pregled tjednog rasporeda nastave. Radi offline, instalira
se na početni zaslon mobitela kao prava aplikacija, a podaci se uvoze ručno kao
JSON izvezen iz e-Dnevnik dashboarda (gumb **⬇ Izvoz** na stranici Raspored).

Nema servera, nema baze — sve što učenik/roditelj uveze ostaje samo na
njihovom uređaju (localStorage).

## Struktura

```
index.html          → cijela aplikacija (HTML/CSS/JS u jednoj datoteci)
manifest.json        → PWA manifest (ime, ikone, boje)
sw.js                 → service worker (offline cache)
icons/                → ikone za početni zaslon i favicon
```

## Objava na GitHub Pages

1. Napravi novi repozitorij na GitHubu (npr. `raspored-app`).
2. Ubaci **sadržaj** ove mape (ne samu mapu, nego `index.html`, `manifest.json`,
   `sw.js` i `icons/`) u root repozitorija i pushaj na `main` granu.
3. Repo → **Settings → Pages** → pod "Build and deployment" odaberi
   **Deploy from a branch**, granu `main`, folder `/ (root)` → Save.
4. Nakon minutu-dvije app je dostupna na:
   `https://<tvoj-github-username>.github.io/<naziv-repozitorija>/`

Bitno: sve putanje u kodu (`icons/...`, `manifest.json`, `sw.js`) su relativne,
pa app radi ispravno i kad GitHub Pages servira s podputanje
(`.../raspored-app/`), ne treba ništa mijenjati.

## Testiranje prije objave

Lokalno se ne može samo dvoklikom otvoriti `index.html` i očekivati da service
worker radi (treba pravi http/https origin). Pokreni lokalni server, npr.:

```bash
npx serve .
# ili
python3 -m http.server 8080
```

pa otvori `http://localhost:8080`.

## Ažuriranje aplikacije kasnije

Service worker koristi cache pod imenom `raspored-shell-v1`. Ako kasnije
promijeniš `index.html`, `manifest.json` ili ikone, povećaj broj u
`CACHE_NAME` unutar `sw.js` (npr. `raspored-shell-v2`) — to tjera stare
instalirane appove da preuzmu novu verziju umjesto da ostanu na cache-iranoj.

## Napomena o ikonama

Ikone (`icons/*.png`) su generirane u stilu aplikacije (notesna stranica s
crvenom marginom i zelenom "uživo" točkicom). Slobodno ih zamijeni svojima —
samo zadrži iste nazive datoteka i dimenzije (192×192, 512×512) ili ažuriraj
`manifest.json` i `<link>` tagove u `index.html` u skladu s promjenama.
