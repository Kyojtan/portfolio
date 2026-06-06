export interface PhotoSpread {
  id: string;
  title: { zh: string; zt: string; en: string };
  leftImage: string;
  /** Optional second page in the same location spread */
  rightImage?: string;
  tabColor: string;
  tabAccent: string;
}

/** Set false when real photos are wired in public/photography/ */
export const PHOTO_PLACEHOLDER_MODE = false;

/** Sentinel — OpenSpread renders black slots instead of loading images */
export const PHOTO_PLACEHOLDER_SRC = "";

/** One album page = one image (for MUJI single-page spreads). */
export interface PhotoPage {
  id: string;
  title: { zh: string; zt: string; en: string };
  image: string;
}

export function buildPhotoPages(spreads: PhotoSpread[]): PhotoPage[] {
  return spreads.flatMap((spread) => {
    const pages: PhotoPage[] = [
      { id: spread.id, title: spread.title, image: spread.leftImage },
    ];
    if (spread.rightImage) {
      pages.push({
        id: `${spread.id}-r`,
        title: spread.title,
        image: spread.rightImage,
      });
    }
    return pages;
  });
}

const SCOTLAND = {
  title: { zh: "高地，苏格兰", zt: "高地，蘇格蘭", en: "Highland, Scotland" },
  tabColor: "rgba(208, 204, 255, 0.72)",
  tabAccent: "#8b83e8",
} as const;

const PORTO = {
  title: { zh: "波尔图，葡萄牙", zt: "波爾圖，葡萄牙", en: "Porto, Portugal" },
  tabColor: "rgba(255, 212, 163, 0.78)",
  tabAccent: "#d4924a",
} as const;

const BARCELONA = {
  title: { zh: "巴塞罗那，西班牙", zt: "巴塞羅那，西班牙", en: "Barcelona, Spain" },
  tabColor: "rgba(196, 231, 255, 0.78)",
  tabAccent: "#5a9fd4",
} as const;

const BRUSSELS = {
  title: { zh: "布鲁塞尔，比利时", zt: "布魯塞爾，比利時", en: "Brussels, Belgium" },
  tabColor: "rgba(161, 154, 254, 0.72)",
  tabAccent: "#7a6fe8",
} as const;

const AUSTRALIA = {
  title: { zh: "澳大利亚", zt: "澳大利亞", en: "Australia" },
  tabColor: "rgba(184, 224, 210, 0.78)",
  tabAccent: "#5aab8f",
} as const;

const BANGKOK = {
  title: { zh: "曼谷，泰国", zt: "曼谷，泰國", en: "Bangkok, Thailand" },
  tabColor: "rgba(243, 158, 158, 0.72)",
  tabAccent: "#e07070",
} as const;

export const PHOTO_SPREADS: PhotoSpread[] = [
  {
    id: "scotland",
    ...SCOTLAND,
    leftImage: "/photography/scotland-1.png",
    rightImage: "/photography/scotland-2.png",
  },
  {
    id: "scotland-2",
    ...SCOTLAND,
    leftImage: "/photography/scotland-3.png",
    rightImage: "/photography/scotland-4.png",
  },
  {
    id: "porto",
    ...PORTO,
    leftImage: "/photography/porto-1.png",
    rightImage: "/photography/porto-2.png",
  },
  {
    id: "porto-2",
    ...PORTO,
    leftImage: "/photography/porto-3.png",
    rightImage: "/photography/porto-4.png",
  },
  {
    id: "porto-3",
    ...PORTO,
    leftImage: "/photography/porto-5.png",
    rightImage: "/photography/porto-6.png",
  },
  {
    id: "barcelona",
    ...BARCELONA,
    leftImage: "/photography/spain-1.png",
    rightImage: "/photography/spain-2.png",
  },
  {
    id: "barcelona-2",
    ...BARCELONA,
    leftImage: "/photography/spain-3.png",
    rightImage: "/photography/spain-4.png",
  },
  {
    id: "barcelona-3",
    ...BARCELONA,
    leftImage: "/photography/spain-5.png",
    rightImage: "/photography/spain-6.png",
  },
  {
    id: "brussels",
    ...BRUSSELS,
    leftImage: "/photography/brussels-1.png",
    rightImage: "/photography/brussels-2.png",
  },
  {
    id: "brussels-2",
    ...BRUSSELS,
    leftImage: "/photography/brussels-3.png",
    rightImage: "/photography/brussels-4.png",
  },
  {
    id: "australia",
    ...AUSTRALIA,
    leftImage: "/photography/australia-1.png",
    rightImage: "/photography/australia-2.png",
  },
  {
    id: "bangkok",
    ...BANGKOK,
    leftImage: "/photography/bangkok-1.png",
    rightImage: "/photography/bangkok-2.png",
  },
  {
    id: "bangkok-2",
    ...BANGKOK,
    leftImage: "/photography/bangkok-3.png",
    rightImage: "/photography/bangkok-4.png",
  },
];
