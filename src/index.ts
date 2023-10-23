
import { render } from "./PdfLayout";

import { LocalStorage } from "./LocalStorage";
import { Font } from "./Font";
import fontkit from "fontkit";
const localStorage = new LocalStorage("/Users/akeles/Programming/projects/cvdl/cvdl/projdir");
render("resume4", localStorage);

console.log();