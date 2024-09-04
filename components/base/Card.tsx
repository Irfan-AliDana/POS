import { Card } from "antd";
import { createStyles, css } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    card: css`
        background-color: ${token.colorPrimary};
    `,
}));

const { Meta } = Card;

type CardModProps = {
    title?: string;
    cover?: React.ReactNode;
    border?: boolean;
    loading?: boolean;
    hoverable?: boolean;
    actions?: React.ReactNode[];
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
    metaAvatar?: React.ReactNode;
    metaTitle?: string;
    metaDescription?: React.ReactNode;
};

export default function CardMod({
    title,
    cover,
    border,
    loading,
    hoverable,
    actions,
    children,
    onClick,
    metaTitle,
    metaDescription,
    metaAvatar,
}: CardModProps) {
    const { styles } = useStyles();

    return (
        <Card
            title={title}
            cover={cover}
            bordered={border}
            loading={loading}
            hoverable={hoverable}
            actions={actions}
            className={styles.card}
            onClick={onClick}
        >
            {children ? (
                children
            ) : (
                <Meta
                    title={metaTitle}
                    description={metaDescription}
                    avatar={metaAvatar}
                />
            )}
        </Card>
    );
}
