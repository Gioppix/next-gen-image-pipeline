import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { pool } from '../db.js';
import { ImageSchema, type Image } from './types.js';

const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? 'us-east-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!
    },
    forcePathStyle: true
});

const BUCKET = process.env.S3_BUCKET ?? 'images';

interface ImageMeta {
    mime_type: string;
}

export async function createImage(buffer: Buffer, meta: ImageMeta): Promise<Image> {
    const image_id = randomUUID();

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: image_id,
            Body: buffer,
            ContentType: meta.mime_type,
            ContentLength: buffer.length
        })
    );

    const result = await pool.query(
        `INSERT INTO images (image_id, mime_type, size_bytes) VALUES ($1, $2, $3) RETURNING *`,
        [image_id, meta.mime_type, buffer.length]
    );

    return ImageSchema.parse(result.rows[0]);
}

export async function readImage(image_id: string): Promise<{ buffer: Buffer; image: Image }> {
    const dbResult = await pool.query(`SELECT * FROM images WHERE image_id = $1`, [image_id]);
    if (dbResult.rows.length === 0) throw new Error(`Image not found: ${image_id}`);
    const image = ImageSchema.parse(dbResult.rows[0]);

    const s3Result = await s3.send(
        new GetObjectCommand({
            Bucket: BUCKET,
            Key: image_id
        })
    );

    const chunks: Uint8Array[] = [];
    for await (const chunk of s3Result.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return { buffer, image };
}

export async function deleteImage(image_id: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: image_id }));
    await pool.query(`DELETE FROM images WHERE image_id = $1`, [image_id]);
}
