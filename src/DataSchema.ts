export type DocumentDataType =
    | { tag: "Date" }
    | { tag: "String" }
    | { tag: "MarkdownString" }
    | { tag: "Type", value: string }
    | { tag: "List", value: DocumentDataType }
    | { tag: "Types", value: DocumentDataType[] }


export type Field = {
    name: string;
    data_type: DocumentDataType;
}

export class DataSchema {
    schema_name: string;
    header_schema: Field[];
    item_schema: Field[];

    constructor(schema_name: string, header_schema: Field[], item_schema: Field[]) {
        this.schema_name = schema_name;
        this.header_schema = header_schema;
        this.item_schema = item_schema;
    }

    static fromJson(json: {schema_name: string, header_schema: Field[], item_schema: Field[]}): DataSchema {
        return new DataSchema(
            json.schema_name,
            json.header_schema,
            json.item_schema,
        );
    }
}
