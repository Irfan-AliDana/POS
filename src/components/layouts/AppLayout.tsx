import { MenuItem } from "@/src/containers/layout/LayoutContainer";
import { Flex, Layout, Menu } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    layout: css`
        height: 100vh;
        overflow: auto;
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    logo: css`
        color: ${token.colorPrimary};
    `,
    menu: css`
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
    `,
}));

export default function AppLayout({
    children,
    items,
}: {
    children: React.ReactNode;
    items: MenuItem[];
}) {
    const { styles } = useStyles();
    const { Header, Content } = Layout;

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <h2 className={styles.logo}>POS</h2>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={items}
                    className={styles.menu}
                />
            </Header>
            <Content>{children}</Content>
        </Layout>
    );
}
