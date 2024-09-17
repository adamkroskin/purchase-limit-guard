import { auth } from '@wix/essentials';
import { collections } from '@wix/data';
import { appInstances } from '@wix/app-management';
import { PURCHASE_RULES_COLLECTION_ID, PURCHASE_RULES_COLLECTION_NAME } from '../../consts';

appInstances.onAppInstanceInstalled(() => {
  auth.elevate(collections.createDataCollection)({
    _id: PURCHASE_RULES_COLLECTION_ID,
    displayName: PURCHASE_RULES_COLLECTION_NAME,
    fields: [
      { key: 'minSubtotal', type: collections.Type.NUMBER },
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
