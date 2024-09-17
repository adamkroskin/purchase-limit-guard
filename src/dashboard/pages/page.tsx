import React, { useEffect, useState, type FC } from 'react';
import { httpClient } from '@wix/essentials';
import {
  Box,
  Button,
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
import type { Settings } from '../../types';
import '@wix/design-system/styles.global.css';

const Index: FC = () => {
  const [settings, setSettings] = useState<Settings>()

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
      const data: Settings = (await res.json());
      console.log(data)
      setSettings(data);
    };

    fetchSettings();
  }, []);

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
                    <Box direction={"vertical"} width={"75%"}>
                      <Text secondary>Minimum total order amount</Text>
                      <NumberInput
                          // todo: Get site currency
                          prefix={<Input.Affix>$</Input.Affix>}
                          min={0}
                          value={settings.minSubtotal}
                          onChange={async amount => {
                            setSettings({ minSubtotal: amount || 0 })
                            const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`, {
                              method: 'POST',
                              body: JSON.stringify({
                                minSubtotal: amount,
                              }),
                            });
                            console.log(res)
                          }}
                      />
                    </Box>
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
