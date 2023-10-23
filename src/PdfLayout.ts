import PDFDocument from 'pdfkit';
import fs from 'fs';

import { render as anyRender } from "./AnyLayout";
import { LocalStorage } from "./LocalStorage";

export const render = (
    resume_name: string,
    localStorage: LocalStorage
) => {
    const resume = localStorage.load_resume(resume_name);

    const data_schemas = resume.data_schemas().map((schema) => localStorage.load_data_schema(schema));

    const layout_schemas = resume.layout_schemas().map((schema) => localStorage.load_layout_schema(schema));

    const resume_layout = localStorage.load_resume_layout(resume.resume_layout());

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'));


    const [font_dict, pages] =
        anyRender({ layout_schemas, resume, data_schemas, resume_layout });

    console.log("Constructing printpdf font dictionary...");

    console.log("Rendering the document...");
    // Render the boxes
    for (const [index, boxes] of pages.entries()) {
        if (index > 0) {
            doc.addPage();
        }

        boxes.forEach((box) => {
            const elements = box.elements;
            const bounding_box = box.bounding_box;
            for (const [box_, element] of elements) {
                console.debug(
                    `(${box_.top_left.x}, ${box_.top_left.y})(${box_.bottom_right.x}, ${box_.bottom_right.y}): ${element.item}`
                );
                doc.
                    font("/Users/akeles/Programming/projects/cvdl/cvdl/assets/Exo/static/Exo-Medium.ttf").
                    fontSize(element.font.size).
                    text(element.item, box_.top_left.x, box_.top_left.y);

            }
        });
    }
    console.log("Rendering is completed. Saving the document...");

    console.log("Document is saved to output.pdf");
    doc.end();
}