import {PurchaseRules, Severity} from "../types";
import {Box, Card, Collapse, Dropdown, Input, Text, ToggleSwitch} from "@wix/design-system";
import {LimitNumberInput} from "./limit-number-input";
import React from "react";
import {dashboard} from "@wix/dashboard";

const severityOptions = [
    {id: Severity.WARNING, value: 'Show warning message'},
    {id: Severity.ERROR, value: 'Show error message'},
];

const rulesDescription = {
    subtotal: {
        title: "Subtotal Limits",
        subtitle: "Define the minimum and maximum cart subtotal, excluding shipping and taxes, and verify that the customer's cart contents are always within the set price range.",
        unit: "$"
    },
    totalItems: {
        title: "Total Item Limits",
        subtitle: "Define the minimum and maximum item quantity and verify that the customer's cumulative cart contents are always within the quantity range you set.",
        unit: "#"
    },
    orderWeight: {
        title: "Weight Limits",
        subtitle: "Define the minimum and maximum weight requirements and verify that your customer's cart order weight is within the weight range you set.",
        unit: "kg"
    },
}

export function LimitRule({settings, ruleType, partiallyUpdateSettings, isPremium}: {
    isPremium: boolean,
    settings: PurchaseRules,
    ruleType: keyof PurchaseRules
    partiallyUpdateSettings: (partiallyUpdatedSettings: Partial<Settings>) => void;
}) {

    return <Card>
        <Card.Header
            title={rulesDescription[ruleType].title}
            subtitle={rulesDescription[ruleType].subtitle}
            suffix={
                <ToggleSwitch
                    onChange={() => {
                        const activeRules = Object.values(settings || {}).filter(item => item.active).length
                        if (!isPremium && activeRules > 0 && !settings[ruleType]?.active) {
                            dashboard.showToast({message: "Upgrade to set multiple restrictions and boost your control!", type: "error"})
                        } else {
                            partiallyUpdateSettings({
                                [ruleType]: {
                                    ...settings[ruleType],
                                    active: !settings[ruleType]?.active
                                } || undefined
                            })
                        }
                    }}
                    size="medium"
                    checked={settings[ruleType]?.active}
                />
            }
        />
        <Collapse open={settings[ruleType]?.active}>
            <Card.Divider/>
            <Card.Content>
                <LimitNumberInput label="Minimum amount" prefix={rulesDescription[ruleType].unit}
                                  value={settings[ruleType]?.minValue}
                                  onChange={(amount) => partiallyUpdateSettings({
                                      [ruleType]: {
                                          ...settings[ruleType],
                                          minValue: amount
                                      } || undefined
                                  })}/>
                <LimitNumberInput label="Maximum amount" prefix={rulesDescription[ruleType].unit}
                                  value={settings[ruleType]?.maxValue}
                                  onChange={(amount) => partiallyUpdateSettings({
                                      [ruleType]: {
                                          ...settings[ruleType],
                                          maxValue: amount
                                      } || undefined
                                  })}/>

                <Box margin="SP2 0">
                    <Text size="medium" weight="bold">Set restriction on your cart & checkout</Text>
                </Box>

                <Text secondary>Cart Restrictions</Text>
                <Dropdown
                    placeholder="Select Cart Restrictions"
                    onSelect={(option) => partiallyUpdateSettings({
                        [ruleType]: {
                            ...settings[ruleType],
                            cartSeverity: option.id
                        } || undefined
                    })}
                    options={severityOptions}
                    selectedId={settings[ruleType]?.cartSeverity}
                />
                <Text secondary>Checkout Restrictions:</Text>
                <Dropdown
                    placeholder="Select Checkout Restrictions"
                    onSelect={(option) => partiallyUpdateSettings({
                        [ruleType]: {
                            ...settings[ruleType],
                            checkoutSeverity: option.id
                        } || undefined
                    })}
                    selectedId={settings[ruleType]?.checkoutSeverity}
                    options={severityOptions}
                />
                <Text secondary>Write a message that clearly explains this requirements to
                    customers</Text>
                <Input value={settings[ruleType]?.message}
                       onChange={event =>
                           partiallyUpdateSettings({
                               [ruleType]: {
                                   ...settings[ruleType],
                                   message: event.target.value
                               }
                           })}
                />
            </Card.Content>
        </Collapse>
    </Card>;
}
