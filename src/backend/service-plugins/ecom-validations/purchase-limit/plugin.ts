import {validations} from '@wix/ecom/service-plugins/context';
import {getDataFromCollection} from "../../../database";
import {PURCHASE_RULES_COLLECTION_ID} from "../../../consts";
import type {Settings} from "../../../../types";

validations.provideHandlers({
    getValidationViolations: async ({request, metadata}): Promise<validations.GetValidationViolationsResponse> => {
        // @ts-ignore
        const subtotal = parseInt(request.validationInfo.priceSummary.subtotal.amount);
        const minSubtotal = await getMinSubtotal();

        if (subtotal < minSubtotal) {
            let description = `Your total purchase amount cannot be lower then ${minSubtotal}`;
            let severity = validations.Severity.ERROR
            let target: validations.Target = {
                other: {
                    name: validations.NameInOther.OTHER_DEFAULT
                }
            }
            let violation = createViolation(severity, target, description);

            return {violations: [violation]}
        } else {
            return {violations: []}
        }
    }
})

async function getMinSubtotal() {
    const collection = await getDataFromCollection({dataCollectionId: PURCHASE_RULES_COLLECTION_ID});
    const collectionData = collection.items[0]?.data as Settings;
    return collectionData?.minSubtotal;
}

function createViolation(severity: validations.Severity, target: validations.Target, description: string): validations.Violation {
    return {severity, target, description};
}
