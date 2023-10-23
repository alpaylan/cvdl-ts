import { Box } from "./Box";
import { DataSchema } from "./DataSchema";
import { Font } from "./Font";
import { Elem } from "./Layout";
import { LayoutSchema } from "./LayoutSchema";
import { Resume } from "./Resume";
import { vertical_margin, ResumeLayout } from "./ResumeLayout";
import fs from 'fs';
import fontkit from 'fontkit';
export class ElementBox {
    bounding_box: Box;
    elements: [Box, Elem][];

    constructor(bounding_box: Box, elements: [Box, Elem][]) {
        this.bounding_box = bounding_box;
        this.elements = elements;
    }

    move_y_by(y: number): ElementBox {
        this.bounding_box = this.bounding_box.move_y_by(y);
        this.elements = this
            .elements
            .map(([b, e]) => ([b.move_y_by(y), e]));
        return this;
    }

    move_x_by(x: number): ElementBox {
        this.bounding_box = this.bounding_box.move_x_by(x);
        this.elements = this
            .elements
            .map(([b, e]) => ([b.move_x_by(x), e]));
        return this;
    }
}

export type RenderProps = {
    resume: Resume,
    layout_schemas: LayoutSchema[],
    data_schemas: DataSchema[],
    resume_layout: ResumeLayout,
}

export class FontDict {
    fonts: Map<string, Buffer>;

    constructor() {
        this.fonts = new Map();
    }

    load_font_from_path(name: string, path: string) {
        const data = fs.readFileSync(path);
        // const font = fontkit.create(data);
        this.fonts.set(name, data);
    }
    async load_fonts_from_schema(schema: LayoutSchema) {
        for (const font of schema.fonts()) {
            console.log(`Loading font ${font.full_name()}`);
            if (this.fonts.has(font.full_name())) {
                console.log(`Font ${font.full_name()} is already loaded`);
                continue;
            }
            console.log(`SOurce ${font.source}`);
            switch (font.source) {
                case "Local":
                    this.load_font_from_path(
                        font.full_name(),
                        `assets/${font.name}/static/${font.full_name()}.ttf`
                    );
                    break;
                case "System":
                    throw new Error("System fonts are not supported yet");
                case "Remote": {
                    const response = await fetch(`https://gwfh.mranftl.com/api/fonts/${font.name.toLowerCase()}?subsets=latin`);
                    if (response.ok) {
                        const data = await response.json();
                        for (const variant of data.variants) {
                            console.log(`Loading font ${font.full_name()}`);
                            console.log(`Font style: ${variant.fontStyle}, FontWeight: ${variant.fontWeight}`);
                            if (variant.fontStyle === font.style.toLowerCase() && variant.fontWeight === font.weight) {
                                const response = await fetch(`${variant.ttf}`);
                                if (response.ok) {
                                    const data = await response.arrayBuffer();
                                    // const fontData = fontkit.create(Buffer.from(data));
                                    this.fonts.set(font.full_name(), Buffer.from(data));
                                } else {
                                    throw new Error(`Could not load font ${font.name}`);

                                }
                            }
                        }
                    } else {
                        throw new Error(`Could not load font ${font.name}`);
                    }
                }
            }
        }
    }

    get_font(name: string) {
        const font = this.fonts.get(name);
        if (font === undefined) {
            throw new Error(`Could not find font ${name}`);
        }
        return font;
    }
}

export async function render({ resume, layout_schemas, data_schemas, resume_layout }: RenderProps): Promise<[FontDict, ElementBox[][]]> {
    // Each box contains a set of elements(positioned by 0x0 and projected into its bounding box)
    const boxes: ElementBox[] = [];
    const font_dict = new FontDict();

    // Compute the total usable width by subtracting the margins from the document width
    const width = resume_layout.width - (resume_layout.margin.left + resume_layout.margin.right);

    // If the resume is double column, then the usable width is halved
    const column_width = resume_layout.column_type.tag === "SingleColumn"
        ? width
        : (width - vertical_margin(resume_layout.column_type) / 2.0);

    for (const section of resume.sections) {
        // Render Section Header
        // 1. Find the layout schema for the section
        console.log("Computing section: ", section.section_name);

        const layout_schema = layout_schemas
            .find(s => s.schema_name === section.layout_schema);

        if (layout_schema === undefined) {
            throw new Error(`Could not find layout schema ${section.layout_schema}`);
        }

        // 2. Find the data schema for the section
        const _data_schema = data_schemas.find(s => s.schema_name === section.data_schema);

        if (_data_schema === undefined) {
            throw new Error(`Could not find data schema ${section.data_schema}`);
        }

        // 3. Render the header
        const result = layout_schema
            .header_layout_schema
            .instantiate(section.data)
            .normalize(column_width, font_dict)
            .compute_boxes(font_dict);

        boxes.push(result);

        // Render Section Items
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of section.items.entries()) {
            console.log("Computing item");
            // 1. Find the layout schema for the section
            const layout_schema = layout_schemas
                .find((s) => s.schema_name == section.layout_schema);

            if (layout_schema == undefined) {
                throw new Error(`Could not find layout schema ${section.layout_schema}`);
            }
            await font_dict.load_fonts_from_schema(layout_schema);
            // 2. Find the data schema for the section
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _data_schema = data_schemas
                .find((s) => s.schema_name == section.data_schema)
            // 3. Render the item
            const result = layout_schema
                .item_layout_schema
                .instantiate(item)
                .normalize(column_width, font_dict)
                .compute_boxes(font_dict);

            boxes.push(result);
        }
    }
    
    let current_y = resume_layout.margin.top;
    let current_x = resume_layout.margin.left;

    const pages: ElementBox[][] = []
    pages.push([]);

    for (const box of boxes) {
        if (current_y + box.bounding_box.height() > resume_layout.height) {
            current_y = resume_layout.margin.top;
            current_x += column_width + vertical_margin(resume_layout.column_type);
            if (current_x > width) {
                pages.push([]);
                current_x = resume_layout.margin.left;
            }
        }
        pages[pages.length - 1].push(box.move_y_by(current_y).move_x_by(current_x));
        current_y += box.bounding_box.height();
    }

    console.log("Position calculations are completed.");

    return [font_dict, pages];
}
