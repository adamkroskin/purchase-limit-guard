import {PurchaseRules, Severity} from "../types";
import {Box, Card, Collapse, Dropdown, Input, Text, ToggleSwitch} from "@wix/design-system";
import {LimitNumberInput} from "./limit-number-input";
import React from "react";

const severityOptions = [
    {id: Severity.WARNING, value: 'Show warning message'},
    {id: Severity.ERROR, value: 'Show error message'},
];

export function LimitRule({settings, ruleType, partiallyUpdateSettings}: {
    settings: PurchaseRules,
    ruleType: keyof PurchaseRules
    partiallyUpdateSettings: (partiallyUpdatedSettings: Partial<Settings>) => void;
}) {

    return <Card>
        <Card.Header
            title="Subtotal Limits"
            subtitle="Define tsadfhe minimum and maximum cart subtotal, excluding shipping and taxes, and verify that the customer's cart contents are always within the set price range."
            suffix={
                <ToggleSwitch
                    onChange={() => partiallyUpdateSettings({
                        [ruleType]: {
                            ...settings[ruleType],
                            active: !settings[ruleType]?.active
                        } || undefined
                    })}
                    size="medium"
                    checked={settings[ruleType]?.active}
                />
            }
        />
        <Collapse open={settings[ruleType]?.active}>
            <Card.Divider/>
            <Card.Content>
                <LimitNumberInput label="Minimum total order amount" prefix="$"
                                  value={settings[ruleType]?.minValue}
                                  onChange={(amount) => partiallyUpdateSettings({
                           [ruleType]: {
                               ...settings[ruleType],
                               minValue: amount
                           } || undefined
                       })}/>
                <LimitNumberInput label="Maximum total order amount" prefix="$"
                                  value={settings[ruleType]?.maxValue}
                                  onChange={(amount) => partiallyUpdateSettings({
                           [ruleType]: {
                               ...settings[ruleType],
                               maxValue: amount
                           } || undefined
                       })}/>

                <Box margin="SP2 0">
                    <Text size="medium" weight="bold">Set restriction on you cart & checkout</Text>
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
