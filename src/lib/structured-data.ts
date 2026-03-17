import type { Weapon } from "../../generated/prisma";

export function websiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Marathon Weapon Wiki",
    url: siteUrl,
    description: "Tactical weapon database for Marathon",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function weaponListJsonLd(
  siteUrl: string,
  weapons: Pick<Weapon, "name" | "slug">[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Marathon Weapons",
    numberOfItems: weapons.length,
    itemListElement: weapons.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: w.name,
      url: `${siteUrl}/weapons/${w.slug}`,
    })),
  };
}

export function weaponProductJsonLd(siteUrl: string, weapon: Weapon) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: weapon.name,
    description:
      weapon.description ?? `${weapon.name} stats and details for Marathon`,
    image: weapon.imageUrl
      ? `${siteUrl}${weapon.imageUrl}`
      : undefined,
    url: `${siteUrl}/weapons/${weapon.slug}`,
    category: weapon.type.replace(/_/g, " "),
    brand: {
      "@type": "Brand",
      name: "Marathon",
    },
  };
}

export function breadcrumbJsonLd(
  siteUrl: string,
  items: { name: string; url?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url ? `${siteUrl}${item.url}` : undefined,
    })),
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Marathon Weapon Wiki",
    url: siteUrl,
  };
}
