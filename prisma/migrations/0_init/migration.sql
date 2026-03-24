-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ModType" AS ENUM ('BARREL', 'GRIP', 'MAGAZINE', 'OPTIC', 'SHIELD', 'GENERATOR', 'CHIP');

-- CreateEnum
CREATE TYPE "ModRarity" AS ENUM ('PRESTIGE', 'SUPERIOR', 'DELUXE', 'ENHANCED', 'STANDARD');

-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('ASSAULT_RIFLE', 'SMG', 'LMG', 'PISTOL', 'SNIPER_RIFLE', 'SHOTGUN', 'PRECISION_RIFLE', 'RAILGUN');

-- CreateEnum
CREATE TYPE "WeaponSlot" AS ENUM ('PRIMARY', 'SECONDARY', 'HEAVY');

-- CreateEnum
CREATE TYPE "AmmoType" AS ENUM ('LIGHT_ROUNDS', 'HEAVY_ROUNDS', 'VOLT_BATTERY', 'MIPS_ROUNDS', 'VOLT_CELL');

-- CreateEnum
CREATE TYPE "BuildType" AS ENUM ('PVP', 'PVE', 'PVEVP');

-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "WeaponType" NOT NULL,
    "slot" "WeaponSlot" NOT NULL,
    "ammoType" "AmmoType" NOT NULL,
    "rarity" TEXT,
    "price" INTEGER,
    "description" TEXT,
    "imageUrl" TEXT,
    "firepower" DOUBLE PRECISION,
    "damage" DOUBLE PRECISION,
    "precisionMultiplier" DOUBLE PRECISION,
    "rateOfFire" DOUBLE PRECISION,
    "range" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "hipfireSpread" DOUBLE PRECISION,
    "adsSpread" DOUBLE PRECISION,
    "crouchSpreadBonus" DOUBLE PRECISION,
    "movingInaccuracy" DOUBLE PRECISION,
    "handling" DOUBLE PRECISION,
    "equipSpeed" DOUBLE PRECISION,
    "adsSpeed" DOUBLE PRECISION,
    "reloadSpeed" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "recoil" DOUBLE PRECISION,
    "aimAssist" DOUBLE PRECISION,
    "magazineSize" INTEGER,
    "zoom" DOUBLE PRECISION,
    "pelletCount" INTEGER,
    "spreadAngle" DOUBLE PRECISION,
    "voltDrain" DOUBLE PRECISION,
    "chargeTime" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponTTK" (
    "id" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "damage" DOUBLE PRECISION NOT NULL,
    "rpm" DOUBLE PRECISION NOT NULL,
    "headshotMultiplier" DOUBLE PRECISION NOT NULL,
    "headshotDamage" DOUBLE PRECISION NOT NULL,
    "range" DOUBLE PRECISION NOT NULL,
    "dps" DOUBLE PRECISION NOT NULL,
    "shotsToKill" TEXT NOT NULL,
    "ttkWhite" DOUBLE PRECISION NOT NULL,
    "ttkGreen" DOUBLE PRECISION NOT NULL,
    "ttkBlue" DOUBLE PRECISION NOT NULL,
    "ttkPurple" DOUBLE PRECISION NOT NULL,
    "ttkHeadWhite" DOUBLE PRECISION NOT NULL,
    "ttkHeadGreen" DOUBLE PRECISION NOT NULL,
    "ttkHeadBlue" DOUBLE PRECISION NOT NULL,
    "ttkHeadPurple" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WeaponTTK_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ModType" NOT NULL,
    "rarity" "ModRarity" NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "imageUrl" TEXT,
    "statModifiers" JSONB,
    "isUniversal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponMod" (
    "id" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "statModifiers" JSONB,

    CONSTRAINT "WeaponMod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "message" VARCHAR(180) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_expires_in" INTEGER,
    "membership_id" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "type" "BuildType" NOT NULL,
    "weaponId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildMod" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "modType" "ModType" NOT NULL,

    CONSTRAINT "BuildMod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildVote" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "BuildVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_name_key" ON "Weapon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_slug_key" ON "Weapon"("slug");

-- CreateIndex
CREATE INDEX "Weapon_type_idx" ON "Weapon"("type");

-- CreateIndex
CREATE INDEX "Weapon_slot_idx" ON "Weapon"("slot");

-- CreateIndex
CREATE INDEX "Weapon_ammoType_idx" ON "Weapon"("ammoType");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponTTK_weaponId_key" ON "WeaponTTK"("weaponId");

-- CreateIndex
CREATE UNIQUE INDEX "Mod_name_key" ON "Mod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Mod_slug_key" ON "Mod"("slug");

-- CreateIndex
CREATE INDEX "Mod_type_idx" ON "Mod"("type");

-- CreateIndex
CREATE INDEX "Mod_rarity_idx" ON "Mod"("rarity");

-- CreateIndex
CREATE INDEX "WeaponMod_weaponId_idx" ON "WeaponMod"("weaponId");

-- CreateIndex
CREATE INDEX "WeaponMod_modId_idx" ON "WeaponMod"("modId");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponMod_weaponId_modId_key" ON "WeaponMod"("weaponId", "modId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Build_weaponId_score_idx" ON "Build"("weaponId", "score");

-- CreateIndex
CREATE INDEX "BuildMod_buildId_idx" ON "BuildMod"("buildId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildMod_buildId_modType_key" ON "BuildMod"("buildId", "modType");

-- CreateIndex
CREATE INDEX "BuildVote_buildId_idx" ON "BuildVote"("buildId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildVote_buildId_userId_key" ON "BuildVote"("buildId", "userId");

-- AddForeignKey
ALTER TABLE "WeaponTTK" ADD CONSTRAINT "WeaponTTK_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponMod" ADD CONSTRAINT "WeaponMod_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponMod" ADD CONSTRAINT "WeaponMod_modId_fkey" FOREIGN KEY ("modId") REFERENCES "Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildMod" ADD CONSTRAINT "BuildMod_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildMod" ADD CONSTRAINT "BuildMod_modId_fkey" FOREIGN KEY ("modId") REFERENCES "Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildVote" ADD CONSTRAINT "BuildVote_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildVote" ADD CONSTRAINT "BuildVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

