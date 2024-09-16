import { Select } from "antd";
import { createStyles } from "antd-style";

export type SelectModProps = {
    showSearch: boolean;
    placeholder: string;
    handleDropdown: (value: string | number) => void;
    options: { label: string; value: string | number }[];
    defaultValue?: string;
    allowClear?: boolean;
};

const useStyles = createStyles(({ token, css }) => ({
    select: css`
        width: 100%;

        @media only screen and (max-width: 576px) {
            width: 50%;
        }
    `,
}));

export default function SelectMod({
    showSearch,
    placeholder,
    handleDropdown,
    options,
    defaultValue,
    allowClear = true,
}: SelectModProps) {
    const { styles } = useStyles();

    return (
        <Select
            showSearch={showSearch}
            placeholder={placeholder}
            onChange={handleDropdown}
            optionFilterProp="label"
            options={options}
            className={styles.select}
            allowClear={allowClear}
            defaultValue={defaultValue}
        />
    );
}
