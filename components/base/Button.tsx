import { Button } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    button: css`
        font-size: 16px;
        padding: 18px 25px;
    `,
}));

interface ButtonModProps {
    type?: "default" | "link" | "text" | "primary" | "dashed";
    htmlType?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    children: React.ReactNode;
}

export default function ButtonMod({
    type = "default",
    htmlType = "button",
    disabled = false,
    onClick,
    children,
}: ButtonModProps) {
    const { styles } = useStyles();

    return (
        <Button
            type={type}
            htmlType={htmlType}
            disabled={disabled}
            onClick={onClick}
            className={styles.button}
        >
            {children}
        </Button>
    );
}
