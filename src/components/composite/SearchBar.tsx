"use client";

import { Flex } from "antd";
import InputMod, { InputModProps } from "../base/Input";
import SearchMod, { SelectModProps } from "../base/Select";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        width: 30%;

        @media only screen and (max-width: 1024px) {
            width: 50%;
        }

        @media only screen and (max-width: 550px) {
            width: 70%;
        }
    `,
}));

export type SearchBarProps = Pick<
    InputModProps,
    "value" | "handleSearch" | "loading"
> &
    Pick<SelectModProps, "handleDropdown" | "options">;

export default function SearchBar({
    value,
    handleSearch,
    loading,
    handleDropdown,
    options,
}: SearchBarProps) {
    const { styles } = useStyles();

    return (
        <Flex
            justify="end"
            gap={10}
            style={{
                width: "100%",
            }}
        >
            <div className={styles.container}>
                <Flex gap={10}>
                    <InputMod
                        placeholder="Search items by category or name"
                        value={value}
                        handleSearch={handleSearch}
                        search
                        loading={loading}
                    />
                    <SearchMod
                        showSearch
                        placeholder="Select Category"
                        handleDropdown={handleDropdown}
                        options={options}
                    />
                </Flex>
            </div>
        </Flex>
    );
}
