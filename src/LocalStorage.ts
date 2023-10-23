/* eslint-disable @typescript-eslint/no-explicit-any */

/// This module provides the abstractions for interacting with persistent storage.
/// The library follows the directory structure below:
///
/// projectdir/com.cvdl.cvdl/
/// ├── data/
///        ├── resumes
///             ├── resume1.json
///             ├── resume2.json
///        ├── data-schemas.json
///        ├── layout-schemas.json
///        |── resume-layouts.json
///
/// The resume.json files contain the resume information, as well as references to the
/// schema names.
///
/// This module provides 3 types of functionalities for all 4 data types:
///     1. List
///     2. Load
///     3. Save

// Initiation Function
import fs from "fs";
import { Resume } from "./Resume";
import { DataSchema } from "./DataSchema";
import { LayoutSchema } from "./LayoutSchema";
import { ResumeLayout } from "./ResumeLayout";

export class LocalStorage {
    dir: string;

    constructor(dir: string) {
        this.dir = dir;
    }

    initiate_local_storage() {
        // Create data_dir/resumes if it does not exist
        fs.mkdirSync(this.dir + "/resumes", { recursive: true });

        // Create data_dir/data-schemas.json if it does not exist
        if (!fs.existsSync(this.dir + "/data-schemas.json")) {
            fs.writeFileSync(this.dir + "/data-schemas.json", "[]");
        }
        // Create data_dir/layout-schemas.json if it does not exist
        if (!fs.existsSync(this.dir + "/layout-schemas.json")) {
            fs.writeFileSync(this.dir + "/layout-schemas.json", "[]");
        }
        // Create data_dir/resume-layouts.json if it does not exist
        if (!fs.existsSync(this.dir + "/resume-layouts.json")) {
            fs.writeFileSync(this.dir + "/resume-layouts.json", "[]");
        }
    }

    list_resumes(): string[] {
        const files = fs.readdirSync(this.dir + "/resumes");
        return files.map(file => file.replace(".json", ""));
    }

    list_data_schemas(): string[] {
        const data_schemas = fs.readFileSync(this.dir + "/data-schemas.json");
        return JSON.parse(data_schemas.toString()).map((schema: any) => schema.schema_name);
    }

    list_layout_schemas(): string[] {
        const layout_schemas = fs.readFileSync(this.dir + "/layout-schemas.json");
        return JSON.parse(layout_schemas.toString()).map((schema: any) => schema.schema_name);
    }

    list_resume_layouts(): string[] {
        const resume_layouts = fs.readFileSync(this.dir + "/resume-layouts.json");
        return JSON.parse(resume_layouts.toString()).map((schema: any) => schema.schema_name);
    }


    // Loading Functions

    load_resume(resume_name: string): Resume {
        const resume = fs.readFileSync(this.dir + "/resumes/" + resume_name + ".json");
        return new Resume(JSON.parse(resume.toString()));
    }

    load_data_schema(schema_name: string): DataSchema {
        const data_schemas = fs.readFileSync(this.dir + "/data-schemas.json");
        return DataSchema.fromJson(JSON.parse(data_schemas.toString()).find((schema: any) => schema.schema_name === schema_name));
    }

    load_layout_schema(schema_name: string): LayoutSchema {
        const layout_schemas = fs.readFileSync(this.dir + "/layout-schemas.json");
        return LayoutSchema.fromJson(JSON.parse(layout_schemas.toString()).find((schema: any) => schema.schema_name === schema_name));
    }

    load_resume_layout(schema_name: string): ResumeLayout {
        const resume_layouts = fs.readFileSync(this.dir + "/resume-layouts.json");
        return ResumeLayout.fromJson(JSON.parse(resume_layouts.toString()).find((schema: any) => schema.schema_name === schema_name));
    }


    // Saving Functions

    save_resume(resume_name: string, resume_data: Resume) {
        fs.writeFileSync(this.dir + "/resumes/" + resume_name + ".json", JSON.stringify(resume_data));
    }

    save_data_schema(data_schema: DataSchema) {
        const data_schemas = fs.readFileSync(this.dir + "/data-schemas.json");
        const data_schemas_json = JSON.parse(data_schemas.toString());
        const index = data_schemas_json.findIndex((schema: any) => schema.schema_name === data_schema.schema_name);
        if (index !== -1) {
            data_schemas_json[index] = data_schema;
        } else {
            data_schemas_json.push(data_schema);
        }
        fs.writeFileSync(this.dir + "/data-schemas.json", JSON.stringify(data_schemas_json));
    }

    save_layout_schema(layout_schema: LayoutSchema) {
        const layout_schemas = fs.readFileSync(this.dir + "/layout-schemas.json");
        const layout_schemas_json = JSON.parse(layout_schemas.toString());
        const index = layout_schemas_json.findIndex((schema: any) => schema.schema_name === layout_schema.schema_name);
        if (index !== -1) {
            layout_schemas_json[index] = layout_schema;
        } else {
            layout_schemas_json.push(layout_schema);
        }
        fs.writeFileSync(this.dir + "/layout-schemas.json", JSON.stringify(layout_schemas_json));
    }

    save_resume_layout(resume_layout: ResumeLayout) {
        const resume_layouts = fs.readFileSync(this.dir + "/resume-layouts.json");
        const resume_layouts_json = JSON.parse(resume_layouts.toString());
        const index = resume_layouts_json.findIndex((schema: any) => schema.schema_name === resume_layout.schema_name);
        if (index !== -1) {
            resume_layouts_json[index] = resume_layout;
        } else {
            resume_layouts_json.push(resume_layout);
        }
        fs.writeFileSync(this.dir + "/resume-layouts.json", JSON.stringify(resume_layouts_json));
    }
}
