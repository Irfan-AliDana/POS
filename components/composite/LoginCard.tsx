"use client";

import AuthContainer from "@/containers/auth/AuthContainer";
import ButtonMod from "../base/Button";
import CardMod from "../base/Card";
import { Space } from "antd";
import { createStyles, css } from "antd-style";

const useStyles = createStyles({
    header: css`
        color: white;
    `,
});

export default function LoginCard() {
    const { handleLogin } = AuthContainer();
    const { styles } = useStyles();

    return (
        <CardMod>
            <Space direction="vertical" size={15}>
                <h2 className={styles.header}>Login to Sqaureup</h2>
                <ButtonMod onClick={handleLogin}>Login</ButtonMod>
            </Space>
        </CardMod>
    );
}
