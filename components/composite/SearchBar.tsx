"use client";

import { Flex } from "antd";
import InputMod, { InputModProps } from "../base/Input";
import SearchMod, { SearchModeProps } from "../base/Select";

export type SearchBarProps = Pick<
    InputModProps,
    "value" | "handleSearch" | "loading"
> &
    Pick<SearchModeProps, "handleDropdown" | "options">;

export default function SearchBar({
    value,
    handleSearch,
    loading,
    handleDropdown,
    options,
}: SearchBarProps) {
    return (
        <Flex justify="end" gap={10}>
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
    );
}
