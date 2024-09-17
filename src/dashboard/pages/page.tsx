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
            subtitle="Enforce minimum purchase limits on cart and checkout"
            actionsBar={
              <Button onClick={() => console.log("button click")} > Some Button </Button >
            }
          />
          <Page.Content>
            <Layout>
              <Cell span={6}>
                <Card>
                  <Card.Header
                    title="Configure your minimun purchase limit"
                  />
                  <Card.Divider />
                  <Card.Content>
                    <Box>
                      <NumberInput
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
