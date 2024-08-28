import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { createStyles } from "antd-style";
import AuthContainer from "@/containers/auth/AuthContainer";

type MenuItem = Required<MenuProps>["items"][number];

const { handleLogout } = AuthContainer();

const items: MenuItem[] = [
    {
        label: <Link href="/login">Login</Link>,
        key: "login",
    },
    {
        label: <span onClick={handleLogout}>Signout</span>,
        key: "logout",
    },
];

const useStyles = createStyles(({ token, css }) => ({
    layout: css`
        height: 100vh;
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
    content: css`
        display: flex;
        justify-content: center;
        align-items: center;
    `,
}));

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { styles } = useStyles();
    const { Header, Content } = Layout;

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <h2 className={styles.logo}>My Logo</h2>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={items}
                    className={styles.menu}
                />
            </Header>
            <Content className={styles.content}>{children}</Content>
        </Layout>
    );
}
