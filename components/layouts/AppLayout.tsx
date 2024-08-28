import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { createStyles } from "antd-style";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        label: <Link href="/login">Login</Link>,
        key: "login",
    },
    {
        label: <Link href="/">Home</Link>,
        key: "home",
    },
];

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
        width: fit-content;
    `,
}));

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
