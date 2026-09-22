# HDS Training Platform

A Next.js and React application for the HDS Training Platform. Page shells are rendered on the server for each request; Firebase Authentication and Firestore operations run in the browser after hydration.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm run start
```

The application uses filesystem routing:

- `/`; dashboard
- `/auth/login` and `/auth/register`; authentication
- `/theme/[themeId]` and `/guide/[guideId]`; protected learning content
- `/admin`; protected administration
