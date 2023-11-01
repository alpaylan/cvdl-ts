
import { render } from "./PdfLayout";
import fs from "fs";
import { LocalStorage } from "./LocalStorage";

const localStorage = new LocalStorage("/Users/akeles/Programming/projects/cvdl/cvdl/projdir");
render("resume4", localStorage).then(async (blob) => {
    const buffer = await blob.arrayBuffer()
    fs.writeFileSync("output.pdf", Buffer.from(buffer));
});

console.log();