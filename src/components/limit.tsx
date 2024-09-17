import {
    Box,
    Text,
    Input,
    NumberInput,
} from '@wix/design-system';

export const Limit: React.FC<{
    label: string,
    prefix: string,
    value?: number,
    onChange: (n: number) => void
}> = (props) =>
<Box direction={"vertical"} width={"75%"}>
    <Text secondary>{props.label}</Text>
    <NumberInput
        prefix={<Input.Affix>{props.prefix}</Input.Affix>}
        min={0}
        value={props.value}
        onChange={props.onChange}
    />
</Box>


