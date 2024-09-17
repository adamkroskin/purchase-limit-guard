import { validations } from '@wix/ecom/service-plugins/context';

validations.provideHandlers({
  getValidationViolations: async ({ request, metadata }) => {
  request.validationInfo.priceSummary.total.amount
    return {
      // Return your response exactly as documented to integrate with Wix Validations SPI:
      // https://dev.wix.com/docs/sdk/backend-modules/ecom/service-plugins/validations/get-validation-violations
      violations: [{
        description:  {
          value: "You must purchase at least 100 items.",
        },
        severity: "WARNING",
        target: {
          other: {
            name: "OTHER_DEFAULT",
          },
        },
      }]
    };
  },
})
