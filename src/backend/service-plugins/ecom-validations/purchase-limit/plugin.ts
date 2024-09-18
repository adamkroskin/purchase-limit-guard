import {validations} from '@wix/ecom/service-plugins/context';
import {getDataFromCollection} from "../../../database";
import {PURCHASE_RULES_COLLECTION_ID} from "../../../consts";
import type {PurchaseRules} from "../../../../types";

validations.provideHandlers({
    getValidationViolations: async ({request, metadata}): Promise<validations.GetValidationViolationsResponse> => {
        const rules = await getPurchaseRules();
        const subtotal = calculateSubTotal(request?.validationInfo)
        const totalItems = calculateTotalItems(request.validationInfo)
        const totalWeight = calculateTotalOrderWeight(request.validationInfo)

        const validations = [
            {
                predicate: () => {
                    return (rules.subtotal?.active || false) && subtotal >= (rules.subtotal?.minValue || 0)
                },
                errorMessage: rules.subtotal?.message
            },
            {
                predicate: () => {
                    return (rules.subtotal?.active || false) && subtotal <= (rules.subtotal?.maxValue || Number.MAX_SAFE_INTEGER)
                },
                errorMessage: rules.subtotal?.message
            },
            {
                predicate: () => {
                    return (rules.subtotal?.active || false) && totalItems >= (rules.totalItems?.minValue || 0)
                },
                errorMessage: rules.totalItems?.message
            },
            {
                predicate: () => {
                    return (rules.subtotal?.active || false) && totalItems <= (rules.totalItems?.maxValue || Number.MAX_SAFE_INTEGER)
                },
                errorMessage: rules.totalItems?.message
            },
            {
                predicate: () => {
                    return (rules.subtotal?.active || false) && totalWeight >= (rules.orderWeight?.minValue || 0)
                },
                errorMessage: rules.orderWeight?.message
            },
            {
                predicate: () => {
                    return (rules.subtotal?.active || false) && totalWeight <= (rules.orderWeight?.maxValue || Number.MAX_SAFE_INTEGER)
                },
                errorMessage: rules.orderWeight?.message
            },
        ];

        const violations = validations
            .filter(({predicate}) => !predicate())
            .map(({errorMessage}) => createViolation(errorMessage));

        return {violations: violations}
    }
})

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
        subtotal: data?.subtotal || DEFAULT_RULE,
        totalItems: data?.totalItems||DEFAULT_RULE,
        orderWeight: data.orderWeight||DEFAULT_RULE,
    };
}

function createViolation(description: string): validations.Violation {
    let severity = validations.Severity.ERROR
    let target: validations.Target = {
        other: {
            name: validations.NameInOther.OTHER_DEFAULT
        }
    }

    return {severity, target, description};
}
