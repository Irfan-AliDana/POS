import { Input } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    input: css`
        width: 15%;
    `,
}));

const { Search } = Input;

export type InputModProps = {
    placeholder?: string;
    value: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    size?: "small" | "middle" | "large";
    search?: boolean;
    loading?: boolean;
};

export default function InputMod({
    placeholder,
    value,
    handleSearch,
    type = "text",
    size = "middle",
    search = false,
    loading,
}: InputModProps) {
    const { styles } = useStyles();

    return search ? (
        <Search
            placeholder={placeholder}
            value={value}
            onChange={handleSearch}
            type={type}
            size={size}
            loading={loading}
            className={styles.input}
        />
    ) : (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={handleSearch}
            type={type}
            size={size}
        />
    );
}
