export type PurchaseRules = {
    subtotal: Rule
    totalItems: Rule
    orderWeight: Rule
};


export enum Severity {
    WARNING = 1,
    ERROR = 2,
}

export type Rule = {
    active: boolean;
    cartSeverity?: Severity
    checkoutSeverity?: Severity
    message?: string;
    minValue?: number
    maxValue?: number
}