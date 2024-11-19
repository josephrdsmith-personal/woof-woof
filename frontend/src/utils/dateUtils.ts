export const serializeDate = (date: Date): string => date.toISOString()

export const deserializeDate = (dateString: string): Date => new Date(dateString)

export interface WithDates {
  createdAt: Date
  updatedAt?: Date
}

export const deserializeDates = <T extends WithDates>(obj: Partial<T>): T => ({
  ...obj,
  createdAt: obj.createdAt ? deserializeDate(obj.createdAt as unknown as string) : new Date(),
  updatedAt: obj.updatedAt ? deserializeDate(obj.updatedAt as unknown as string) : undefined
} as T) 