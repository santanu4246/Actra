/** Teal gradient top strip (welcome, auth chrome) */
export const SCREEN_GRADIENT_TOP = "#086376";

/** Stop locations shared by auth / welcome backgrounds */
export const SCREEN_GRADIENT_LOCATIONS = [0, 0.4, 1] as const;

export type ScreenGradientColors = readonly [string, string, string];

export function screenGradientColors(isLight: boolean): ScreenGradientColors {
  return isLight
    ? [SCREEN_GRADIENT_TOP, "#FFFFFF", "#FFFFFF"]
    : [SCREEN_GRADIENT_TOP, "#0A0A0A", "#0A0A0A"];
}

/** Lime brand (#7CE800); tinted fills use translucent stops */
export const GREEN_SOLID = "#7CE800";
export const GREEN_ALPHA = "#7CE8004D";
export const GREEN_ALPHA_SOFT = "#7CE80014";
export const GREEN_ALPHA_MEDIUM = "#7CE80033";
/** Darkened for readable small UI text on white / pastel */
export const GREEN_ON_LIGHT = "#5A9300";
export const GREEN_TINT_LIGHT = "#EFF9D9";
