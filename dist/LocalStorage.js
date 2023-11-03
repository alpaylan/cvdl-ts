"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const DataSchema_1 = require("./DataSchema");
const LayoutSchema_1 = require("./LayoutSchema");
const Resume_1 = require("./Resume");
const ResumeLayout_1 = require("./ResumeLayout");
class LocalStorage {
    async initiate_storage() {
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
    list_resumes() {
        const resumes = JSON.parse(localStorage.getItem("resumes") || "[]").map((resume) => resume.name);
        return Promise.resolve(resumes);
    }
    list_data_schemas() {
        const schemas = JSON.parse(localStorage.getItem("data_schemas") || "[]").map((schema) => schema.schema_name);
        return Promise.resolve(schemas);
    }
    list_layout_schemas() {
        const schemas = JSON.parse(localStorage.getItem("section_layouts") || "[]").map((schema) => schema.schema_name);
        return Promise.resolve(schemas);
    }
    list_resume_layouts() {
        const schemas = JSON.parse(localStorage.getItem("resume_layouts") || "[]").map((schema) => schema.schema_name);
        return Promise.resolve(schemas);
    }
    load_resume(resume_name) {
        console.log(resume_name);
        const resume = JSON.parse(localStorage.getItem("resumes") || "[]").find((resume) => resume.name === resume_name);
        if (!resume) {
            throw new Error("Resume not found");
        }
        return Promise.resolve(Resume_1.Resume.fromJson(resume.data));
    }
    load_data_schema(schema_name) {
        const schema = JSON.parse(localStorage.getItem("data_schemas") || "[]").find((schema) => schema.schema_name === schema_name);
        if (!schema) {
            throw new Error("Data schema not found");
        }
        return Promise.resolve(DataSchema_1.DataSchema.fromJson(schema));
    }
    load_layout_schema(schema_name) {
        const schema = JSON.parse(localStorage.getItem("section_layouts") || "[]").find((schema) => schema.schema_name === schema_name);
        console.info(schema);
        console.info(schema_name);
        console.info(localStorage.getItem("section_layouts"));
        if (!schema) {
            throw new Error("Layout schema not found");
        }
        return Promise.resolve(LayoutSchema_1.LayoutSchema.fromJson(schema));
    }
    load_resume_layout(schema_name) {
        console.log(schema_name);
        const schema = JSON.parse(localStorage.getItem("resume_layouts") || "[]").find((schema) => schema.schema_name === schema_name);
        if (!schema) {
            throw new Error("Resume layout not found");
        }
        console.info(schema);
        return Promise.resolve(ResumeLayout_1.ResumeLayout.fromJson(schema));
    }
    save_resume(resume_name, resume_data) {
        const resumes = JSON.parse(localStorage.getItem("resumes") || "[]");
        const resume = resumes.find((resume) => resume.name === resume_name);
        if (!resume) {
            resumes.push({ name: resume_name, data: resume_data.toJson() });
        }
        else {
            resume.data = resume_data.toJson();
        }
        localStorage.setItem("resumes", JSON.stringify(resumes));
        return Promise.resolve();
    }
    save_data_schema(data_schema) {
        throw new Error("Method not implemented.");
    }
    save_layout_schema(layout_schema) {
        throw new Error("Method not implemented.");
    }
    save_resume_layout(resume_layout) {
        throw new Error("Method not implemented.");
    }
    async load_font(font) {
        const path = `fonts/${font.full_name()}.ttf`;
        if (!localStorage.getItem(path)) {
            const response = await fetch(`https://d2bnplhbawocbk.cloudfront.net/data/${path}`);
            const font_data = await response.arrayBuffer();
            return Buffer.from(font_data);
        }
        throw new Error("Font not found");
    }
}
exports.LocalStorage = LocalStorage;
