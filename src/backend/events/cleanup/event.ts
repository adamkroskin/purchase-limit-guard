import { auth } from '@wix/essentials';
import { items } from '@wix/data';
import { checkout } from '@wix/ecom';
import { PURCHASE_RULES_COLLECTION_ID } from '../../consts';

// checkout.onCheckoutCompleted(({ data }) => {
//   auth.elevate(items.removeDataItem)(
//     data.checkout?.purchaseFlowId ?? '',
//     { dataCollectionId: PURCHASE_RULES_COLLECTION_ID },
//   );
// });
