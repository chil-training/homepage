# Hackathon challenges: Firestore entries

Each challenge is one document in the top-level `hackathonChallenges` collection, published at `https://chil-training.co.uk/challenges/<document ID>`. Use the **Challenges** tab of the admin panel rather than the Firebase console; the document ID becomes the public URL, so give it a clean slug such as `healthier-starts`.

Challenges with `published: true` appear on the homepage and on `/challenges`, ordered by `index`. Unpublished challenges are hidden everywhere and their page returns 404.

## Required security rule

The challenge pages are rendered on the server so that search engines and link previews see the content, which means **`hackathonChallenges` must be readable without signing in**. Until this rule is added, the collection returns `PERMISSION_DENIED`, the homepage challenge section is hidden, and every challenge page 404s.

Add a rule matching the pattern already used for `publicEvents`:

```
match /hackathonChallenges/{challengeId} {
  allow read: if true;
  allow write: if request.auth != null
               && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
}
```

Because the collection is world-readable, never put unpublished internal notes, attendee information, or private links in it. `published: false` hides a challenge from the site, but the document is still readable by anyone who queries the collection directly.

## Fields

| Field | Firestore type | Required | Value to enter |
| --- | --- | --- | --- |
| `title` | string | Yes | Challenge name, e.g. `Healthier starts` |
| `summary` | string | Yes | One or two sentences; shown on the challenge cards and used as the page description |
| `markdown_content` | string | Recommended | The full brief, in Markdown. Without it the page shows "A full brief for this challenge is coming soon." |
| `index` | number | Yes | Display order; also sets the "Challenge 01" numbering |
| `accent` | string | No | Card colour. One of `rose`, `violet`, `red`, `lime`, `sky`, `fuchsia`, `amber`, `teal`, `indigo`, `orange`, `slate`. Defaults to `slate` |
| `published` | boolean | Yes | `true` to show the challenge; `false` while drafting |
| `audience` | string | No | e.g. `Open to undergraduates and the public` |
| `updatedAt` | timestamp | Auto | Set by the admin panel; used as `<lastmod>` in the sitemap |

`accent` is a colour **name**, not a CSS class. The class strings it maps to live in `src/data/challengeAccents.js`; adding a new colour means adding it there too, because Tailwind only includes classes it can find written out in the source.

## Seeding the original ten challenges

The ten challenges that used to be hardcoded on the homepage are kept in `src/data/defaultChallenges.js`. On an empty collection the Challenges tab offers an **Add the ten default challenges** button, which writes any that are missing and leaves existing documents untouched. Each seeded challenge gets a placeholder brief to edit.
