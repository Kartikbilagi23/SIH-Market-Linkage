import prisma from "../lib/prisma";
import { uploadToIPFS } from "./ipfs.service";

export async function createCertificate(
    produceId: string,
    farmerId: string,
    file: Express.Multer.File,
    documentType: string
) {
    const produce = await prisma.produce.findUnique({
        where: {
            id: produceId,
        },
    });

    if (!produce) {
        throw new Error("Produce not found");
    }

    if (produce.farmerId !== farmerId) {
        throw new Error(
            "You are not authorized to upload a certificate for this produce"
        );
    }

    const ipfsResult = await uploadToIPFS(file);

    const cid = ipfsResult.data?.cid;

    if (!cid) {
        throw new Error(
            "IPFS upload succeeded but CID was not returned"
        );
    }

    const certificate =
        await prisma.certificate.create({
            data: {
                produceId,
                uploadedBy: farmerId,
                documentType: documentType as any,
                fileName: file.originalname,
                cid,
                ipfsUri: `ipfs://${cid}`,
            },
        });

    return certificate;
}