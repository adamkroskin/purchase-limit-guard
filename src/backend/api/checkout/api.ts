import { upsertDataToCollection, safelyGetItemFromCollection } from '../../database';
import { PURCHASE_RULES_COLLECTION_ID } from '../../consts';

export async function GET(req: Request) {
  const purchaseFlowId = new URL(req.url).searchParams.get('purchaseFlowId') as string;
  const checkoutData = await safelyGetItemFromCollection({
    itemId: purchaseFlowId,
    dataCollectionId: PURCHASE_RULES_COLLECTION_ID,
  });

  return new Response(JSON.stringify(checkoutData ?? {}));
};

export async function POST(req: Request) {
  const { purchaseFlowId, checkoutId, shouldAdd } = await req.json();

  try {
    await upsertDataToCollection({
      dataCollectionId: PURCHASE_RULES_COLLECTION_ID,
      item: {
        _id: purchaseFlowId,
        data: {
          checkoutId,
          shouldAdd,
        },
      },
    });

    // 
    return new Response('Success');
  } catch (error) {
    console.log(error)
    return new Response('Error')
  };
};
