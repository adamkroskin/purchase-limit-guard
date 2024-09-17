import type { Settings } from "../types";

// Update according to your app's needed collections
export const PURCHASE_RULES_COLLECTION_ID = 'purchase-rules';
export const PURCHASE_RULES_COLLECTION_NAME = 'Purchase Rules';
export const DEFAULT_SETTING: Settings = {
  title: 'Make it carbon neutral',
  amount: 2,
  color: '#000000',
  iconColor: '#000000',
};
