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
  WixDesignSystemProvider,
} from '@wix/design-system';
import { PluginPreview } from '../../components/plugin-preview';
import { SettingsForm } from '../../components/settings-form';
import type { Settings } from '../../types';
import '@wix/design-system/styles.global.css';

const Index: FC = () => {
  const [settings, setSettings] = useState<Settings>()

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
      const data: Settings = (await res.json());

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
            title="Carbon Offset"
            subtitle="Let your customers balance the carbon footprint of their order."
            actionsBar={
              <Button onClick={() => console.log("button click")} />
            }
          />
          <Page.Content>
            <Layout>
              <Cell span={4}>
                <Card stretchVertically>
                  <Card.Header
                    title="Settings"
                    subtitle="This appears on your checkout page."
                  />
                  <Card.Divider />
                  <Card.Content>
                    <SettingsForm
                      settings={settings}
                      setSettings={setSettings}
                    />
                  </Card.Content>
                </Card>
              </Cell>
              <Cell span={8}>
                <Card>
                  <Card.Header
                    title="Preview"
                    subtitle="This is how your plugin will look like."
                  />
                  <Card.Divider />
                  <Card.Content>
                    <PluginPreview {...settings} />
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
