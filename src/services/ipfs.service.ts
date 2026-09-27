
export async function uploadToIPFS(
    file: Express.Multer.File
) {
    const pinataJwt = process.env.PINATA_JWT;

    if (!pinataJwt) {
        throw new Error("PINATA_JWT is not configured");
    }

    const formData = new FormData();

    const blob = new Blob([
        new Uint8Array(file.buffer)
    ], {
        type: file.mimetype,
    });

    formData.append(
        "file",
        blob,
        file.originalname
    );

    const response = await fetch(
        "https://uploads.pinata.cloud/v3/files",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${pinataJwt}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error("IPFS upload failed:", errorText);

        throw new Error(
            "Failed to upload file to IPFS"
        );
    }

    const result = await response.json();

    return result;
}
