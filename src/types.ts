export type PurchaseRules = {
    subtotal?: Rule
    totalItems?: number
    orderWeight?: Rule
};


export enum Severity {
    WARNING = 1,
    ERROR = 2,
}
enum Type {
    SUBTOTAL = 1,
    TOTAL_ITEMS = 2,
    ORDER_WEIGHT = 3
}

type Rule = {
    type: Type;
    active?: boolean;
    cartSeverity?: Severity
    checkoutSeverity?: Severity
    message?: string;
    minValue?: number
    maxValue?: number
}