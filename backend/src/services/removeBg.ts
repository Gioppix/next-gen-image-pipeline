export async function removeBg(buffer: Buffer, mimeType = 'image/jpeg'): Promise<Buffer> {
    const form = new FormData();
    form.append('image_file', new Blob([new Uint8Array(buffer)], { type: mimeType }), 'image');
    form.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': process.env.REMOVE_BG_API_KEY!
        },
        body: form
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`remove.bg API error: ${response.status} ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
}
