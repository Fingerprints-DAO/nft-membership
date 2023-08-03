export const pluralize = (quantity: number, plural: string, singular: string): string => `${quantity} ${quantity === 1 ? singular : plural}`
