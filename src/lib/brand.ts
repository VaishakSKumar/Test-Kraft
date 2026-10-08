export const BRAND_NAMES = ["TestKraft", "QA Flow", "PlayScript"] as const;
export type BrandName = (typeof BRAND_NAMES)[number];

const configured = process.env.NEXT_PUBLIC_APP_NAME as BrandName | undefined;

/** App name, configurable with NEXT_PUBLIC_APP_NAME. Defaults to TestKraft. */
export const APP_NAME: BrandName = configured && BRAND_NAMES.includes(configured) ? configured : "TestKraft";
export const APP_TAGLINE = "QA Automation Path";
