
import { DataSchema } from "./DataSchema";
import { Font } from "./Font";
import { LayoutSchema } from "./LayoutSchema";
import { Margin } from "./Margin";
import { Resume } from "./Resume";
import { ResumeLayout } from "./ResumeLayout";
import { Storage } from "./Storage";
export class LocalStorage implements Storage {
    async initiate_storage(): Promise<void> {
        if (!localStorage.getItem("resumes")) {
            fetch("https://d2bnplhbawocbk.cloudfront.net/data/resumes/resume2.json").then((response) => {
                response.json().then((resume) => {
                    localStorage.setItem("resumes", JSON.stringify([{ name: "resume2", data: resume }]));
                });
            });
        }

        if (!localStorage.getItem("data_schemas")) {
            fetch("https://d2bnplhbawocbk.cloudfront.net/data/data-schemas.json").then((response) => {
                response.json().then((data_schemas) => {
                    localStorage.setItem("data_schemas", JSON.stringify(data_schemas));
                });
            });
        }

        if (!localStorage.getItem("section_layouts")) {
            fetch("https://d2bnplhbawocbk.cloudfront.net/data/layout-schemas.json").then((response) => {
                response.json().then((section_layouts) => {
                    localStorage.setItem("section_layouts", JSON.stringify(section_layouts));
                });
            });
        }

        if (!localStorage.getItem("resume_layouts")) {
            const response = await fetch("https://d2bnplhbawocbk.cloudfront.net/data/resume-layouts.json");
            const resume_layouts = await response.json();
            console.log(resume_layouts);
            localStorage.setItem("resume_layouts", JSON.stringify(resume_layouts));
            return Promise.resolve();
        }

    }
    list_resumes(): Promise<string[]> {
        const resumes = JSON.parse(localStorage.getItem("resumes") || "[]").map((resume: any) => resume.name);
        return Promise.resolve(resumes);
    }
    list_data_schemas(): Promise<string[]> {
        const schemas = JSON.parse(localStorage.getItem("data_schemas") || "[]").map((schema: any) => schema.schema_name);
        return Promise.resolve(schemas);
    }
    list_layout_schemas(): Promise<string[]> {
        const schemas = JSON.parse(localStorage.getItem("section_layouts") || "[]").map((schema: any) => schema.schema_name);
        return Promise.resolve(schemas);
    }
    list_resume_layouts(): Promise<string[]> {
        const schemas = JSON.parse(localStorage.getItem("resume_layouts") || "[]").map((schema: any) => schema.schema_name);
        return Promise.resolve(schemas);
    }
    load_resume(resume_name: string): Promise<Resume> {
        console.log(resume_name);
        const resume = JSON.parse(localStorage.getItem("resumes") || "[]").find((resume: any) => resume.name === resume_name);
        if (!resume) {
            throw new Error("Resume not found");
        }
        return Promise.resolve(Resume.fromJson(resume.data));
    }
    load_data_schema(schema_name: string): Promise<DataSchema> {
        const schema = JSON.parse(localStorage.getItem("data_schemas") || "[]").find((schema: any) => schema.schema_name === schema_name);
        if (!schema) {
            throw new Error("Data schema not found");
        }
        return Promise.resolve(DataSchema.fromJson(schema));
    }
    load_layout_schema(schema_name: string): Promise<LayoutSchema> {
        const schema = JSON.parse(localStorage.getItem("section_layouts") || "[]").find((schema: any) => schema.schema_name === schema_name);
        console.info(schema);
        console.info(schema_name);
        console.info(localStorage.getItem("section_layouts"));
        if (!schema) {
            throw new Error("Layout schema not found");
        }
        return Promise.resolve(LayoutSchema.fromJson(schema));
    }
    load_resume_layout(schema_name: string): Promise<ResumeLayout> {
        console.log(schema_name);
        const schema = JSON.parse(localStorage.getItem("resume_layouts") || "[]").find((schema: any) => schema.schema_name === schema_name);
        if (!schema) {
            throw new Error("Resume layout not found");
        }
        console.info(schema);
        return Promise.resolve(ResumeLayout.fromJson(schema));
    }
    save_resume(resume_name: string, resume_data: Resume): Promise<void> {
        const resumes = JSON.parse(localStorage.getItem("resumes") || "[]");
        const resume = resumes.find((resume: any) => resume.name === resume_name);
        if (!resume) {
            resumes.push({ name: resume_name, data: resume_data.toJson() });
        } else {
            resume.data = resume_data.toJson();
        }
        localStorage.setItem("resumes", JSON.stringify(resumes));
        return Promise.resolve();
    }
    save_data_schema(data_schema: DataSchema): Promise<void> {
        throw new Error("Method not implemented.");
    }
    save_layout_schema(layout_schema: LayoutSchema): Promise<void> {
        throw new Error("Method not implemented.");
    }
    save_resume_layout(resume_layout: ResumeLayout): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async load_font(font: Font): Promise<Buffer> {
        const path = `fonts/${font.full_name()}.ttf`;
        if (!localStorage.getItem(path)) {
            const response = await fetch(`https://d2bnplhbawocbk.cloudfront.net/data/${path}`);
            const font_data = await response.arrayBuffer();
            return Buffer.from(font_data);
        }

        throw new Error("Font not found");
    }
}
