import {
    Box,
    Text,
    Input,
    NumberInput, FormField,
} from '@wix/design-system';

export const LimitNumberInput: React.FC<{
    label: string,
    prefix: string,
    value?: number,
    onChange: (n: number) => void
}> = (props) =>
<Box direction={"vertical"}>
    <FormField label={props.label}>
        <NumberInput
            label={"adam"}
            prefix={<Input.Affix>{props.prefix}</Input.Affix>}
            min={0}
            value={props.value}
            onChange={props.onChange}
        />
    </FormField>
</Box>


