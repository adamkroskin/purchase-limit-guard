import {validations} from '@wix/ecom/service-plugins/context';
import {getDataFromCollection} from "../../../database";
import {PURCHASE_RULES_COLLECTION_ID} from "../../../consts";
import {PurchaseRules, Rule, Severity} from "../../../../types";

validations.provideHandlers({
    getValidationViolations: async ({request, metadata}): Promise<validations.GetValidationViolationsResponse> => {
        const rules = await getPurchaseRules();
        const subtotal = calculateSubTotal(request?.validationInfo)
        const totalItems = calculateTotalItems(request.validationInfo)
        const totalWeight = calculateTotalOrderWeight(request.validationInfo)

        const validations = [
            {
                predicate: () => {
                    return (rules.subtotal?.active) && subtotal < (rules.subtotal?.minValue || 0)
                },
                severity: calculateSeverity(rules.subtotal, request.sourceInfo?.source),
                errorMessage: rules.subtotal?.message
            },
            {
                predicate: () => {
                    return (rules.subtotal?.active) && subtotal > (rules.subtotal?.maxValue || Number.MAX_SAFE_INTEGER)
                },
                severity: calculateSeverity(rules.subtotal, request.sourceInfo?.source),
                errorMessage: rules.subtotal?.message
            },
            {
                predicate: () => {
                    return (rules.totalItems?.active) && totalItems < (rules.totalItems?.minValue || 0)
                },
                severity: calculateSeverity(rules.totalItems, request.sourceInfo?.source),
                errorMessage: rules.totalItems?.message
            },
            {
                predicate: () => {
                    return (rules.totalItems?.active) && totalItems > (rules.totalItems?.maxValue || Number.MAX_SAFE_INTEGER)
                },
                severity: calculateSeverity(rules.totalItems, request.sourceInfo?.source),
                errorMessage: rules.totalItems?.message
            },
            {
                predicate: () => {
                    return (rules.orderWeight?.active) && totalWeight < (rules.orderWeight?.minValue || 0)
                },
                severity: calculateSeverity(rules.orderWeight, request.sourceInfo?.source),
                errorMessage: rules.orderWeight?.message
            },
            {
                predicate: () => {
                    return (rules.orderWeight?.active) && totalWeight > (rules.orderWeight?.maxValue || Number.MAX_SAFE_INTEGER)
                },
                severity: calculateSeverity(rules.orderWeight, request.sourceInfo?.source),
                errorMessage: rules.orderWeight?.message
            },
        ];

        const violations = validations
            .filter(({predicate}) => predicate())
            .map(({severity, errorMessage}) => createViolation(severity, errorMessage));

        return {violations: violations}
    }
})

function calculateSeverity(rule: Rule, soruce?: validations.Source) {
    if (soruce === validations.Source.CART) {
        return rule.cartSeverity === Severity.WARNING ? validations.Severity.WARNING : validations.Severity.ERROR
    }

    if (soruce === validations.Source.CHECKOUT) {
        return rule.checkoutSeverity === Severity.WARNING ? validations.Severity.WARNING : validations.Severity.ERROR
    }

    return validations.Severity.ERROR
}

function calculateSubTotal(validationInfo?: validations.ValidationInfo) {
    return parseInt(validationInfo?.priceSummary?.subtotal?.amount || "0");
}

function calculateTotalOrderWeight(validationInfo?: validations.ValidationInfo) {
    return validationInfo?.lineItems?.reduce((total, item) => {
        return total + ((item.physicalProperties?.weight || 0) * (item.quantity || 0));
    }, 0) || 0;
}

function calculateTotalItems(validationInfo?: validations.ValidationInfo) {
    return validationInfo?.lineItems?.reduce((total, item) => {
        return total + (item.quantity || 0);
    }, 0) || 0;
}

async function getPurchaseRules() {
    const collection = await getDataFromCollection({dataCollectionId: PURCHASE_RULES_COLLECTION_ID});
    const data = collection.items[0]?.data as PurchaseRules;

    return {
        subtotal: data?.subtotal,
        totalItems: data?.totalItems,
        orderWeight: data?.orderWeight,
    };
}

function createViolation(severity: validations.Severity, description?: string): validations.Violation {
    let target: validations.Target = {
        other: {
            name: validations.NameInOther.OTHER_DEFAULT
        }
    }

    return {severity, target, description};
}
