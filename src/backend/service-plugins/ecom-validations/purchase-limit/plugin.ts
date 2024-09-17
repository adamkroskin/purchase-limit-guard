import {validations} from '@wix/ecom/service-plugins/context';

validations.provideHandlers({
    getValidationViolations: async ({request, metadata}): Promise<validations.GetValidationViolationsResponse> => {
        const subtotal = 50 // parseInt(request.validationInfo.priceSummary.total.amount)
        let violations = [];
        let severity = validations.Severity.ERROR
        let target: validations.Target = {
            other: {
                name: validations.NameInOther.OTHER_DEFAULT
            }
        }
        let description = "You can't purchase a total amount that is lower than 100"
        // const violation = createViolation(severity, target, description);
        // violations.push(violation);
        return {violations: [createViolation(severity, target, description)]}
    }
})

function createViolation(severity: validations.Severity, target: validations.Target, description: string): validations.Violation {
    return {severity, target, description};
}
