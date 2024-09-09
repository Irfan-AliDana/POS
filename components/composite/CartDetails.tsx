import { Flex } from "antd";

export default function CartDetails() {
    return (
        <Flex
            justify="space-between"
            align="end"
            style={{
                background: "#f7f7f7",
                borderRadius: "5px",
                padding: "10px",
            }}
        >
            <Flex vertical gap={10}>
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>Name</p>
                <p>1000Rs.</p>
            </Flex>
            <p style={{ fontWeight: "bold" }}>10</p>
        </Flex>
    );
}
