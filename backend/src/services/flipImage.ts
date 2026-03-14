import sharp from 'sharp';

// TODO: offload this from the main thread to avoid even loop lag
export async function flipImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).flop().toBuffer();
}
