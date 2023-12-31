"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutSchema = void 0;
const Layout_1 = require("./Layout");
class LayoutSchema {
    constructor(schema_name, header_layout_schema, item_layout_schema) {
        this.schema_name = schema_name;
        this.header_layout_schema = header_layout_schema;
        this.item_layout_schema = item_layout_schema;
    }
    static fromJson(json) {
        return new LayoutSchema(json.schema_name, Layout_1.SectionLayout.fromJson(json.header_layout_schema), Layout_1.SectionLayout.fromJson(json.item_layout_schema));
    }
    fonts() {
        return [
            ...this.header_layout_schema.fonts(),
            ...this.item_layout_schema.fonts(),
        ];
    }
}
exports.LayoutSchema = LayoutSchema;
