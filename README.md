# Paws & Hearts — Pet Care & Adoption Platform

A polished, responsive EWP project built with HTML, CSS, and JavaScript.

## Run on Windows (no Docker, no build step)

**Option 1 — easiest**
1. Extract the ZIP file.
2. Open the `PAWS-AND-HEARTS` folder in VS Code.
3. Open `index.html` in a browser.

**Option 2 — recommended local server**
1. Open the project folder in VS Code.
2. Open Terminal → New Terminal.
3. Run `python -m http.server 5500`
4. Open `http://localhost:5500` in Chrome.

If Python is not installed, use VS Code's Live Server extension and choose **Open with Live Server**.

## Try the features
1. Open **Adopt a pet** and search/filter the catalogue.
2. Click a heart to save a pet.
3. Select **Meet [pet]**. Create an account if prompted.
4. Register, then sign in and submit an adoption request.
5. Select your account in the navigation to review saved pets and requests or edit your profile.
6. Use the Pet care cards and newsletter form.

## Demo data and privacy
Data is saved in your browser's localStorage, so it persists in that browser. It is not sent to a server. This is a front-end academic prototype, not production authentication.

## Project structure
- `index.html` — single-page website and semantic structure
- `styles.css` — responsive visual design and components
- `app.js` — pet data rendering, filters, demo accounts, favourites, adoption requests
- `data/pets.json` — sample catalogue dataset
- `docs/PROJECT_OVERVIEW.md` — overview, features, architecture, limitations
- `legacy/` — original EWP practice files retained for reference

## Troubleshooting
- If images or web fonts do not appear, check your internet connection; the core interactions still work.
- If browser security blocks local file storage, run the Python local server above.
- To reset demo data, open browser DevTools → Application → Local Storage → delete the `ph_` keys.
