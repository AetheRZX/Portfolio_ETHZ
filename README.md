# Portfolio: how to use it

Plain HTML/CSS/JS with no build step. GitHub Pages hosts it as is.

```
index.html     home page (hero, project grid, other projects, about, contact)
project.html   one template that shows any project: project.html?p=nomadz
content.js     ALL THE TEXT and which picture goes where. This is the file you edit
site.js        builds the pages from content.js (no need to touch)
style.css      look and feel; light and dark colours are at the top
assets/        web-ready pictures and videos (compressed, ~24 MB total)
Pic/           your raw source material. It's in .gitignore, so it is NOT uploaded
```

Preview locally: run `python -m http.server 8000` in this folder, then open http://localhost:8000.

## Editing a project (content.js)

Each project is one `{ ... }` block. A page is a list of `sections`:

```js
{
  h: "Training a Policy",                  // heading
  text: "A PPO policy learns ...",         // paragraph (HTML like <b> works)
  media: ["smoke.mp4", "trained.mp4"],     // files in assets/<id>/, shown side by side
  caption: "Left: ... Right: ...",         // small grey line under the media
  narrow: true,                            // optional: show a single figure smaller
  code: { file: "algo.py", lang: "python", src: `...` },   // optional code snippet
}
```

- **Add media:** put the file in `assets/<id>/` and list its name in `media`. Any `.jpg/.png/.svg/.gif/.mp4` works.
- **Card picture on the home page:** `assets/<id>/cover.jpg` (or set `cover: "file.svg"` on the project).
- **Hide a project without deleting it:** add `hidden: true` (Drive-and-Fly is parked like this).
- **Other Projects:** short entries in `OTHER_PROJECTS`; `img: "file.png"` adds a thumbnail from `assets/other/`.
- `[TODO: ...]` shows yellow; search for `TODO` and replace them all before sharing.

Missing files show as grey boxes on your computer (localhost) and are hidden on the live site.

## Compressing new videos
Keep clips under ~5 MB: 720p, no audio, H.264.
`ffmpeg -i in.mov -vf scale=1280:-2 -an -c:v libx264 -crf 27 -movflags +faststart out.mp4`
(No ffmpeg? `pip install imageio-ffmpeg` gives you one.)

## GitHub Pages
1. Create a repo named `<your-username>.github.io`.
2. Upload this folder's contents except `Pic/`. With git, `.gitignore` already skips it: `git init`, `git add .`, `git commit -m "Portfolio"`, then push.
3. Go to Settings > Pages > Deploy from a branch > `main` / root. It's live at `https://<your-username>.github.io`.
4. Put your GitHub URL in `PROFILE.github` in content.js.
