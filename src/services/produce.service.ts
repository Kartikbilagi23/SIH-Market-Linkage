import prisma from "../lib/prisma";

export async function createProduce(
    farmerId:string,
    data:{
        cropName:string;
        quantity:number;
        unit:"KG"|"QUINTAL"|"TON";
        quality?:string;
        harvestDate?:string
    }
) {
    return prisma.produce.create({
        data:{
            farmerId,
            cropName:data.cropName,
            quantity:data.quantity,
            unit:data.unit,
            quality:data.quality,
            harvestDate:data.harvestDate ? new Date(data.harvestDate):undefined
        }
    })
}

export async function getMyProduce(farmerId:string) {
    return prisma.produce.findMany({
        where:{
            farmerId
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}

export async function getProduceById(
    produceId:string,
    farmerId:string
) {
    return prisma.produce.findFirst({
        where:{
            id:produceId,
            farmerId
        }
    })
}

export async function updateProduce(
    produceId: string,
    farmerId: string,
    data: {
        cropName?: string;
        quantity?: number;
        unit?: "KG" | "QUINTAL" | "TON";
        quality?: string;
        harvestDate?: string;
    }
) {
    const existingProduce = await prisma.produce.findFirst({
        where: {
            id: produceId,
            farmerId,
        },
    });

    if (!existingProduce) {
        throw new Error("Produce not found");
    }

    return prisma.produce.update({
        where: {
            id: produceId,
        },
        data: {
            ...data,
            harvestDate: data.harvestDate
                ? new Date(data.harvestDate)
                : undefined,
        },
    });
}
export async function deleteProduce(
    produceId: string,
    farmerId: string
) {
    const existingProduce = await prisma.produce.findFirst({
        where: {
            id: produceId,
            farmerId,
        },
    });

    if (!existingProduce) {
        throw new Error("Produce not found");
    }

    return prisma.produce.delete({
        where: {
            id: produceId,
        },
    });
}
