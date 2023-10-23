
import { render } from "./PdfLayout";

import { LocalStorage } from "./LocalStorage";

const localStorage = new LocalStorage("/Users/akeles/Programming/projects/cvdl/cvdl/projdir");
render("resume2", localStorage);

console.log();
