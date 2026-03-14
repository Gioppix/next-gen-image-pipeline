# Next Gen Image Processing Platform

_Bleeding edge tecknology_

## To Improve

- Add auth & usage/limiting (duh)
- Jobs processing
    - Use a queue to better handle retires and restarts/crashes
- Remove CPU-heavy image processing from main thread (`flip`)
- Stream images to lower memory footprint
- Avoid handling images from main backend
    - Access from presigned URLs or a CDN
    - Upload with presigned URLs
- WebSocket instead of polling for frontend updates

## Developing

### Setup

1. Start a Postgres instance
2. Start an S3-compatible service (MinIO via Docker):
    ```bash
    ./start-s3.sh
    ```
3. Copy the example env files and fill in your values:

    ```bash
    cp backend/.env.pub backend/.env
    cp frontend/.env.pub frontend/.env
    ```

    - `REMOVE_BG_API_KEY` — get a free API key at [remove.bg](https://www.remove.bg/api)
    - S3 credentials default to the values used by `start-s3.sh`

4. Initialize the database and S3 bucket (run once, or after schema changes):
    ```bash
    cd backend
    npm run db:dev
    npm run s3:bucket
    ```

### Running

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```
