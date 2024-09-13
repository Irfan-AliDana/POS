import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type SpinnerProps = {
    size?: number;
};

export default function Spinner({ size = 40 }: SpinnerProps) {
    return (
        <Spin indicator={<LoadingOutlined spin style={{ fontSize: size }} />} />
    );
}
