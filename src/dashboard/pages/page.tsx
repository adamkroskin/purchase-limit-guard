import React, { useEffect, useState, type FC } from 'react';
import { httpClient } from '@wix/essentials';
import {
  Box,
  Card,
  Cell,
  Layout,
  Loader,
  Page,
  Text,
  Input,
  NumberInput,
  WixDesignSystemProvider,
} from '@wix/design-system';
import type { PurchaseRules } from '../../types';
import '@wix/design-system/styles.global.css';
import {Limit} from "../../components/limit";

const Index: FC = () => {
  const [settings, setSettings] = useState<PurchaseRules>()

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
      const data: PurchaseRules = (await res.json());

      setSettings(data);
    };

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
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      {!settings ? (
        <Box
          height='100vh'
          align='center'
          verticalAlign='middle'
        >
          <Loader />
        </Box>
      ) : (
        <Page height='100vh'>
          <Page.Header
            title="Purchase Limit Guard"
            subtitle="Improve the shopping experience with order limits on collections, product types and locations"
          />
          <Page.Content>
            <Layout>
              <Cell span={12}>
                <Card>
                  <Card.Header
                    title="Subtotal Limits"
                    subtitle="Define the minimum and maximum cart subtotal, excluding shipping and taxes, and verify that the customer's cart contents are always within the set price range."
                  />
                  <Card.Divider />
                  <Card.Content>
                      <Limit label="Minimum total order amount" prefix="$"
                             value={settings.minSubtotal}
                             onChange={amount => partiallyUpdateSettings({minSubtotal: amount || undefined})}/>
                      <Limit label="Maximum total order amount" prefix="$"
                             value={settings.maxSubtotal}
                             onChange={amount => partiallyUpdateSettings({ maxSubtotal: amount || undefined })}/>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header
                      title="Total Items Limit"
                      subtitle="Define the minimum and maximum item quantity and verify that the customer's cumulative cart contents are always within the quantity range you set."
                  />
                  <Card.Divider />
                  <Card.Content>
                      <Limit label="Minimum order amount (total items)" prefix="#"
                             value={settings.minTotalItems}
                             onChange={amount => partiallyUpdateSettings({ minTotalItems: amount || undefined })} />
                      <Limit label="Minimum order amount (total items)" prefix="#"
                             value={settings.maxTotalItems}
                             onChange={amount => partiallyUpdateSettings({ maxTotalItems: amount || undefined })} />
                  </Card.Content>
                </Card>
              </Cell>
            </Layout>
          </Page.Content>
        </Page>
      )}
    </WixDesignSystemProvider >
  );
};

export default Index;
