# Next Gen Image Processing Platform

_Bleeding edge tecknology_

## To Improve

- Pick back up jobs on restart
- Support multiple backends
-

## Developing

### Setup

- Start a Postgres image
- Start a s3-compatible service
    - Can use `./start-s3.sh` for that

### Running

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
# Run these commands once, then only to apply changes
npm run s3:bucket
npm run db:dev

cd backend
npm run dev
```
