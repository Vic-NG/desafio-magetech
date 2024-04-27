export interface SimpleProduct {
    name: string
    description: string
    saleValue: number
    viewed?: boolean
    promotionalValue?: number;
    promotionStartDate?: Date;
    promotionEndDate?: Date;
}