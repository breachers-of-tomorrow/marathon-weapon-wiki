-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "baseWeaponId" TEXT,
ADD COLUMN     "isUnique" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_baseWeaponId_fkey" FOREIGN KEY ("baseWeaponId") REFERENCES "Weapon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
