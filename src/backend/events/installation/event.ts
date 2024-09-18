import { auth } from '@wix/essentials';
import { collections } from '@wix/data';
import { appInstances } from '@wix/app-management';
import { PURCHASE_RULES_COLLECTION_ID, PURCHASE_RULES_COLLECTION_NAME } from '../../consts';
import type {PurchaseRules} from "../../../types";

appInstances.onAppInstanceInstalled(() => {
  auth.elevate(collections.createDataCollection)({
    _id: PURCHASE_RULES_COLLECTION_ID,
    displayName: PURCHASE_RULES_COLLECTION_NAME,
    fields: [
      { key: 'minSubtotal', type: collections.Type.NUMBER },
      { key: 'maxSubtotal', type: collections.Type.NUMBER },
      { key: 'minTotalItems', type: collections.Type.NUMBER },
      { key: 'maxTotalItems', type: collections.Type.NUMBER },
      { key: 'minOrderWeight', type: collections.Type.NUMBER },
      { key: 'maxOrderWeight', type: collections.Type.NUMBER },
    ],
    permissions: {
      // Make sure to change the permissions according to the actual usage of your collection
      insert: collections.Role.ANYONE,
      read: collections.Role.ANYONE,
      remove: collections.Role.ANYONE,
      update: collections.Role.ANYONE,
    },
  });
});