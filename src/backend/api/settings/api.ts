import {getDataFromCollection, upsertDataToCollection} from '../../database';
import {DEFAULT_RULE, PURCHASE_RULES_COLLECTION_ID} from '../../consts';
import type {PurchaseRules} from '../../../types';

export async function GET(req: Request) {
    const settingsCollection = await getDataFromCollection({
        dataCollectionId: PURCHASE_RULES_COLLECTION_ID,
    });

    const settingsData = settingsCollection.items[0]?.data as PurchaseRules;
    const settings: PurchaseRules = {
        subtotal: settingsData?.subtotal || DEFAULT_RULE,
        totalItems: settingsData?.totalItems || DEFAULT_RULE,
        orderWeight: settingsData?.orderWeight || DEFAULT_RULE,
    };

    return new Response(JSON.stringify(settings));
}

export async function POST(req: Request) {
    const settingsData = await req.json() as PurchaseRules;

    try {
        await upsertDataToCollection({
            dataCollectionId: PURCHASE_RULES_COLLECTION_ID,
            item: {
                _id: "SINGLE_ITEM_ID",
                data: settingsData,
            },
        });

        return new Response('Success');
    } catch (error) {
        return error;
    }
}
