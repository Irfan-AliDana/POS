import { Select } from "antd";
import { createStyles } from "antd-style";

export type SearchModeProps = {
    showSearch: boolean;
    placeholder: string;
    handleDropdown: (value: string) => void;
    options: { label: string; value: string }[];
};

const useStyles = createStyles(({ token, css }) => ({
    select: css`
        width: 15%;

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
}: SearchModeProps) {
    const { styles } = useStyles();

    return (
        <Select
            showSearch={showSearch}
            placeholder={placeholder}
            onChange={handleDropdown}
            optionFilterProp="label"
            options={options}
            className={styles.select}
            allowClear
        />
    );
}
