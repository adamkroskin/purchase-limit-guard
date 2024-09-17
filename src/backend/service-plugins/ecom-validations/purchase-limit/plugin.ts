import {validations} from '@wix/ecom/service-plugins/context';
import {getDataFromCollection} from "../../../database";
import {PURCHASE_RULES_COLLECTION_ID} from "../../../consts";
import type {PurchaseRules} from "../../../../types";

validations.provideHandlers({
    getValidationViolations: async ({request, metadata}): Promise<validations.GetValidationViolationsResponse> => {
        const rules = await getPurchaseRules();
        const minSubtotal = rules.minSubtotal || 0;
        const maxSubtotal = rules.maxSubtotal || Number.MAX_SAFE_INTEGER;
        // @ts-ignore
        const subtotal = parseInt(request.validationInfo.priceSummary.subtotal.amount);
        const validations = [
            {
                predicate: () => {
                    return subtotal >= minSubtotal
                },
                errorMessage: `Your total purchase amount cannot be lower then ${minSubtotal}`
            },
            {
                predicate: () => {
                    return subtotal <= maxSubtotal
                },
                errorMessage: `Your total purchase amount cannot be higher then ${maxSubtotal}`
            },
        ];

        const violations = validations
            .filter(({ predicate }) => !predicate()) // Ensure predicate is called as a function
            .map(({ errorMessage }) => createViolation(errorMessage));

        return {violations: violations}
    }
})

async function getPurchaseRules() {
    const collection = await getDataFromCollection({dataCollectionId: PURCHASE_RULES_COLLECTION_ID});
    return collection.items[0]?.data as PurchaseRules;
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
