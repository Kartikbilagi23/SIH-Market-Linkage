-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('QUALITY', 'ORGANIC', 'FARMER_CERTIFICATE', 'LAB_REPORT', 'OTHER');

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "documentType" "CertificateType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "ipfsUri" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produceId" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Certificate_produceId_idx" ON "Certificate"("produceId");

-- CreateIndex
CREATE INDEX "Certificate_cid_idx" ON "Certificate"("cid");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
