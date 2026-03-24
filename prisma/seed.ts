import { PrismaClient, Prisma } from "../generated/prisma";

const db = new PrismaClient();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const weapons = [
  // === ASSAULT RIFLES ===
  {
    name: "Overrun AR",
    type: "ASSAULT_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    price: 50,
    description: "Light assault rifle with high rate of fire.",
    firepower: 14.7,
    damage: 10.5,
    precisionMultiplier: 1.4,
    rateOfFire: 720,
    range: 40,
    accuracy: 50.3,
    hipfireSpread: 2.32,
    adsSpread: 0.94,
    crouchSpreadBonus: 87.5,
    movingInaccuracy: 90.9,
    handling: 46,
    equipSpeed: 0.94,
    adsSpeed: 0.43,
    reloadSpeed: 2.37,
    weight: 32,
    recoil: 78.3,
    aimAssist: 1.68,
    magazineSize: 20,
    zoom: 1.2,
  },
  {
    name: "M77 Assault Rifle",
    type: "ASSAULT_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    price: 1200,
    description:
      "Ballistic assault rifle. Toggle the built-in flip scope for high precision.",
    firepower: 24,
    damage: 16,
    precisionMultiplier: 1.5,
    rateOfFire: 450,
    range: 46,
    accuracy: 59.3,
    hipfireSpread: 2.15,
    adsSpread: 0.98,
    crouchSpreadBonus: 80,
    movingInaccuracy: 32.7,
    handling: 38,
    equipSpeed: 0.94,
    adsSpeed: 0.5,
    reloadSpeed: 2.6,
    weight: 32,
    recoil: 114,
    aimAssist: 1.96,
    magazineSize: 24,
    zoom: 1.2,
  },
  {
    name: "Impact HAR",
    type: "ASSAULT_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "HEAVY_ROUNDS" as const,
    rarity: "Standard",
    description:
      "The Impact HAR is a semi-automatic Assault Rifle that uses Heavy Rounds. This slower-firing weapon emphasizes stability and higher damage per shot.",
    firepower: 38.4,
    damage: 24,
    precisionMultiplier: 1.6,
    rateOfFire: 400,
    range: 60,
    accuracy: 48.5,
    hipfireSpread: 3.3,
    adsSpread: 0.48,
    crouchSpreadBonus: 80,
    movingInaccuracy: 90.9,
    handling: 36,
    equipSpeed: 0.9,
    adsSpeed: 0.8,
    reloadSpeed: 3.3,
    weight: 32,
    recoil: 100,
    aimAssist: 0.9,
    magazineSize: 18,
    zoom: 1.2,
  },
  {
    name: "V75 Scar",
    type: "ASSAULT_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "VOLT_BATTERY" as const,
    rarity: "Standard",
    description:
      "Volt-actuated assault rifle with tracking projectiles. Sustained fire overheats the weapon, lowering its rate of fire.",
    firepower: 20.3,
    accuracy: 59.3,
    handling: 42,
    range: 46,
    zoom: 1.2,
    voltDrain: 2.5,
  },

  // === SUBMACHINE GUNS ===
  {
    name: "Bully SMG",
    type: "SMG" as const,
    slot: "PRIMARY" as const,
    ammoType: "HEAVY_ROUNDS" as const,
    rarity: "Standard",
    description: "Heavy ballistic submachine gun with brutal reputation.",
    firepower: 22.5,
    damage: 15,
    precisionMultiplier: 1.5,
    rateOfFire: 540,
    range: 27,
    accuracy: 62,
    hipfireSpread: 1.55,
    adsSpread: 1.36,
    crouchSpreadBonus: 80,
    movingInaccuracy: 17.7,
    handling: 47,
    equipSpeed: 0.9,
    adsSpeed: 0.35,
    reloadSpeed: 2.76,
    weight: 27.5,
    recoil: 82,
    aimAssist: 2.59,
    magazineSize: 23,
    zoom: 1.1,
  },
  {
    name: "V22 Volt Thrower",
    type: "SMG" as const,
    slot: "PRIMARY" as const,
    ammoType: "VOLT_BATTERY" as const,
    rarity: "Standard",
    description: "Volt-actuated submachine gun with smart lock-on system",
    firepower: 21,
    damage: 21,
    precisionMultiplier: 1.0,
    rateOfFire: 507,
    range: 11,
    accuracy: 74.1,
    hipfireSpread: 0.98,
    adsSpread: 0.45,
    crouchSpreadBonus: 80,
    movingInaccuracy: 20.5,
    handling: 42,
    equipSpeed: 0.9,
    adsSpeed: 0.4,
    reloadSpeed: 3.1,
    weight: 30,
    recoil: 98,
    aimAssist: 1.78,
    zoom: 1.4,
    voltDrain: 1.2,
  },
  {
    name: "BRRT SMG",
    type: "SMG" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Compact submachine gun with five-round burst firing mechanism.",
    firepower: 16.1,
    damage: 11,
    precisionMultiplier: 1.4,
    rateOfFire: 1000,
    range: 16,
    accuracy: 60.5,
    hipfireSpread: 1.93,
    adsSpread: 1.16,
    crouchSpreadBonus: 85,
    movingInaccuracy: 17.7,
    handling: 35,
    equipSpeed: 0.9,
    adsSpeed: 0.35,
    reloadSpeed: 3.0,
    weight: 27.5,
    recoil: 143.6,
    aimAssist: 2.44,
    magazineSize: 35,
    zoom: 1.1,
  },
  {
    name: "Copperhead RF",
    type: "SMG" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description: "Light submachine gun with rapid semiautomatic fire.",
    firepower: 16.8,
    accuracy: 49.1,
    handling: 46,
    range: 15,
    magazineSize: 21,
    zoom: 1.1,
  },

  // === LIGHT MACHINE GUNS ===
  {
    name: "Conquest LMG",
    type: "LMG" as const,
    slot: "HEAVY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Light machine gun with ramping rate of fire. Stability is increased while firing from crouched position.",
    firepower: 22.4,
    damage: 16,
    precisionMultiplier: 1.4,
    rateOfFire: 540,
    range: 60,
    accuracy: 49.9,
    hipfireSpread: 2.8,
    adsSpread: 0.85,
    crouchSpreadBonus: 70,
    movingInaccuracy: 90.9,
    handling: 22,
    equipSpeed: 1.2,
    adsSpeed: 0.8,
    reloadSpeed: 6.4,
    weight: 47.5,
    recoil: 90,
    aimAssist: 1.4,
    magazineSize: 36,
    zoom: 1.2,
  },
  {
    name: "Demolition HMG",
    type: "LMG" as const,
    slot: "HEAVY" as const,
    ammoType: "HEAVY_ROUNDS" as const,
    rarity: "Standard",
    description: "Heavy machine gun with moderate rate of fire.",
    firepower: 47.25,
    damage: 31.5,
    precisionMultiplier: 1.5,
    rateOfFire: 225,
    range: 33,
    accuracy: 47.34,
    hipfireSpread: 1.52,
    adsSpread: 1.16,
    crouchSpreadBonus: 80,
    movingInaccuracy: 20.5,
    handling: 31,
    equipSpeed: 1.2,
    adsSpeed: 0.76,
    reloadSpeed: 5.46,
    weight: 47.5,
    recoil: 57.5,
    aimAssist: 1.78,
    magazineSize: 20,
    zoom: 1.2,
  },
  {
    name: "Retaliator LMG",
    type: "LMG" as const,
    slot: "HEAVY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description: "Belt-fed light machine gun with high rate of fire.",
    firepower: 16.4,
    range: 51,
    accuracy: 49.8,
    handling: 25,
    magazineSize: 44,
    zoom: 1.2,
  },

  // === PISTOLS ===
  {
    name: "CE Tactical Sidearm",
    type: "PISTOL" as const,
    slot: "SECONDARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Light ballistic pistol with standard semiautomatic fire.",
    firepower: 36.0,
    damage: 20,
    precisionMultiplier: 1.8,
    rateOfFire: 300,
    range: 21,
    accuracy: 56.3,
    hipfireSpread: 1.47,
    adsSpread: 1.03,
    crouchSpreadBonus: 90,
    movingInaccuracy: 81.8,
    handling: 58,
    equipSpeed: 0.8,
    adsSpeed: 0.33,
    reloadSpeed: 2.1,
    weight: 26,
    recoil: 43,
    aimAssist: 1.55,
    magazineSize: 18,
    zoom: 1.1,
  },
  {
    name: "Magnum MC",
    type: "PISTOL" as const,
    slot: "SECONDARY" as const,
    ammoType: "HEAVY_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Heavy pistol equipped with modular muzzle and optics rail.",
    firepower: 66.0,
    damage: 33,
    precisionMultiplier: 2.1,
    rateOfFire: 138,
    range: 21,
    accuracy: 58.3,
    hipfireSpread: 1.39,
    adsSpread: 0.38,
    crouchSpreadBonus: 90,
    movingInaccuracy: 90.9,
    handling: 50,
    equipSpeed: 0.8,
    adsSpeed: 0.38,
    reloadSpeed: 1.9,
    weight: 28,
    recoil: 81.5,
    aimAssist: 1.28,
    magazineSize: 12,
    zoom: 1.4,
  },
  {
    name: "V11 Punch",
    type: "PISTOL" as const,
    slot: "SECONDARY" as const,
    ammoType: "VOLT_BATTERY" as const,
    rarity: "Standard",
    price: 25,
    description:
      "Volt-actuated pistol. Tap for semiautomatic fire or hold to build and release a high-damage burst.",
    firepower: 37.5,
    damage: 25,
    precisionMultiplier: 1.5,
    rateOfFire: 600,
    range: 21,
    accuracy: 36,
    hipfireSpread: 3.13,
    adsSpread: 1.72,
    crouchSpreadBonus: 90,
    movingInaccuracy: 100,
    handling: 49,
    equipSpeed: 0.8,
    adsSpeed: 0.3,
    reloadSpeed: 3.6,
    weight: 26,
    recoil: 76.5,
    aimAssist: 2.45,
    zoom: 1.1,
    voltDrain: 4.5,
  },

  // === SNIPER RIFLES ===
  {
    name: "Longshot",
    type: "SNIPER_RIFLE" as const,
    slot: "SECONDARY" as const,
    ammoType: "MIPS_ROUNDS" as const,
    rarity: "Standard",
    description:
      "The Longshot is a Sniper Rifle that uses MIPS Rounds. It excels at long range assassinations.",
    firepower: 140,
    damage: 70,
    precisionMultiplier: 2.0,
    rateOfFire: 50,
    range: 175,
    accuracy: 74.8,
    hipfireSpread: 6.75,
    adsSpread: 0,
    crouchSpreadBonus: 60,
    movingInaccuracy: 90.9,
    handling: 29,
    equipSpeed: 1.7,
    adsSpeed: 1.1,
    reloadSpeed: 4.7,
    weight: 38,
    recoil: 60,
    aimAssist: 0.3,
    magazineSize: 3,
    zoom: 4.0,
  },
  {
    name: "V99 Channel Rifle",
    type: "SNIPER_RIFLE" as const,
    slot: "SECONDARY" as const,
    ammoType: "VOLT_CELL" as const,
    rarity: "Standard",
    description:
      "Powerful volt sniper rifle that charges up for increased damage while scoped. Hits almost instantly at long range.",
    firepower: 120.0,
    accuracy: 71.2,
    handling: 29,
    range: 175,
    zoom: 4.0,
    voltDrain: 29,
  },
  {
    name: "Outland",
    type: "SNIPER_RIFLE" as const,
    slot: "SECONDARY" as const,
    ammoType: "MIPS_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Ballistic bolt-action sniper rifle. Extreme damage and range.",
  },

  // === SHOTGUNS ===
  {
    name: "WSTR Combat Shotgun",
    type: "SHOTGUN" as const,
    slot: "SECONDARY" as const,
    ammoType: "MIPS_ROUNDS" as const,
    rarity: "Standard",
    description:
      "The WSTR Combat Shotgun is a double-barrel Shotgun that uses MIPS Rounds. It packs high damage in close quarters.",
    firepower: 172.5,
    damage: 11,
    precisionMultiplier: 1.5,
    rateOfFire: 1.3,
    range: 8,
    accuracy: 50,
    hipfireSpread: 45,
    handling: 45,
    equipSpeed: 0.9,
    adsSpeed: 0.42,
    reloadSpeed: 2.6,
    weight: 36,
    recoil: 73,
    aimAssist: 3.15,
    magazineSize: 2,
    zoom: 1.1,
    pelletCount: 10,
    spreadAngle: 2.4,
  },
  {
    name: "Misriah 2442",
    type: "SHOTGUN" as const,
    slot: "SECONDARY" as const,
    ammoType: "MIPS_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Pump-action shotgun kept for close encounters. Reloads one MIPS cartridge at a time.",
  },
  {
    name: "V85 Circuit Breaker",
    type: "SHOTGUN" as const,
    slot: "SECONDARY" as const,
    ammoType: "VOLT_CELL" as const,
    rarity: "Standard",
    description:
      "Fixed-pattern heavy volt shotgun. Can be charged up to three levels.",
    firepower: 220.0,
    handling: 42,
    range: 14,
    spreadAngle: 1.7,
    zoom: 1.1,
  },

  // === PRECISION RIFLES ===
  {
    name: "Hardline PR",
    type: "PRECISION_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Single-round semiautomatic precision rifle with high rate of fire",
    firepower: 50.4,
    damage: 28,
    precisionMultiplier: 1.8,
    rateOfFire: 275,
    range: 69,
    accuracy: 65.1,
    hipfireSpread: 2.35,
    adsSpread: 0.44,
    crouchSpreadBonus: 60,
    movingInaccuracy: 20.5,
    handling: 36,
    equipSpeed: 0.94,
    adsSpeed: 0.45,
    reloadSpeed: 3.6,
    weight: 37,
    recoil: 103.2,
    aimAssist: 1.01,
    magazineSize: 16,
    zoom: 1.2,
  },
  {
    name: "Repeater HPR",
    type: "PRECISION_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "HEAVY_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Lever-action heavy precision rifle. Reloads one round at a time.",
    firepower: 48,
    damage: 48,
    precisionMultiplier: 2.0,
    rateOfFire: 86,
    range: 37,
    accuracy: 60.4,
    hipfireSpread: 2.65,
    adsSpread: 0.92,
    crouchSpreadBonus: 60,
    movingInaccuracy: 20.5,
    handling: 52,
    equipSpeed: 0.9,
    adsSpeed: 0.34,
    reloadSpeed: 0.9,
    weight: 37,
    recoil: 57.8,
    aimAssist: 1.01,
    magazineSize: 9,
    zoom: 1.2,
  },
  {
    name: "Twin Tap HBR",
    type: "PRECISION_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "HEAVY_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Burst-fire heavy ballistic precision rifle with dual-round delivery system.",
    firepower: 25,
    damage: 13,
    precisionMultiplier: 1.6,
    rateOfFire: 420,
    range: 48,
    accuracy: 59.8,
    hipfireSpread: 2.24,
    adsSpread: 1.29,
    crouchSpreadBonus: 0,
    movingInaccuracy: 81.8,
    handling: 51,
    equipSpeed: 0.94,
    adsSpeed: 0.35,
    reloadSpeed: 2.37,
    weight: 37.5,
    recoil: 44.9,
    aimAssist: 1.1,
    magazineSize: 20,
    zoom: 1.4,
  },
  {
    name: "Stryder M1T",
    type: "PRECISION_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    description: "Fine-tuned semiautomatic precision rifle.",
    firepower: 46.5,
    accuracy: 59.4,
    handling: 39,
    range: 84,
    magazineSize: 12,
    zoom: 1.4,
  },
  {
    name: "V66 Lookout",
    type: "PRECISION_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "VOLT_BATTERY" as const,
    rarity: "Standard",
    description:
      "Volt-actuated precision rifle with tracking projectiles. Sustained fire overheats the weapon, lowering its rate of fire.",
    firepower: 46.8,
    range: 88,
    accuracy: 66,
    handling: 46,
    zoom: 1.4,
    voltDrain: 3.4,
  },
  {
    name: "B33 Volley Rifle",
    type: "PRECISION_RIFLE" as const,
    slot: "PRIMARY" as const,
    ammoType: "LIGHT_ROUNDS" as const,
    rarity: "Standard",
    price: 480,
    description:
      "Semiautomatic precision rifle with three-round burst fire.",
    firepower: 20.7,
    damage: 14.8,
    precisionMultiplier: 1.4,
    rateOfFire: 900,
    range: 49,
    accuracy: 61.2,
    hipfireSpread: 2.2,
    adsSpread: 0.96,
    crouchSpreadBonus: 80,
    movingInaccuracy: 16.4,
    handling: 45,
    equipSpeed: 0.94,
    adsSpeed: 0.4,
    weight: 28,
    recoil: 87.3,
    aimAssist: 1.94,
    reloadSpeed: 3.0,
    magazineSize: 27,
    zoom: 1.4,
  },

  // === RAILGUNS ===
  {
    name: "V00 Zeus RG",
    type: "RAILGUN" as const,
    slot: "HEAVY" as const,
    ammoType: "VOLT_CELL" as const,
    rarity: "Standard",
    description:
      "Anti-materiel railgun. Fires automatically once fully charged.",
    firepower: 196.5,
    damage: 120,
    precisionMultiplier: 1.5,
    rateOfFire: 90,
    range: 155,
    accuracy: 74.8,
    hipfireSpread: 4.1,
    adsSpread: 0,
    crouchSpreadBonus: 60,
    movingInaccuracy: 90.9,
    handling: 49,
    equipSpeed: 0.9,
    adsSpeed: 0.55,
    reloadSpeed: 3.5,
    weight: 20,
    recoil: 100,
    aimAssist: 1.65,
    zoom: 2.5,
    voltDrain: 50,
    chargeTime: 0.75,
  },
  {
    name: "Ares RG",
    type: "RAILGUN" as const,
    slot: "HEAVY" as const,
    ammoType: "MIPS_ROUNDS" as const,
    rarity: "Standard",
    description:
      "Heavy ballistic railgun. Charges up to fire massive projectile at extreme velocity.",
    firepower: 159.9,
    accuracy: 100.0,
    handling: 47,
    range: 55,
    magazineSize: 4,
    zoom: 2.5,
  },
];

