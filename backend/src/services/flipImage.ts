import sharp from 'sharp';

export async function flipImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).flop().toBuffer();
}
