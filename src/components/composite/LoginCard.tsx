"use client";

import ButtonMod from "../base/Button";
import CardMod from "../base/Card";
import { Flex, Space } from "antd";
import { createStyles, css } from "antd-style";

const useStyles = createStyles({
    header: css`
        color: white;
    `,
    container: css`
        height: 100%;
    `,
});

type LoginCardProps = {
    handleLogin: () => void;
};

export default function LoginCard({ handleLogin }: LoginCardProps) {
    const { styles } = useStyles();

    return (
        <Flex justify="center" align="center" className={styles.container}>
            <CardMod>
                <Space direction="vertical" size={15}>
                    <h2 className={styles.header}>Login to Sqaureup</h2>
                    <ButtonMod onClick={handleLogin}>Login</ButtonMod>
                </Space>
            </CardMod>
        </Flex>
    );
}
