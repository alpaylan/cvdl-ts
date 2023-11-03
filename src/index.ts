
import { render } from "./PdfLayout";
import fs from "fs";
import { FileStorage } from "./FileStorage";

const fileStorage = new FileStorage("/Users/akeles/Programming/projects/cvdl/cvdl/projdir");
render("resume4", fileStorage).then(async (blob) => {
    const buffer = await blob.arrayBuffer()
    fs.writeFileSync("output.pdf", Buffer.from(buffer));
});

console.log();