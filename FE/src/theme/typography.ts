export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  weights: {
    regular: "400",
    medium: "600",
    bold: "700",
    heavy: "800",
  },
};

export type FontSize = keyof typeof typography.sizes;
