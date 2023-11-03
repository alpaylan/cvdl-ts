export declare class Resume {
    layout: string;
    sections: ResumeSection[];
    constructor(layout: string, sections: ResumeSection[]);
    static fromJson(resume: unknown): Resume;
    toJson(): unknown;
    static reducer(state: Resume, action: {
        type: string;
        payload: unknown;
    }): Resume;
    data_schemas(): string[];
    layout_schemas(): string[];
    resume_layout(): string;
}
export declare class ResumeSection {
    section_name: string;
    data_schema: string;
    layout_schema: string;
    data: Map<ItemName, ItemContent>;
    items: Map<ItemName, ItemContent>[];
    constructor();
    toJson(): unknown;
    static fromJson(json: unknown): ResumeSection;
}
export type ItemName = string;
export type ItemContent = {
    tag: "None";
} | {
    tag: "String";
    value: string;
} | {
    tag: "List";
    value: ItemContent[];
} | {
    tag: "Url";
    value: {
        url: string;
        text: string;
    };
};
export declare namespace ItemContent {
    function fromJson(json: unknown): ItemContent;
    function None(): ItemContent;
    function toString(item: ItemContent): string;
}
