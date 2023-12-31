/* eslint-disable @typescript-eslint/no-namespace */

export class Resume {
    layout: string;
    sections: ResumeSection[];

    constructor(layout: string, sections: ResumeSection[]) {
        this.layout = layout;
        this.sections = sections;
    }

    static fromJson(resume: unknown): Resume {
        console.log(resume);
        if (typeof resume !== "object") {
            throw new Error("Resume must be an object");
        }

        if (resume === null) {
            throw new Error("Resume must not be null");
        }

        if (!("layout" in resume) || !("sections" in resume)) {
            throw new Error("Resume must have a layout");
        }
        return new Resume(
            resume.layout as string,
            (resume.sections as unknown[]).map(section => ResumeSection.fromJson(section))
        );
    }

    toJson(): unknown {
        return {
            layout: this.layout,
            sections: this.sections.map(section => section.toJson()),
        };
    }

    static reducer(state: Resume, action: { type: string, payload: unknown }): Resume {
        switch (action.type) {
            case "update":
                return Resume.fromJson(action.payload);
            default:
                return state;
        }
    }
    data_schemas(): string[] {
        return this.sections.map(section => section.data_schema);
    }

    layout_schemas(): string[] {
        return this.sections.map(section => section.layout_schema);
    }

    resume_layout(): string {
        return this.layout;
    }
}

export class ResumeSection {
    section_name: string = "";
    data_schema: string = "";
    layout_schema: string = "";
    data: Map<ItemName, ItemContent> = new Map();
    items: Map<ItemName, ItemContent>[] = [];

    constructor() {
        this.section_name = "";
        this.data_schema = "";
        this.layout_schema = "";
        this.data = new Map();
        this.items = [];
    }

    toJson(): unknown {
        console.info(this);
        return {
            section_name: this.section_name,
            data_schema: this.data_schema,
            layout_schema: this.layout_schema,
            data: Object.fromEntries(this.data),
            items: this.items.map(item => Object.fromEntries(item)),
        };
    }


    static fromJson(json: unknown): ResumeSection {
        const section = new ResumeSection();

        if (typeof json !== "object") {
            throw new Error("ResumeSection must be an object");
        }

        if (json === null) {
            throw new Error("ResumeSection must not be null");
        }

        if (!("section_name" in json) || !("data_schema" in json) || !("layout_schema" in json) || !("data" in json) || !("items" in json)) {
            throw new Error("ResumeSection must have a section_name, data_schema, layout_schema, and data");
        }

        section.section_name = json.section_name as string;
        section.data_schema = json.data_schema as string;
        section.layout_schema = json.layout_schema as string;

        const data = new Map(Object.entries(json.data as { [key: string]: ItemContent }));
        // @ts-ignore
        section.data = new Map([...data].map(([key, value]) => [key, ItemContent.fromJson(value)] as [ItemName, ItemContent]));

        section.items = (json.items as { [key: ItemName]: ItemContent }[]).map(item => {
            const data = new Map(Object.entries(item));
            return new Map([...data].map(([key, value]) => [key, ItemContent.fromJson(value)] as [ItemName, ItemContent]));
        });
        return section;
    }
}

export type ItemName = string;

export type ItemContent =
    | { tag: "None" }
    | { tag: "String", value: string }
    | { tag: "List", value: ItemContent[] }
    | { tag: "Url", value: { url: string, text: string } }

export module ItemContent {
    // @ts-ignore
    export function fromJson(json: unknown): ItemContent {
        if (typeof json === "undefined" || json === null) {
            return { tag: "None" };
        }

        if (typeof json === "string") {
            return { tag: "String", value: json };
        }

        if (Array.isArray(json)) {
            return { tag: "List", value: json.map(fromJson) };
        }

        if (typeof json === "object" && ("tag" in json) && ("value" in json)) {
            switch (json.tag) {
                case "None":
                    return { tag: "None" };
                case "String":
                    return { tag: "String", value: json.value as string };
                case "List":
                    return { tag: "List", value: (json.value as ItemContent[]).map(fromJson) };
                case "Url":
                    return { tag: "Url", value: { url: (json.value as { url: string, text: string }).url, text: (json.value as { url: string, text: string }).text } };
            }

        } else if (typeof json === "object" && ("url" in json) && ("text" in json)) {
            return { tag: "Url", value: { url: json.url as string, text: json.text as string } };
        }


        throw new Error("ItemContent must be a string, an array, or an object");
    }

    export function None(): ItemContent {
        return { tag: "None" };
    }
    export function toString(item: ItemContent): string {
        if (item.tag === "None") {
            return "";
        } else if (item.tag === "String") {
            return item.value;
        } else if (item.tag === "List") {
            return item.value.map(toString).join(", ");
        } else if (item.tag === "Url") {
            return item.value.text;
        }
        return "";
    }
}