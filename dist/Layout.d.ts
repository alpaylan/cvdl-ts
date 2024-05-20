import { Margin } from "./Margin";
import { Alignment } from "./Alignment";
import { Width } from "./Width";
import { Font } from "./Font";
import { ItemContent } from "./Resume";
import { Box } from "./Box";
import { ElementBox, FontDict } from "./AnyLayout";
import { Point } from "./Point";
export type ContainerType = Stack | Row;
export type LayoutType = Stack | Row | Elem;
export declare class SectionLayout {
    inner: Stack | Row | Elem;
    constructor(inner: Stack | Row | Elem);
    copy(): SectionLayout;
    static constrMap(tag: string): Stack | Row | Elem;
    static empty(): SectionLayout;
    static fromJson(json: any): SectionLayout;
    toJson(): any;
    width(): Width;
    is_container(): boolean;
    is_ref(): boolean;
    type_(): "Stack" | "Row" | "Elem";
    tag_(): "Stack" | "FlexRow" | "FrozenRow" | "Ref" | "Text";
    fonts(): Font[];
    with_margin(margin: Margin): SectionLayout;
    with_alignment(alignment: Alignment): SectionLayout;
    with_width(width: Width): SectionLayout;
    is_instantiated(): boolean;
    instantiate(section: Map<string, ItemContent>): SectionLayout;
    static instantiate_ref_element(element: Elem, section: Map<string, ItemContent>): SectionLayout;
    bound_width(width: number): SectionLayout;
    scale_width(document_width: number): SectionLayout;
    normalize(width: number, font_dict: FontDict): SectionLayout;
    fill_fonts(font_dict: FontDict): SectionLayout;
    break_lines(font_dict: FontDict): SectionLayout;
    compute_boxes(font_dict: FontDict): ElementBox;
    compute_textbox_positions(textbox_positions: [Box, Elem][], top_left: Point, font_dict: FontDict): number;
}
export declare class Stack {
    tag: "Stack";
    elements: SectionLayout[];
    margin: Margin;
    alignment: Alignment;
    width: Width;
    constructor(elements: SectionLayout[], margin?: Margin, alignment?: Alignment, width?: Width);
    static stack(elements: SectionLayout[], margin?: Margin, alignment?: Alignment, width?: Width): SectionLayout;
    copy(): Stack;
    static default_(): Stack;
    instantiate(section: Map<string, ItemContent>): Stack;
    with_elements(elements: SectionLayout[]): Stack;
    with_margin(margin: Margin): Stack;
    with_alignment(alignment: Alignment): Stack;
    with_width(width: Width): Stack;
    bound_width(width: number): Stack;
    scale_width(w: number): Stack;
}
export declare class Row {
    tag: "Row";
    elements: SectionLayout[];
    margin: Margin;
    alignment: Alignment;
    width: Width;
    is_frozen: boolean;
    constructor(elements: SectionLayout[], is_frozen?: boolean, margin?: Margin, alignment?: Alignment, width?: Width);
    static row(elements: SectionLayout[], is_frozen?: boolean, margin?: Margin, alignment?: Alignment, width?: Width): SectionLayout;
    copy(): Row;
    static default_(): Row;
    instantiate(section: Map<string, ItemContent>): Row;
    with_elements(elements: SectionLayout[]): Row;
    with_margin(margin: Margin): Row;
    with_alignment(alignment: Alignment): Row;
    with_width(width: Width): Row;
    elements_width(): number;
    bound_width(width: number): Row;
    scale_width(w: number): Row;
    break_lines(font_dict: FontDict): Row[];
}
export type Color = "Transparent" | "Light Yellow" | "Light Brown" | "Light Green" | "Light Beige" | "Light Blue" | "Blue";
export declare const ColorMap: {
    Transparent: string;
    "Light Yellow": string;
    "Light Brown": string;
    "Light Green": string;
    "Light Beige": string;
    "Light Blue": string;
    Blue: string;
};
export declare class Elem {
    tag: "Elem";
    item: string;
    url: string | null;
    is_ref: boolean;
    is_fill: boolean;
    text_width: Width;
    font: Font;
    margin: Margin;
    alignment: Alignment;
    width: Width;
    background_color: Color;
    constructor(item: string, url: string | null, is_ref: boolean, is_fill: boolean, text_width: Width, font: Font, margin: Margin, alignment: Alignment, width: Width, background_color: Color);
    static elem(item: string, url: string | null, is_ref: boolean, is_fill: boolean, text_width: Width, font: Font, margin: Margin, alignment: Alignment, width: Width, background_color: Color): SectionLayout;
    copy(): Elem;
    static default_(): Elem;
    with_item(item: string): Elem;
    as_ref(): Elem;
    with_font(font: Font): Elem;
    with_url(url: string): Elem;
    with_margin(margin: Margin): Elem;
    with_alignment(alignment: Alignment): Elem;
    with_width(width: Width): Elem;
    with_text_width(text_width: Width): Elem;
    with_is_fill(is_fill: boolean): Elem;
    scale_width(w: number): Elem;
    fill_fonts(fonts: FontDict): Elem;
    justified_lines(lines: Elem[], font_dict: FontDict): Row[];
    break_lines(font_dict: FontDict): LayoutType[];
    bound_width(width: number): Elem;
}