async function main() {
  console.log(`Seeding ${weapons.length} weapons...`);

  for (const weapon of weapons) {
    const slug = slugify(weapon.name);
    const imageUrl = `/weapons/${slug}.png`;
    await db.weapon.upsert({
      where: { name: weapon.name },
      update: { ...weapon, slug, imageUrl },
      create: { ...weapon, slug, imageUrl },
    });
    console.log(`  ✓ ${weapon.name}`);
  }

  console.log(`\nSeeded ${weapons.length} weapons.`);

  // === MODS ===
  type StatModifier = { stat: string; direction: "up" | "down"; label: string };
  type WeaponStatModifier = StatModifier & { value: number };

  const mods: {
    name: string;
    type: "BARREL" | "GRIP" | "MAGAZINE" | "OPTIC" | "SHIELD" | "GENERATOR" | "CHIP";
    rarity: "PRESTIGE" | "SUPERIOR" | "DELUXE" | "ENHANCED" | "STANDARD";
    description?: string;
    price?: number;
    imageUrl?: string;
    isUniversal?: boolean;
    compatibleWeapons: string[];
    statModifiers?: StatModifier[];
    // Weapon-specific stat values — keyed by weapon name
    weaponStats?: Record<string, WeaponStatModifier[]>;
  }[] = [
    // --- BARREL (14) ---
    { name: "Flechette Split Action", type: "BARREL", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the BRRT SMG. Increases stability, handling, and accuracy when firing from the hip", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/f/f3/Flechette_Split_Action.png", compatibleWeapons: ["BRRT SMG"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }, { stat: "handling", direction: "up", label: "Handling" }, { stat: "hipfireSpread", direction: "up", label: "Hipfire Accuracy" }] },
    { name: "Lockout Muzzle Brake", type: "BARREL", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the BR33 Volley Rifle. Increases movement speed with this weapon. While firing from the hip, this weapon has greatly increased accuracy, stability, and range.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/4/47/Lockout_Muzzle_Brake.png", compatibleWeapons: ["B33 Volley Rifle"], statModifiers: [{ stat: "movementSpeed", direction: "up", label: "Movement Speed" }, { stat: "hipfireSpread", direction: "up", label: "Hipfire Accuracy" }, { stat: "stability", direction: "up", label: "Stability" }, { stat: "range", direction: "up", label: "Range" }] },
    { name: "MIPS Slug Converter", type: "BARREL", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the WSTR Combat Shotgun. Increases rate of fire, stability, aim assist, range, and reduces pellet spread. Press to convert shells to a high-powered slug projectile.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/1/14/MIPS_Slug_Converter.png", compatibleWeapons: ["WSTR Combat Shotgun"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Rate of Fire" }, { stat: "stability", direction: "up", label: "Stability" }, { stat: "aimAssist", direction: "up", label: "Aim Assist" }, { stat: "range", direction: "up", label: "Range" }, { stat: "spreadAngle", direction: "up", label: "Pellet Spread" }] },
    { name: "Pinpoint Barrel", type: "BARREL", rarity: "SUPERIOR", price: 540, description: "Greatly increases stability and range.", compatibleWeapons: ["WSTR Combat Shotgun", "Misriah 2442"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }, { stat: "range", direction: "up", label: "Range" }] },
    { name: "Steady Barrel", type: "BARREL", rarity: "SUPERIOR", price: 540, description: "Greatly increases stability, ready speed, and accuracy while moving.", compatibleWeapons: ["Stryder M1T", "Hardline PR", "Repeater HPR", "Twin Tap HBR", "Longshot", "Outland"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }, { stat: "equipSpeed", direction: "up", label: "Ready Speed" }, { stat: "movingInaccuracy", direction: "up", label: "Moving Accuracy" }] },
    { name: "Suppression Dampener", type: "BARREL", rarity: "DELUXE", price: 207, description: "Shots fired from this weapon are silenced. Increases stability.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/4/4b/Suppression_Dampener.png", compatibleWeapons: [], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }] },
    { name: "Precision Barrel", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Slightly increases ADS accuracy and range.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/9/94/Precision_Barrel.png", compatibleWeapons: ["BRRT SMG", "Copperhead RF", "Bully SMG", "CE Tactical Sidearm", "Magnum MC"], statModifiers: [{ stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "range", direction: "up", label: "Range" }], weaponStats: { "Bully SMG": [{ stat: "adsSpread", direction: "up", label: "ADS Spread", value: -0.04 }, { stat: "range", direction: "up", label: "Range", value: 5 }] } },
    { name: "Precision Choke", type: "BARREL", rarity: "DELUXE", price: 180, description: "Increases range and aim assist.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/d/da/Precision_Choke.png", compatibleWeapons: ["WSTR Combat Shotgun", "Misriah 2442"], statModifiers: [{ stat: "range", direction: "up", label: "Range" }, { stat: "aimAssist", direction: "up", label: "Aim Assist" }] },
    { name: "Farshot Barrel", type: "BARREL", rarity: "ENHANCED", description: "Slightly increases range.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/0/04/Farshot_Barrel.png", compatibleWeapons: [], statModifiers: [{ stat: "range", direction: "up", label: "Range" }] },
    { name: "Impulse Brake", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Slightly increases ADS accuracy.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/b/bd/Impluse_Brake.png", compatibleWeapons: ["Stryder M1T", "Hardline PR", "Repeater HPR", "B33 Volley Rifle", "Twin Tap HBR", "Longshot", "Outland"], statModifiers: [{ stat: "adsSpread", direction: "up", label: "ADS Spread" }, { stat: "recoil", direction: "down", label: "Recoil" }, { stat: "aimAssist", direction: "up", label: "Aim Assist" }], weaponStats: { "B33 Volley Rifle": [{ stat: "adsSpread", direction: "up", label: "ADS Spread", value: -0.08 }, { stat: "recoil", direction: "down", label: "Recoil", value: 31.1 }, { stat: "aimAssist", direction: "up", label: "Aim Assist", value: 0.18 }] } },
    { name: "Ironhold Barrel", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Slightly increases stability and reduces flinch.", compatibleWeapons: ["BRRT SMG", "Copperhead RF", "Bully SMG", "CE Tactical Sidearm", "Magnum MC"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }, { stat: "flinch", direction: "up", label: "Flinch Resistance" }] },
    { name: "Stabilizing Barrel", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Slightly increases stability.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/7/7b/Stabilizing_Barrel.png", compatibleWeapons: ["V66 Lookout", "V99 Channel Rifle"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }] },
    { name: "Weighted Barrel", type: "BARREL", rarity: "ENHANCED", price: 540, description: "Slightly increases aim assist.", compatibleWeapons: ["BRRT SMG", "Copperhead RF", "Bully SMG", "CE Tactical Sidearm", "Magnum MC"], statModifiers: [{ stat: "aimAssist", direction: "up", label: "Aim Assist" }] },
    { name: "Nano-Suppressor", type: "BARREL", rarity: "ENHANCED", description: "Shots fired from this weapon are silenced.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/0/0a/Marathon_nano-suppressor_enhanced.jpg", compatibleWeapons: ["BRRT SMG", "Copperhead RF", "Bully SMG", "CE Tactical Sidearm", "Magnum MC"] },
    { name: "Suppression Muzzle", type: "BARREL", rarity: "PRESTIGE", price: 1600, description: "Shots fired from this weapon are silenced. Greatly increases stability and accuracy.", compatibleWeapons: ["BRRT SMG", "Bully SMG", "Copperhead RF", "V22 Volt Thrower"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }, { stat: "accuracy", direction: "up", label: "Accuracy" }] },
    { name: "Tru-shot Barrel", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Slightly increases aim assist.", compatibleWeapons: ["Stryder M1T", "Hardline PR", "Repeater HPR", "B33 Volley Rifle", "Twin Tap HBR", "Longshot", "Outland"], statModifiers: [{ stat: "aimAssist", direction: "up", label: "Aim Assist" }], weaponStats: { "B33 Volley Rifle": [{ stat: "aimAssist", direction: "up", label: "Aim Assist", value: 0.35 }], "Hardline PR": [{ stat: "aimAssist", direction: "up", label: "Aim Assist", value: 0.07 }], "Repeater HPR": [{ stat: "aimAssist", direction: "up", label: "Aim Assist", value: 0.07 }] } },
    { name: "Quickfire Barrel", type: "BARREL", rarity: "ENHANCED", price: 0, description: "Slightly increases rate of fire.", compatibleWeapons: ["V99 Channel Rifle", "V66 Lookout"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Rate of Fire" }] },
    { name: "Accu-point Dampener", type: "BARREL", rarity: "ENHANCED", price: 0, description: "Slightly increases ADS accuracy.", compatibleWeapons: ["V75 Scar", "V22 Volt Thrower", "V11 Punch"], statModifiers: [{ stat: "adsSpread", direction: "up", label: "ADS Accuracy" }] },
    { name: "Hi-Focus Dampener", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Increases ADS accuracy and range.", compatibleWeapons: ["V75 Scar", "V22 Volt Thrower", "V11 Punch"], statModifiers: [{ stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "range", direction: "up", label: "Range" }] },
    { name: "Hipshot Dampener", type: "BARREL", rarity: "ENHANCED", price: 60, description: "Slightly increases accuracy when firing from the hip and movement speed with this weapon.", compatibleWeapons: ["V75 Scar", "V22 Volt Thrower", "V11 Punch"], statModifiers: [{ stat: "hipfireSpread", direction: "up", label: "Hipfire Accuracy" }, { stat: "weight", direction: "up", label: "Weight" }] },

    // --- GRIP (4) ---
    { name: "Combat Grip", type: "GRIP", rarity: "ENHANCED", price: 60, description: "Slightly increases ADS speed and ready speed.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/e/e2/Combat_Grip.png", compatibleWeapons: ["M77 Assault Rifle", "Overrun AR", "Impact HAR"], statModifiers: [{ stat: "equipSpeed", direction: "up", label: "Equip Speed" }, { stat: "adsSpeed", direction: "up", label: "ADS Speed" }], weaponStats: { "M77 Assault Rifle": [{ stat: "equipSpeed", direction: "up", label: "Equip Speed", value: -0.09 }, { stat: "adsSpeed", direction: "up", label: "ADS Speed", value: -0.02 }] } },
    { name: "Snapshot Grip", type: "GRIP", rarity: "DELUXE", price: 180, description: "Increases accuracy while moving and ADS speed.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/9/93/Snapshot_Grip.png", compatibleWeapons: ["WSTR Combat Shotgun", "Misriah 2442", "V85 Circuit Breaker"], statModifiers: [{ stat: "movingInaccuracy", direction: "up", label: "Moving Accuracy" }, { stat: "adsSpeed", direction: "up", label: "ADS Speed" }] },
    { name: "Speed Scout Grip", type: "GRIP", rarity: "ENHANCED", price: 0, description: "Slightly increases movement speed with this weapon.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR"], statModifiers: [{ stat: "movementSpeed", direction: "up", label: "Movement Speed" }] },
    { name: "Vigilant Grip", type: "GRIP", rarity: "ENHANCED", price: 0, description: "Slightly increases ready speed.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR"], statModifiers: [{ stat: "equipSpeed", direction: "up", label: "Ready Speed" }] },

    // --- MAGAZINE (19) ---
    { name: "Kingmaker Mag", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A unique mod for the Longshot. Increases reload speed and magazine size. Headshots increase rate of fire. Stacks up to three times.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/81/Kingmaker_Mag.png", compatibleWeapons: ["Longshot"], statModifiers: [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "rateOfFire", direction: "up", label: "Rate of Fire" }] },
    { name: "Overclocked Delimiter", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the V85 Circuit Breaker. Increases magazine size and reload speed. Adds a third level of charge. When fully charged, this weapon has greatly reduced spread, increased damage, and its projectiles ricochet and pierce hostiles.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/5/53/Overclocked_Delimiter.png", compatibleWeapons: ["V85 Circuit Breaker"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "damage", direction: "up", label: "Damage" }, { stat: "spreadAngle", direction: "up", label: "Spread" }] },
    { name: "Ram-Page Mag", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the V75 SCAR. Increases rate of fire, magazine size, and reload speed. Rate of fire no longer decreases as heat builds and projectiles ricochet off surfaces, tracking nearby targets.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/b/ba/Ram-Page_Mag.png", compatibleWeapons: ["V75 Scar"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Rate of Fire" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }] },
    { name: "Adrenal Feedback Rounds", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Hardline PR. Increases Magazine Size. Precision hits reduce your shell's heat and grant a stack of Micro-Adrenaline, increasing Heat Capacity and Agility for a short duration.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/4/4a/Adrenal_Feedback_Rounds.png", compatibleWeapons: ["Hardline PR"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "heatCapacity", direction: "up", label: "Heat Capacity" }, { stat: "movementSpeed", direction: "up", label: "Agility" }] },
    { name: "Rodeo Mag", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Bully SMG. Increases rate of fire, stability, and magazine size. This weapon's fire rate greatly increases over time.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/3/37/Rodeo_Mag.png", compatibleWeapons: ["Bully SMG"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Rate of Fire" }, { stat: "stability", direction: "up", label: "Stability" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Air-Cooled Chamber", type: "MAGAZINE", rarity: "SUPERIOR", price: 60, description: "Greatly increases reload speed and magazine size.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/3/3b/Air-Cooled_Chamber.png", compatibleWeapons: ["V99 Channel Rifle", "V00 Zeus RG", "V85 Circuit Breaker"], statModifiers: [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Hi-Cap Mag", type: "MAGAZINE", rarity: "ENHANCED", price: 78, description: "Increases magazine size.", compatibleWeapons: ["Stryder M1T", "Hardline PR", "B33 Volley Rifle", "Twin Tap HBR", "Longshot"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }], weaponStats: { "B33 Volley Rifle": [{ stat: "magazineSize", direction: "up", label: "Magazine", value: 18 }], "Hardline PR": [{ stat: "magazineSize", direction: "up", label: "Magazine", value: 4 }], "Stryder M1T": [{ stat: "magazineSize", direction: "up", label: "Magazine", value: 6 }] } },
    { name: "Steady Mag", type: "MAGAZINE", rarity: "ENHANCED", price: 42, description: "Slightly increases magazine size and stability.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/81/Steady_Mag.png", compatibleWeapons: ["CE Tactical Sidearm"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "stability", direction: "up", label: "Stability" }] },
    { name: "Turbo Chamber", type: "MAGAZINE", rarity: "ENHANCED", price: 0, description: "Slightly increases rate of fire.", compatibleWeapons: ["V22 Volt Thrower", "V11 Punch", "V66 Lookout"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Rate of Fire" }] },
    { name: "Slick Mag I", type: "MAGAZINE", rarity: "ENHANCED", price: 60, description: "Slightly increases rate of fire and magazine size.", compatibleWeapons: ["Misriah 2442"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Rate of Fire" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Reloader Mag", type: "MAGAZINE", rarity: "ENHANCED", price: 69, description: "Slightly increases reload speed and magazine size.", compatibleWeapons: ["M77 Assault Rifle", "Overrun AR", "Impact HAR", "Copperhead RF", "Bully SMG"], statModifiers: [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }], weaponStats: { "M77 Assault Rifle": [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed", value: -0.13 }, { stat: "magazineSize", direction: "up", label: "Magazine", value: 3 }] } },
    { name: "Extended Feather Mag", type: "MAGAZINE", rarity: "ENHANCED", price: 60, description: "Slightly increases magazine size and reduces weapon weight.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR", "V75 Scar"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "weight", direction: "up", label: "Weight" }] },
    { name: "Hollow-Case Rounds", type: "MAGAZINE", rarity: "ENHANCED", price: 60, description: "Slightly increases damage at the cost of range.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR", "Bully SMG", "Copperhead RF"], statModifiers: [{ stat: "damage", direction: "up", label: "Damage" }, { stat: "range", direction: "down", label: "Range" }] },
    { name: "Drum Mag", type: "MAGAZINE", rarity: "DELUXE", price: 234, description: "Greatly increases magazine size.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR", "Bully SMG", "Copperhead RF"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Steady Rounds", type: "MAGAZINE", rarity: "ENHANCED", price: 69, description: "Slightly increases stability and magazine size.", compatibleWeapons: ["M77 Assault Rifle", "Overrun AR", "Impact HAR", "Copperhead RF", "Bully SMG"], statModifiers: [{ stat: "recoil", direction: "up", label: "Recoil" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }], weaponStats: { "Bully SMG": [{ stat: "recoil", direction: "up", label: "Recoil", value: -9.6 }, { stat: "magazineSize", direction: "up", label: "Magazine", value: 6 }] } },
    { name: "Combat Mag", type: "MAGAZINE", rarity: "DELUXE", price: 207, description: "Increases magazine size, reload speed, and range.", compatibleWeapons: ["Hardline PR", "Twin Tap HBR", "Stryder M1T", "B33 Volley Rifle", "Longshot"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "range", direction: "up", label: "Range" }], weaponStats: { "B33 Volley Rifle": [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed", value: -0.40 }, { stat: "range", direction: "up", label: "Range", value: 7 }, { stat: "magazineSize", direction: "up", label: "Magazine", value: 24 }], "Stryder M1T": [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed", value: -0.39 }, { stat: "range", direction: "up", label: "Range", value: 6 }, { stat: "magazineSize", direction: "up", label: "Magazine", value: 8 }] } },
    { name: "Scope Linked Magazine", type: "MAGAZINE", rarity: "PRESTIGE", price: 0, description: "A custom-made mod for the M77 Assault Rifle. Increases magazine size and reload speed. While ADS through the flip scope, this weapon has increased accuracy and rate of fire.", compatibleWeapons: ["M77 Assault Rifle"], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "accuracy", direction: "up", label: "Accuracy" }, { stat: "rateOfFire", direction: "up", label: "Rate of Fire" }] },
    { name: "Tapered Heatsink", type: "MAGAZINE", rarity: "DELUXE", price: 180, description: "Increases charge speed and reduces heat buildup.", compatibleWeapons: ["V00 Zeus RG", "Ares RG"], statModifiers: [{ stat: "chargeTime", direction: "up", label: "Charge Speed" }, { stat: "heatCapacity", direction: "up", label: "Heat Management" }] },
    { name: "Cloudfeather Chamber", type: "MAGAZINE", rarity: "ENHANCED", price: 0, description: "Slightly reduces weapon weight and increases movement speed.", compatibleWeapons: ["V75 Scar", "V22 Volt Thrower", "V11 Punch", "V66 Lookout"], statModifiers: [{ stat: "weight", direction: "up", label: "Weight" }, { stat: "movementSpeed", direction: "up", label: "Movement Speed" }] },
    { name: "Null-Grav Chamber", type: "MAGAZINE", rarity: "DELUXE", price: 207, description: "Increases movement speed and reduces weapon weight.", compatibleWeapons: ["V75 Scar", "V22 Volt Thrower", "V11 Punch", "V66 Lookout"], statModifiers: [{ stat: "movementSpeed", direction: "up", label: "Movement Speed" }, { stat: "weight", direction: "up", label: "Weight" }] },

    // --- OPTIC (11) ---
    { name: "Lever Overhaul Interface", type: "OPTIC", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Repeater HPR. Increases reload speed and rounds reloaded at a time. Shots on target increase fire rate. This degrades when a shot misses.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/5/56/Lever_Overhaul_Interface.png", compatibleWeapons: ["Repeater HPR"], statModifiers: [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "rateOfFire", direction: "up", label: "Rate of Fire" }] },
    { name: "Pistol Scope", type: "OPTIC", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for Magnum MC. Greatly increases ADS speed. Activates a specialized high zoom optic. Precision hits restore a small amount of shields.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/9/96/Pistol_Scope.png", compatibleWeapons: ["Magnum MC"], statModifiers: [{ stat: "adsSpeed", direction: "up", label: "ADS Speed" }, { stat: "zoom", direction: "up", label: "Zoom" }] },
    { name: "Vital Intel", type: "OPTIC", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Stryder M1T. Greatly increases handling and ADS speed. Enables Proximity Sensor on radar. When hostiles are nearby, this weapon has increased handling and accuracy.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/a/a4/Vital_Intel.png", compatibleWeapons: ["Stryder M1T"], statModifiers: [{ stat: "handling", direction: "up", label: "Handling" }, { stat: "adsSpeed", direction: "up", label: "ADS Speed" }, { stat: "accuracy", direction: "up", label: "Accuracy" }] },
    { name: "Far Reach Optic", type: "OPTIC", rarity: "ENHANCED", price: 69, description: "Slightly increases zoom and range. Rangefinder uses laser pulses to measure distance to the target.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/7/75/Far_Reach_Optic.png", compatibleWeapons: ["Overrun AR", "Impact HAR", "V75 Scar", "BRRT SMG", "Copperhead RF", "Bully SMG"], statModifiers: [{ stat: "range", direction: "up", label: "Range" }, { stat: "zoom", direction: "up", label: "Zoom" }] },
    { name: "Thermal Optic", type: "OPTIC", rarity: "DELUXE", price: 207, description: "Increase zoom and ADS accuracy. This sight highlights hostile heat signatures.", compatibleWeapons: ["Stryder M1T", "Hardline PR", "Repeater HPR", "V66 Lookout", "B33 Volley Rifle", "Twin Tap HBR"], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }] },
    { name: "Midsight Optic", type: "OPTIC", rarity: "ENHANCED", price: 60, description: "Slightly increases zoom.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR", "V75 Scar", "BRRT SMG", "Bully SMG", "Copperhead RF"], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }] },
    { name: "Shortwave Scout Optic", type: "OPTIC", rarity: "DELUXE", price: 69, description: "Increases zoom. Enables motion tracker on radar.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR", "V75 Scar", "BRRT SMG", "Bully SMG", "Copperhead RF"], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }] },
    { name: "Twinscope Optic", type: "OPTIC", rarity: "ENHANCED", price: 69, description: "Slightly increases zoom. Toggle between two zoom levels.", compatibleWeapons: ["Overrun AR", "M77 Assault Rifle", "Impact HAR", "V75 Scar", "BRRT SMG", "Bully SMG", "Copperhead RF"], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }] },
    { name: "Oracle Lens", type: "OPTIC", rarity: "SUPERIOR", price: 459, description: "Greatly increases ADS speed, accuracy while moving, and ADS accuracy. +Zoom, +ADS Speed, +Moving Accuracy, +ADS Spread.", compatibleWeapons: ["CE Tactical Sidearm", "Magnum MC", "V11 Punch"], statModifiers: [{ stat: "adsSpeed", direction: "up", label: "ADS Speed" }, { stat: "movingInaccuracy", direction: "up", label: "Moving Accuracy" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "zoom", direction: "up", label: "Zoom" }] },
    { name: "Charge-Coupled Optic", type: "OPTIC", rarity: "PRESTIGE", price: 0, description: "A custom-made mod for the V99 Channel Rifle. Increases charge speed. While scoped, charge damage ramps up faster and this weapon has increased aim assist.", compatibleWeapons: ["V99 Channel Rifle"], statModifiers: [{ stat: "chargeTime", direction: "up", label: "Charge Speed" }, { stat: "aimAssist", direction: "up", label: "Aim Assist" }] },
    { name: "Overcharge Lens", type: "OPTIC", rarity: "PRESTIGE", price: 60, description: "A custom-made mod for the V22 Volt Thrower. Increases lock-on range and tracking strength. Lock-on now chains to nearby targets.", compatibleWeapons: ["V22 Volt Thrower"], statModifiers: [{ stat: "range", direction: "up", label: "Lock-on Range" }, { stat: "aimAssist", direction: "up", label: "Tracking" }] },

    // --- SHIELD (4) ---
    { name: "Circuit Shield", type: "SHIELD", rarity: "PRESTIGE", price: 1620, description: "Decreases Recoil by 10%. Damage absorbed by this shield refunds ammo back to the magazine.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/4/49/Circuit_Shield.png", compatibleWeapons: ["Retaliator LMG"], statModifiers: [{ stat: "recoil", direction: "up", label: "Recoil" }] },
    { name: "Control Shield", type: "SHIELD", rarity: "SUPERIOR", price: 621, description: "Greatly increases stability.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/1/14/Control_Shield.png", compatibleWeapons: ["Conquest LMG", "Retaliator LMG", "Demolition HMG"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }] },
    { name: "Balanced Shield", type: "SHIELD", rarity: "DELUXE", price: 207, description: "Increases ready speed and movement speed with this weapon.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/e/ec/Balanced_Shield.png", compatibleWeapons: ["Conquest LMG", "Retaliator LMG", "Demolition HMG"], statModifiers: [{ stat: "equipSpeed", direction: "up", label: "Ready Speed" }, { stat: "movementSpeed", direction: "up", label: "Movement Speed" }] },
    { name: "Duelist Shield", type: "SHIELD", rarity: "ENHANCED", price: 69, description: "Slightly increases accuracy while moving and ADS speed.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/7/71/Duelist_Shield.png", compatibleWeapons: ["Conquest LMG", "Retaliator LMG", "Demolition HMG"], statModifiers: [{ stat: "movingInaccuracy", direction: "up", label: "Moving Accuracy" }, { stat: "adsSpeed", direction: "up", label: "ADS Speed" }] },

    // --- GENERATOR (2) ---
    { name: "Overclocked Generator", type: "GENERATOR", rarity: "PRESTIGE", price: 0, description: "A custom-made mod for the V00 Zeus RG. Greatly increases charge speed and damage. Overcharging the weapon fires a devastating blast.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/4/4e/Overclocked_Generator.png", compatibleWeapons: ["V00 Zeus RG"], statModifiers: [{ stat: "chargeTime", direction: "up", label: "Charge Speed" }, { stat: "damage", direction: "up", label: "Damage" }] },
    { name: "Stabilizing Generator", type: "GENERATOR", rarity: "SUPERIOR", description: "Greatly increases stability while charging.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/0/05/Stablizing_Generator.png", compatibleWeapons: ["Ares RG", "V00 Zeus RG"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }] },

    // --- CHIP (9: 8 universal + 1 non-universal) ---
    { name: "See ya", type: "CHIP", rarity: "SUPERIOR", price: 621, description: "Reloading this weapon when the magazine is empty causes you to become briefly invisible.", isUniversal: true, compatibleWeapons: [] },
    { name: "Bounty", type: "CHIP", rarity: "DELUXE", price: 207, description: "Eliminating UESC pays you a considerable amount of credits.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/f/ff/Torch_Bug.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Torch Bug", type: "CHIP", rarity: "DELUXE", price: 0, description: "Eliminating a hostile causes them to explode.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/f/ff/Torch_Bug.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Bounty Hunter", type: "CHIP", rarity: "ENHANCED", price: 207, description: "Eliminating UESC pays you a small amount of credits.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Swarm Directive", type: "CHIP", rarity: "DELUXE", price: 0, description: "Precision eliminations with this weapon spawn a few flechette seekers that heal you when damaging hostiles.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/f/ff/Torch_Bug.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Last Resort", type: "CHIP", rarity: "ENHANCED", price: 69, description: "While you are Overheated, non-precision damage is increased by a moderate amount.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Eyes On Fire", type: "CHIP", rarity: "ENHANCED", price: 0, description: "Damaging hostiles briefly highlights them through walls.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/9/94/Eyes_On_Fire.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Endless Runner", type: "CHIP", rarity: "ENHANCED", price: 0, description: "Eliminations with this weapon grant a brief boost to sprint speed.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/d/df/Endless_Runner.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Veilshot Chip", type: "CHIP", rarity: "ENHANCED", price: 60, description: "Kills with this weapon briefly cloak you.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", compatibleWeapons: ["Conquest LMG"] },
    { name: "Background Process", type: "CHIP", rarity: "ENHANCED", price: 69, description: "When this weapon is stowed, it automatically reloads after a significant period of time.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Cloudborn", type: "CHIP", rarity: "ENHANCED", price: 0, description: "While airborne, this weapon has increased accuracy and stability.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [], statModifiers: [{ stat: "accuracy", direction: "up", label: "Accuracy" }, { stat: "stability", direction: "up", label: "Stability" }] },
    { name: "Heatsink", type: "CHIP", rarity: "ENHANCED", price: 60, description: "Increases heat capacity, allowing sustained fire for longer.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [], statModifiers: [{ stat: "heatCapacity", direction: "up", label: "Heat Capacity" }] },
    { name: "Insomniac", type: "CHIP", rarity: "ENHANCED", price: 0, description: "Sprint speed is slightly increased.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [], statModifiers: [{ stat: "movementSpeed", direction: "up", label: "Sprint Speed" }] },
    { name: "Insurrection", type: "CHIP", rarity: "DELUXE", price: 0, description: "Damaging hostiles with this weapon increases your damage resistance briefly.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/f/ff/Torch_Bug.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Keen Scout Chip", type: "CHIP", rarity: "ENHANCED", price: 60, description: "Increases radar range.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Motionsense Chip", type: "CHIP", rarity: "ENHANCED", price: 60, description: "Briefly highlights hostiles on your radar after taking damage.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Stack Overflow", type: "CHIP", rarity: "DELUXE", price: 23, description: "Rapidly defeating hostiles grants a stacking damage bonus.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/f/ff/Torch_Bug.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Flash Draw Chip", type: "CHIP", rarity: "SUPERIOR", price: 540, description: "Greatly increases ready speed and weapon swap speed.", isUniversal: true, compatibleWeapons: [], statModifiers: [{ stat: "equipSpeed", direction: "up", label: "Ready Speed" }, { stat: "swapSpeed", direction: "up", label: "Swap Speed" }] },
    { name: "Ornithologist", type: "CHIP", rarity: "SUPERIOR", price: 621, description: "While airborne, this weapon has greatly increased accuracy, stability, and handling.", isUniversal: true, compatibleWeapons: [], statModifiers: [{ stat: "accuracy", direction: "up", label: "Accuracy" }, { stat: "stability", direction: "up", label: "Stability" }, { stat: "handling", direction: "up", label: "Handling" }] },
    { name: "Alternating Current", type: "CHIP", rarity: "ENHANCED", price: 69, description: "Restore a moderate amount of health or shields when damaging a target affected by EMP.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },

    // --- NEW MODS (from wzstats.gg, March 2026) ---

    // --- BARREL (new) ---
    { name: "Accu-Point Barrel", type: "BARREL", rarity: "DELUXE", price: 180, description: "Increases ADS accuracy and aim assist.", compatibleWeapons: [], statModifiers: [{ stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "aimAssist", direction: "up", label: "Aim Assist" }] },
    { name: "Outland Suppressor", type: "BARREL", rarity: "PRESTIGE", price: 1620, description: "A unique mod for the Outland. Increases stability and range. Shots fired from the weapon are suppressed.", compatibleWeapons: ["Outland"], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }, { stat: "range", direction: "up", label: "Range" }] },

    // --- GRIP (new) ---
    { name: "Sturdy Brace Grip", type: "GRIP", rarity: "ENHANCED", price: 0, description: "Increases stability.", compatibleWeapons: [], statModifiers: [{ stat: "stability", direction: "up", label: "Stability" }] },

    // --- MAGAZINE (new) ---
    { name: "Infinity Belt", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Conquest LMG. Increases reload speed and magazine capacity. Eliminating hostiles reloads a portion of the belt.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/6/62/Infinity_Belt.png", compatibleWeapons: ["Conquest LMG"], statModifiers: [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Adaptive Mag", type: "MAGAZINE", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Overrun AR. Increases reload speed and magazine size.", compatibleWeapons: ["Overrun AR"], statModifiers: [{ stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Balanced Payload", type: "MAGAZINE", rarity: "DELUXE", price: 207, description: "Increases magazine size, reload speed, and movement speed with this weapon.", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "movementSpeed", direction: "up", label: "Movement Speed" }] },
    { name: "BFM", type: "MAGAZINE", rarity: "DELUXE", price: 153, description: "Greatly increases magazine size.", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Extra Mag III", type: "MAGAZINE", rarity: "SUPERIOR", price: 702, description: "Greatly increases magazine size and reload speed.", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }] },
    { name: "Feather Mag", type: "MAGAZINE", rarity: "SUPERIOR", price: 621, description: "Greatly increases magazine size and reload speed.", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }] },
    { name: "Mega Drive", type: "MAGAZINE", rarity: "SUPERIOR", price: 702, description: "Massively increases magazine size.", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }] },
    { name: "Stabilizing Mag", type: "MAGAZINE", rarity: "SUPERIOR", price: 621, description: "Greatly increases magazine size and stability.", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "stability", direction: "up", label: "Stability" }] },
    // Belt-type mods mapped to MAGAZINE (no BELT enum in schema)
    { name: "Balanced Belt", type: "MAGAZINE", rarity: "SUPERIOR", price: 621, description: "Greatly increases magazine, range, and reload speed. (Belt slot for LMGs)", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "range", direction: "up", label: "Range" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }] },
    { name: "Turbo Belt", type: "MAGAZINE", rarity: "ENHANCED", price: 0, description: "Slightly increases magazine size, reload speed, and movement speed with this weapon. (Belt slot for LMGs)", compatibleWeapons: [], statModifiers: [{ stat: "magazineSize", direction: "up", label: "Magazine Size" }, { stat: "reloadSpeed", direction: "up", label: "Reload Speed" }, { stat: "movementSpeed", direction: "up", label: "Movement Speed" }] },

    // --- OPTIC (new) ---
    { name: "Accu-Sight Lens", type: "OPTIC", rarity: "SUPERIOR", price: 702, description: "Increases zoom, range, and ADS accuracy. Decreases ADS speed.", compatibleWeapons: [], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "range", direction: "up", label: "Range" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "adsSpeed", direction: "down", label: "ADS Speed" }] },
    { name: "Cold Vigilance Scope", type: "OPTIC", rarity: "DELUXE", price: 207, description: "Increases zoom, ADS speed, and ADS accuracy.", compatibleWeapons: [], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "adsSpeed", direction: "up", label: "ADS Speed" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }] },
    { name: "Neuro Optic Lens", type: "OPTIC", rarity: "ENHANCED", price: 69, description: "Slightly increases zoom and ADS speed.", compatibleWeapons: [], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "adsSpeed", direction: "up", label: "ADS Speed" }] },
    { name: "Optic 1.4x I", type: "OPTIC", rarity: "ENHANCED", price: 69, description: "Slightly increases zoom, ADS accuracy, and accuracy while moving.", compatibleWeapons: [], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "movingInaccuracy", direction: "up", label: "Moving Accuracy" }] },
    { name: "Q-Tap Regen Optic", type: "OPTIC", rarity: "PRESTIGE", price: 1620, description: "A custom-made mod for the Twin Tap HBR. Increases rounds per burst to four. While health is very low, hit all rounds in a burst to start health regeneration.", compatibleWeapons: ["Twin Tap HBR"], statModifiers: [{ stat: "rateOfFire", direction: "up", label: "Burst Count" }] },
    { name: "Rangefinder Lens", type: "OPTIC", rarity: "DELUXE", price: 153, description: "Increases zoom and ADS accuracy.", compatibleWeapons: [], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }] },
    { name: "Rangefinder Optic", type: "OPTIC", rarity: "DELUXE", price: 207, description: "Increases zoom, ADS accuracy, and accuracy while moving.", compatibleWeapons: [], statModifiers: [{ stat: "zoom", direction: "up", label: "Zoom" }, { stat: "adsSpread", direction: "up", label: "ADS Accuracy" }, { stat: "movingInaccuracy", direction: "up", label: "Moving Accuracy" }] },

    // --- GENERATOR (new) ---
    { name: "Null-Grav Generator", type: "GENERATOR", rarity: "ENHANCED", price: 69, description: "Slightly increases aim assist and charge time.", compatibleWeapons: [], statModifiers: [{ stat: "aimAssist", direction: "up", label: "Aim Assist" }, { stat: "chargeTime", direction: "up", label: "Charge Speed" }] },
    { name: "Tuned Generator", type: "GENERATOR", rarity: "SUPERIOR", price: 621, description: "Greatly increases ready speed and movement speed with this weapon.", compatibleWeapons: [], statModifiers: [{ stat: "equipSpeed", direction: "up", label: "Ready Speed" }, { stat: "movementSpeed", direction: "up", label: "Movement Speed" }] },
    { name: "Turbo Generator", type: "GENERATOR", rarity: "ENHANCED", price: 0, description: "Slightly increases ADS speed and charge time.", compatibleWeapons: [], statModifiers: [{ stat: "adsSpeed", direction: "up", label: "ADS Speed" }, { stat: "chargeTime", direction: "up", label: "Charge Speed" }] },

    // --- CHIP (new) ---
    { name: "Afterburner", type: "CHIP", rarity: "SUPERIOR", price: 540, description: "Sliding with this weapon reloads a portion of your magazine and increases stability and accuracy by a massive amount. Ballistic weapons reload from reserves. Volt weapons reload a smaller portion.", isUniversal: true, compatibleWeapons: [] },
    { name: "Battle Runner", type: "CHIP", rarity: "ENHANCED", price: 23, description: "Eliminations with this weapon grant a brief boost to sprint speed.", imageUrl: "https://static.wikia.nocookie.net/marathonthegame/images/8/88/Last_Resort.png", isUniversal: true, compatibleWeapons: [] },
    { name: "Five Finger Discount", type: "CHIP", rarity: "SUPERIOR", price: 621, description: "Eliminating UESC or downing Runners with a melee or knife attack partially reloads this weapon by a massive amount.", isUniversal: true, compatibleWeapons: [] },
    { name: "Rocket Start", type: "CHIP", rarity: "SUPERIOR", price: 621, description: "Eliminating a hostile shortly after sprinting grants you the effects of Cardio Kick for a long duration.", isUniversal: true, compatibleWeapons: [] },
  ];

  console.log(`\nSeeding ${mods.length} mods...`);

  // Build weapon name → id lookup
  const allWeapons = await db.weapon.findMany({ select: { id: true, name: true } });
  const weaponMap = new Map(allWeapons.map((w) => [w.name, w.id]));

  for (const mod of mods) {
    const slug = slugify(mod.name);
    const data = {
      slug,
      type: mod.type,
      rarity: mod.rarity,
      description: mod.description ?? null,
      price: mod.price ?? null,
      imageUrl: mod.imageUrl ?? null,
      isUniversal: mod.isUniversal ?? false,
      statModifiers: mod.statModifiers ?? Prisma.JsonNull,
    };
    const upserted = await db.mod.upsert({
      where: { name: mod.name },
      update: data,
      create: { name: mod.name, ...data },
    });

    // Create junction rows for non-universal mods (with optional weapon-specific stats)
    for (const weaponName of mod.compatibleWeapons) {
      const weaponId = weaponMap.get(weaponName);
      if (!weaponId) {
        console.warn(`  ⚠ Weapon not found: "${weaponName}" (mod: ${mod.name})`);
        continue;
      }
      const weaponSpecificStats = mod.weaponStats?.[weaponName] ?? null;
      await db.weaponMod.upsert({
        where: { weaponId_modId: { weaponId, modId: upserted.id } },
        update: { statModifiers: weaponSpecificStats ?? Prisma.DbNull },
        create: {
          weaponId,
          modId: upserted.id,
          statModifiers: weaponSpecificStats ?? Prisma.DbNull,
        },
      });
    }

    console.log(`  ✓ ${mod.name} (${mod.compatibleWeapons.length} weapons)`);
  }

  console.log(`\nSeeded ${mods.length} mods.`);

  // === TTK DATA ===
  const ttkData: {
    csvName: string;
    weaponName: string;
    damage: number;
    rpm: number;
    headshotMultiplier: number;
    headshotDamage: number;
    range: number;
    dps: number;
    shotsToKill: string;
    ttkWhite: number;
    ttkGreen: number;
    ttkBlue: number;
    ttkPurple: number;
    ttkHeadWhite: number;
    ttkHeadGreen: number;
    ttkHeadBlue: number;
    ttkHeadPurple: number;
  }[] = [
    { csvName: "V75 SCAR", weaponName: "V75 Scar", damage: 14.5, rpm: 385, headshotMultiplier: 1.4, headshotDamage: 20.3, range: 46, dps: 93.04, shotsToKill: "10B | 7C", ttkWhite: 1.403, ttkGreen: 1.714, ttkBlue: 1.87, ttkPurple: 2.026, ttkHeadWhite: 0.935, ttkHeadGreen: 1.091, ttkHeadBlue: 1.247, ttkHeadPurple: 1.403 },
    { csvName: "IMPACT H-AR", weaponName: "Impact HAR", damage: 18, rpm: 400, headshotMultiplier: 1.6, headshotDamage: 28.8, range: 60, dps: 120, shotsToKill: "8B | 5C", ttkWhite: 1.05, ttkGreen: 1.2, ttkBlue: 1.35, ttkPurple: 1.65, ttkHeadWhite: 0.6, ttkHeadGreen: 0.75, ttkHeadBlue: 0.9, ttkHeadPurple: 0.9 },
    { csvName: "M77 ASSAULT RIFLE", weaponName: "M77 Assault Rifle", damage: 16, rpm: 450, headshotMultiplier: 1.5, headshotDamage: 24, range: 46, dps: 120, shotsToKill: "9B | 6C", ttkWhite: 1.067, ttkGreen: 1.2, ttkBlue: 1.467, ttkPurple: 1.6, ttkHeadWhite: 0.667, ttkHeadGreen: 0.8, ttkHeadBlue: 0.933, ttkHeadPurple: 1.067 },
    { csvName: "OVERRUN AR", weaponName: "Overrun AR", damage: 10.5, rpm: 720, headshotMultiplier: 1.4, headshotDamage: 14.7, range: 27, dps: 126, shotsToKill: "14B | 10C", ttkWhite: 1.083, ttkGreen: 1.25, ttkBlue: 1.417, ttkPurple: 1.583, ttkHeadWhite: 0.75, ttkHeadGreen: 0.833, ttkHeadBlue: 1, ttkHeadPurple: 1.083 },
    { csvName: "REPEATER HPR", weaponName: "Repeater HPR", damage: 38, rpm: 86, headshotMultiplier: 2.1, headshotDamage: 79.8, range: 37, dps: 54.47, shotsToKill: "4B | 2C", ttkWhite: 2.093, ttkGreen: 2.791, ttkBlue: 2.791, ttkPurple: 3.488, ttkHeadWhite: 0.698, ttkHeadGreen: 1.395, ttkHeadBlue: 1.395, ttkHeadPurple: 1.395 },
    { csvName: "V66 LOOKOUT", weaponName: "V66 Lookout", damage: 26, rpm: 180, headshotMultiplier: 1.8, headshotDamage: 46.8, range: 88, dps: 78, shotsToKill: "6B | 3C", ttkWhite: 1.667, ttkGreen: 2, ttkBlue: 2, ttkPurple: 2.333, ttkHeadWhite: 0.667, ttkHeadGreen: 1, ttkHeadBlue: 1, ttkHeadPurple: 1.333 },
    { csvName: "STRYDER M1T", weaponName: "Stryder M1T", damage: 31, rpm: 200, headshotMultiplier: 1.5, headshotDamage: 46.5, range: 84, dps: 103.33, shotsToKill: "5B | 4C", ttkWhite: 1.2, ttkGreen: 1.5, ttkBlue: 1.5, ttkPurple: 1.8, ttkHeadWhite: 0.9, ttkHeadGreen: 0.9, ttkHeadBlue: 0.9, ttkHeadPurple: 1.2 },
    { csvName: "HARDLINE PR", weaponName: "Hardline PR", damage: 23, rpm: 275, headshotMultiplier: 1.6, headshotDamage: 36.8, range: 89, dps: 105.42, shotsToKill: "7B | 4C", ttkWhite: 1.309, ttkGreen: 1.309, ttkBlue: 1.527, ttkPurple: 1.745, ttkHeadWhite: 0.655, ttkHeadGreen: 0.873, ttkHeadBlue: 0.873, ttkHeadPurple: 1.091 },
    { csvName: "TWIN TAP HBR", weaponName: "Twin Tap HBR", damage: 17, rpm: 420, headshotMultiplier: 1.7, headshotDamage: 28.9, range: 48, dps: 119, shotsToKill: "9B | 5C", ttkWhite: 1.143, ttkGreen: 1.286, ttkBlue: 1.429, ttkPurple: 1.571, ttkHeadWhite: 0.571, ttkHeadGreen: 0.714, ttkHeadBlue: 0.857, ttkHeadPurple: 0.857 },
    { csvName: "BR33 VOLLEY RIFLE", weaponName: "B33 Volley Rifle", damage: 14.8, rpm: 481, headshotMultiplier: 1.4, headshotDamage: 20.72, range: 49, dps: 118.65, shotsToKill: "10B | 7C", ttkWhite: 1.123, ttkGreen: 1.247, ttkBlue: 1.497, ttkPurple: 1.622, ttkHeadWhite: 0.748, ttkHeadGreen: 0.873, ttkHeadBlue: 0.998, ttkHeadPurple: 1.123 },
    { csvName: "V22 VOLT THROWER", weaponName: "V22 Volt Thrower", damage: 18, rpm: 507, headshotMultiplier: 1, headshotDamage: 18, range: 21, dps: 152.1, shotsToKill: "8B | 8C", ttkWhite: 0.828, ttkGreen: 0.947, ttkBlue: 1.065, ttkPurple: 1.302, ttkHeadWhite: 0.828, ttkHeadGreen: 0.947, ttkHeadBlue: 1.065, ttkHeadPurple: 1.302 },
    { csvName: "BULLY SMG", weaponName: "Bully SMG", damage: 15, rpm: 540, headshotMultiplier: 1.5, headshotDamage: 22.5, range: 18, dps: 135, shotsToKill: "10B | 7C", ttkWhite: 1, ttkGreen: 1.111, ttkBlue: 1.222, ttkPurple: 1.444, ttkHeadWhite: 0.667, ttkHeadGreen: 0.778, ttkHeadBlue: 0.778, ttkHeadPurple: 0.889 },
    { csvName: "COPPERHEAD RF", weaponName: "Copperhead RF", damage: 12, rpm: 720, headshotMultiplier: 1.4, headshotDamage: 16.8, range: 15, dps: 144, shotsToKill: "12B | 9C", ttkWhite: 0.917, ttkGreen: 1.083, ttkBlue: 1.167, ttkPurple: 1.333, ttkHeadWhite: 0.667, ttkHeadGreen: 0.75, ttkHeadBlue: 0.833, ttkHeadPurple: 0.917 },
    { csvName: "BRRT SMG", weaponName: "BRRT SMG", damage: 11, rpm: 556, headshotMultiplier: 1.4, headshotDamage: 15.4, range: 27, dps: 101.93, shotsToKill: "13B | 10C", ttkWhite: 1.295, ttkGreen: 1.511, ttkBlue: 1.727, ttkPurple: 1.942, ttkHeadWhite: 0.971, ttkHeadGreen: 1.079, ttkHeadBlue: 1.187, ttkHeadPurple: 1.295 },
    { csvName: "MAGNUM MC", weaponName: "Magnum MC", damage: 33, rpm: 150, headshotMultiplier: 2, headshotDamage: 66, range: 21, dps: 82.5, shotsToKill: "5B | 3C", ttkWhite: 1.6, ttkGreen: 1.6, ttkBlue: 2, ttkPurple: 2.4, ttkHeadWhite: 0.8, ttkHeadGreen: 0.8, ttkHeadBlue: 0.8, ttkHeadPurple: 1.2 },
    { csvName: "CE TACTICAL SIDEARM", weaponName: "CE Tactical Sidearm", damage: 20, rpm: 300, headshotMultiplier: 1.8, headshotDamage: 36, range: 26, dps: 100, shotsToKill: "7B | 4C", ttkWhite: 1.2, ttkGreen: 1.4, ttkBlue: 1.6, ttkPurple: 1.8, ttkHeadWhite: 0.6, ttkHeadGreen: 0.8, ttkHeadBlue: 0.8, ttkHeadPurple: 1 },
    { csvName: "V11 PUNCH", weaponName: "V11 Punch", damage: 25, rpm: 257, headshotMultiplier: 1.5, headshotDamage: 37.5, range: 21, dps: 107.08, shotsToKill: "6B | 4C", ttkWhite: 1.167, ttkGreen: 1.401, ttkBlue: 1.634, ttkPurple: 1.634, ttkHeadWhite: 0.7, ttkHeadGreen: 0.934, ttkHeadBlue: 0.934, ttkHeadPurple: 1.167 },
    { csvName: "OUTLAND", weaponName: "Outland", damage: 120, rpm: 43, headshotMultiplier: 1.4, headshotDamage: 168, range: 200, dps: 86, shotsToKill: "2B | 1C", ttkWhite: 1.395, ttkGreen: 1.395, ttkBlue: 1.395, ttkPurple: 1.395, ttkHeadWhite: 0, ttkHeadGreen: 0, ttkHeadBlue: 1.395, ttkHeadPurple: 1.395 },
    { csvName: "LONGSHOT", weaponName: "Longshot", damage: 69.5, rpm: 120, headshotMultiplier: 2.15, headshotDamage: 149.425, range: 175, dps: 139, shotsToKill: "3B | 1C", ttkWhite: 1, ttkGreen: 1, ttkBlue: 1, ttkPurple: 1, ttkHeadWhite: 0, ttkHeadGreen: 0.5, ttkHeadBlue: 0.5, ttkHeadPurple: 0.5 },
    { csvName: "V 99 CHANNEL (3X CHARGE)", weaponName: "V99 Channel Rifle", damage: 60, rpm: 75, headshotMultiplier: 2, headshotDamage: 120, range: 175, dps: 75, shotsToKill: "3B | 2C", ttkWhite: 1.6, ttkGreen: 1.6, ttkBlue: 1.6, ttkPurple: 2.4, ttkHeadWhite: 0.8, ttkHeadGreen: 0.8, ttkHeadBlue: 0.8, ttkHeadPurple: 0.8 },
    { csvName: "ARES RG", weaponName: "Ares RG", damage: 123, rpm: 60, headshotMultiplier: 1.3, headshotDamage: 159.9, range: 75, dps: 123, shotsToKill: "2B | 1C", ttkWhite: 1, ttkGreen: 1, ttkBlue: 1, ttkPurple: 1, ttkHeadWhite: 0, ttkHeadGreen: 1, ttkHeadBlue: 1, ttkHeadPurple: 1 },
    { csvName: "V00 ZEUS RG", weaponName: "V00 Zeus RG", damage: 120, rpm: 90, headshotMultiplier: 1.6, headshotDamage: 192, range: 155, dps: 180, shotsToKill: "2B | 1C", ttkWhite: 0.667, ttkGreen: 0.667, ttkBlue: 0.667, ttkPurple: 0.667, ttkHeadWhite: 0, ttkHeadGreen: 0, ttkHeadBlue: 0, ttkHeadPurple: 0.667 },
    { csvName: "DEMOLITION HMG", weaponName: "Demolition HMG", damage: 30.5, rpm: 225, headshotMultiplier: 1.5, headshotDamage: 45.75, range: 65, dps: 114.38, shotsToKill: "5B | 4C", ttkWhite: 1.067, ttkGreen: 1.333, ttkBlue: 1.333, ttkPurple: 1.6, ttkHeadWhite: 0.8, ttkHeadGreen: 0.8, ttkHeadBlue: 0.8, ttkHeadPurple: 1.067 },
    { csvName: "RETALIATOR LMG", weaponName: "Retaliator LMG", damage: 11.8, rpm: 600, headshotMultiplier: 1.4, headshotDamage: 16.52, range: 51, dps: 118, shotsToKill: "12B | 9C", ttkWhite: 1.1, ttkGreen: 1.3, ttkBlue: 1.5, ttkPurple: 1.6, ttkHeadWhite: 0.8, ttkHeadGreen: 0.9, ttkHeadBlue: 1, ttkHeadPurple: 1.2 },
    { csvName: "CONQUEST LMG", weaponName: "Conquest LMG", damage: 16, rpm: 540, headshotMultiplier: 1.4, headshotDamage: 22.4, range: 60, dps: 144, shotsToKill: "9B | 7C", ttkWhite: 0.889, ttkGreen: 1, ttkBlue: 1.222, ttkPurple: 1.333, ttkHeadWhite: 0.667, ttkHeadGreen: 0.778, ttkHeadBlue: 0.889, ttkHeadPurple: 0.889 },
    { csvName: "MISRIAH 2442 (12 pellet)", weaponName: "Misriah 2442", damage: 140.1, rpm: 58, headshotMultiplier: 1.2, headshotDamage: 168.12, range: 9, dps: 135.43, shotsToKill: "1B | 1C", ttkWhite: 0, ttkGreen: 1.034, ttkBlue: 1.034, ttkPurple: 1.034, ttkHeadWhite: 0, ttkHeadGreen: 0, ttkHeadBlue: 1.034, ttkHeadPurple: 1.034 },
    { csvName: "WSTR COMBAT SHOTGUN (10 pellet)", weaponName: "WSTR Combat Shotgun", damage: 150, rpm: 194, headshotMultiplier: 1.15, headshotDamage: 172.5, range: 4, dps: 485, shotsToKill: "1B | 1C", ttkWhite: 0, ttkGreen: 0.309, ttkBlue: 0.309, ttkPurple: 0.309, ttkHeadWhite: 0, ttkHeadGreen: 0, ttkHeadBlue: 0.309, ttkHeadPurple: 0.309 },
    { csvName: "V85 CIRCUIT BREAKER (CHARGE)", weaponName: "V85 Circuit Breaker", damage: 18.3, rpm: 85, headshotMultiplier: 1.2, headshotDamage: 21.96, range: 11, dps: 25.93, shotsToKill: "8B | 7C", ttkWhite: 4.941, ttkGreen: 5.647, ttkBlue: 6.353, ttkPurple: 7.059, ttkHeadWhite: 4.235, ttkHeadGreen: 4.941, ttkHeadBlue: 5.647, ttkHeadPurple: 6.353 },
  ];

  console.log(`\nSeeding ${ttkData.length} TTK records...`);

  for (const ttk of ttkData) {
    const weaponId = weaponMap.get(ttk.weaponName);
    if (!weaponId) {
      console.warn(`  ⚠ Weapon not found for TTK: "${ttk.weaponName}" (CSV: ${ttk.csvName})`);
      continue;
    }

    const { csvName: _, weaponName: __, ...data } = ttk;
    await db.weaponTTK.upsert({
      where: { weaponId },
      update: data,
      create: { weaponId, ...data },
    });

    console.log(`  ✓ ${ttk.weaponName}`);
  }

  console.log(`\nSeeded ${ttkData.length} TTK records.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
