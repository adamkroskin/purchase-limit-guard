import React, {useEffect, useState, type FC} from 'react';
import {httpClient} from '@wix/essentials';
import {
    Collapse,
    ToggleSwitch, Dropdown,
    Box,
    Card,
    Cell,
    Layout,
    Loader,
    Page,
    Text,
    Input,
    NumberInput,
    WixDesignSystemProvider, Button,
} from '@wix/design-system';
import { APP_ID } from "../../backend/consts"
import {PurchaseRules, Severity} from '../../types';
import '@wix/design-system/styles.global.css';
import {Limit} from "../../components/limit";
import {dashboard} from "@wix/dashboard";
import {createClient, AuthenticationStrategy, AppStrategy, ApiKeyStrategy} from '@wix/sdk';
import {appInstances} from "@wix/app-management";


const severityOptions = [
    {id: Severity.WARNING, value: 'Show warning message'},
    {id: Severity.ERROR, value: 'Show error message'},
];

const Index: FC = () => {
    const [settings, setSettings] = useState<PurchaseRules>();
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [siteId, setSiteId] = useState<string>();

    useEffect(() => {
        // fetch via our own backend
        const fetchSettings = async () => {
            const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
            const data: PurchaseRules = (await res.json());

            setSettings(data);
        };

        // fetch directly from Wix, docs :
        // https://dev.wix.com/docs/sdk/backend-modules/app-management/app-instances/introduction
        const fetchAppInstance = async () => {
            const wixClient = createClient({
                modules: {appInstances},
                auth: dashboard.auth(),
                host: dashboard.host(),
            });

            const {instance, site} = await wixClient.appInstances.getAppInstance();
            setIsPremium(!instance.isFree);
            setSiteId(site.siteId);
        }

        fetchAppInstance()
        fetchSettings();
    }, []);

    const partiallyUpdateSettings = (partiallyUpdatedSettings: Partial<Settings>) => {
        const updatedSettings = {
            ...settings,
            ...partiallyUpdatedSettings,
        };
        setSettings(updatedSettings)
        httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`, {
            method: 'POST',
            body: JSON.stringify(updatedSettings),
        });
    }

    return (
        <WixDesignSystemProvider features={{newColorsBranding: true}}>
            {!settings ? (
                <Box
                    height='100vh'
                    align='center'
                    verticalAlign='middle'
                >
                    <Loader/>
                </Box>
            ) : (
                <Page height='100vh'>
                    <Page.Header
                        title="Purchase Limit Guard"
                        subtitle="Improve the shopping experience with order limits on collections, product types and locations"
                        actionsBar={!isPremium && <Button skin="premium" onClick={
                            () => {
                                window.open(`https://www.wix.com/apps/upgrade/${APP_ID}?metaSiteId=${siteId}`)

                                dashboard.showToast({
                                    message: "Refresh the page to apply purchased premium",
                                    timeout: "none"
                                })
                            }
                        }>
                            Upgrade
                        </Button>}
                    />
                    <Page.Content>
                        <Layout>
                            <Cell span={12}>
                                <Card>
                                    <Card.Header
                                        title="Subtotal Limits"
                                        subtitle="Define tsadfhe minimum and maximum cart subtotal, excluding shipping and taxes, and verify that the customer's cart contents are always within the set price range."
                                        suffix={
                                            <ToggleSwitch
                                                onChange={() => partiallyUpdateSettings({
                                                    subtotal: {
                                                        ...settings.subtotal,
                                                        active: !settings.subtotal?.active
                                                    } || undefined
                                                })}
                                                size="medium"
                                                checked={settings.subtotal?.active}
                                            />
                                        }
                                    />
                                    <Collapse open={settings.subtotal?.active}>
                                        <Card.Divider/>
                                        <Card.Content>
                                            <Limit label="Minimum total order amount" prefix="$"
                                                   value={settings.subtotal?.minValue}
                                                   onChange={amount => partiallyUpdateSettings({
                                                       subtotal: {
                                                           ...settings.subtotal,
                                                           minValue: amount
                                                       } || undefined
                                                   })}/>
                                            <Limit label="Maximum total order amount" prefix="$"
                                                   value={settings.subtotal?.maxValue}
                                                   onChange={amount => partiallyUpdateSettings({
                                                       subtotal: {
                                                           ...settings.subtotal,
                                                           maxValue: amount
                                                       } || undefined
                                                   })}/>
                                            <Text size="medium" weight={"bold"}>Set restriction on you cart &
                                                checkout</Text>
                                            <Text secondary>Cart Restrictions</Text>
                                            <Dropdown
                                                placeholder="Select Cart Restrictions"
                                                onChange={option => partiallyUpdateSettings({
                                                    subtotal: {
                                                        ...settings.subtotal,
                                                        cartSeverity: option
                                                    } || undefined
                                                })}
                                                options={severityOptions}
                                                value={settings.subtotal?.cartSeverity}
                                            />
                                            <Text secondary>Checkout Restrictions:</Text>
                                            <Dropdown
                                                placeholder="Select Checkout Restrictions"
                                                onChange={option => partiallyUpdateSettings({
                                                    subtotal: {
                                                        ...settings.subtotal,
                                                        checkoutSeverity: option
                                                    } || undefined
                                                })}
                                                value={settings.subtotal?.checkoutSeverity}
                                                options={severityOptions}
                                            />
                                        </Card.Content>
                                    </Collapse>
                                </Card>
                            </Cell>
                            {/*  <Cell span={12}>*/}
                            {/*      <Card>*/}
                            {/*    <Card.Header*/}
                            {/*        title="Total Items Limit"*/}
                            {/*        subtitle="Define the minimum and maximum item quantity and verify that the customer's cumulative cart contents are always within the quantity range you set."*/}
                            {/*    />*/}
                            {/*<Card.Divider/>*/}
                            {/*    <Card.Content>*/}
                            {/*        <Limit label="Minimum order amount (total items)" prefix="#"*/}
                            {/*               value={settings.minTotalItems}*/}
                            {/* onChange={amount => partiallyUpdateSettings({minTotalItems: amount || undefined})}/>*/}
                            {/*        <Limit label="Minimum order amount (total items)" prefix="#"*/}
                            {/*               value={settings.maxTotalItems}*/}
                            {/* onChange={amount => partiallyUpdateSettings({maxTotalItems: amount || undefined})}/>*/}
                            {/*    </Card.Content>*/}
                            {/*  </Card>*/}
                            {/*  </Cell>*/}
                            {/*  <Cell span={12}>*/}
                            {/*      <Card>*/}
                            {/*        <Card.Header*/}
                            {/*            title="Weight Limit"*/}
                            {/*            subtitle="Define the minimum and maximum weight requirements and verify that your customer's cart order weight is within the weight range you set."*/}
                            {/*        />*/}
                            {/*<Card.Divider/>*/}
                            {/*        <Card.Content>*/}
                            {/*            <Limit label="Minimum order weight" prefix="KG"*/}
                            {/*                   value={settings.minOrderWeight}*/}
                            {/*     onChange={amount => partiallyUpdateSettings({minOrderWeight: amount || undefined})}/>*/}
                            {/*            <Limit label="Maximum order weight" prefix="KG"*/}
                            {/*                   value={settings.maxOrderWeight}*/}
                            {/*     onChange={amount => partiallyUpdateSettings({maxOrderWeight: amount || undefined})}/>*/}
                            {/*        </Card.Content>*/}
                            {/*    </Card>*/}
                            {/*</Cell>*/}
                        </Layout>
                    </Page.Content>
                </Page>
            )}
        </WixDesignSystemProvider>
    );
};

export default Index;
