import {validations} from '@wix/ecom/service-plugins/context';
import {getDataFromCollection} from "../../../database";
import {PURCHASE_RULES_COLLECTION_ID} from "../../../consts";
import type {PurchaseRules} from "../../../../types";

validations.provideHandlers({
    getValidationViolations: async ({request, metadata}): Promise<validations.GetValidationViolationsResponse> => {
        const rules = await getPurchaseRules();
        const subtotal = parseInt(request?.validationInfo?.priceSummary?.subtotal?.amount || "0");
        const totalItems = request?.validationInfo?.lineItems?.length || 0
        const validations = [
            {
                predicate: () => { return subtotal >= rules.minSubtotal },
                errorMessage: `Your total purchase amount cannot be lower then ${rules.minSubtotal}`
            },
            {
                predicate: () => { return subtotal <= rules.maxSubtotal },
                errorMessage: `Your total purchase amount cannot be higher then ${rules.maxSubtotal}`
            },
            {
                predicate: () => { return totalItems >= rules.minTotalItems },
                errorMessage: `The total number of items cannot be lower then ${rules.minTotalItems}`
            },
            {
                predicate: () => { return totalItems <= rules.maxTotalItems },
                errorMessage: `The total number of items cannot be higher then ${rules.maxTotalItems}`
            },
        ];
        const violations = validations
            .filter(({ predicate }) => !predicate())
            .map(({ errorMessage }) => createViolation(errorMessage));

        return {violations: violations}
    }
})

async function getPurchaseRules() {
    const collection = await getDataFromCollection({dataCollectionId: PURCHASE_RULES_COLLECTION_ID});
    const data = collection.items[0]?.data as PurchaseRules;

    return {
        minSubtotal: data.minSubtotal || 0,
        maxSubtotal: data.maxSubtotal || Number.MAX_SAFE_INTEGER,
        minTotalItems: data.minTotalItems || 0,
        maxTotalItems: data.maxTotalItems || Number.MAX_SAFE_INTEGER,
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
