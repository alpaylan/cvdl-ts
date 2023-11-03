import { Box } from "./Box";
import { DataSchema } from "./DataSchema";
import { Elem } from "./Layout";
import { LayoutSchema } from "./LayoutSchema";
import { Resume } from "./Resume";
import { ResumeLayout } from "./ResumeLayout";
import { Storage } from "./Storage";
import * as fontkit from 'fontkit';
export declare class ElementBox {
    bounding_box: Box;
    elements: [Box, Elem][];
    constructor(bounding_box: Box, elements: [Box, Elem][]);
    move_y_by(y: number): ElementBox;
    move_x_by(x: number): ElementBox;
}
export type RenderProps = {
    resume: Resume;
    layout_schemas: LayoutSchema[];
    data_schemas: DataSchema[];
    resume_layout: ResumeLayout;
    storage: Storage;
    fontDict?: FontDict;
};
export declare class FontDict {
    fonts: Map<string, fontkit.Font>;
    constructor();
    load_fonts_from_schema(schema: LayoutSchema, storage: Storage): Promise<void>;
    get_font(name: string): fontkit.Font;
}
export declare function render({ resume, layout_schemas, data_schemas, resume_layout, storage, fontDict }: RenderProps): Promise<[FontDict, ElementBox[][]]>;
