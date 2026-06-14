# Victor Vandi Portfolio Website

GitHub Pages-ready static website.

## Upload instructions

1. Extract the zip file.
2. Open the extracted folder.
3. Upload the **contents** of the folder to GitHub, not the zip file itself.
4. Make sure `index.html` is at the root of the repository, beside `README.md` and `.nojekyll`.
5. In GitHub, go to **Settings → Pages**.
6. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
7. Save and wait for GitHub Pages to publish.

## Expected file structure

```text
index.html
README.md
.nojekyll
assets/
  css/
    style.css
  js/
    main.js
  images/
    victor-vandi-profile.jpg
```

## Notes

- Do not upload only `victorvandi_github_ready.zip` to the repository. GitHub Pages will not automatically unpack it.
- Replace the temporary internal contact buttons with your real Fiverr and Upwork profile links when ready.
- The site is fully static. It does not need Node.js, npm, React, or a build step.
