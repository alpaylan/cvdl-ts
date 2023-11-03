import { SectionLayout } from "./Layout";
export declare class LayoutSchema {
    schema_name: string;
    header_layout_schema: SectionLayout;
    item_layout_schema: SectionLayout;
    constructor(schema_name: string, header_layout_schema: SectionLayout, item_layout_schema: SectionLayout);
    static fromJson(json: any): LayoutSchema;
    fonts(): import("./Font").Font[];
}
