CREATE TABLE images
(
    image_id   uuid PRIMARY KEY,
    mime_type  text,
    size_bytes bigint,
    created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs
(
    job_id            uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    status            text        NOT NULL,
    public_id         uuid,
    error_msg         text,

    original_image_id uuid REFERENCES images (image_id),
    submitted_at      timestamptz NOT NULL DEFAULT NOW(),

    final_image_id    uuid REFERENCES images (image_id),
    completed_at      timestamptz
);

CREATE TABLE intermediate_images
(
    job_id     uuid        NOT NULL REFERENCES jobs (job_id) ON DELETE CASCADE,
    phase      text        NOT NULL,
    image_id   uuid        NOT NULL REFERENCES images (image_id),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (job_id, phase)
);
