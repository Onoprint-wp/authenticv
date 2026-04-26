/**
 * Script utilitaire : génère un fichier DOCX minimal pour les tests d'upload.
 * 
 * Exécution : node tests/fixtures/generate-docx.cjs
 * 
 * Ce script crée un fichier .docx valide (format Open XML)
 * contenant un mini CV pour tester la route POST /api/upload.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Un fichier DOCX est un ZIP contenant des fichiers XML.
// On crée un DOCX minimal valide manuellement.

// Utiliser l'approche la plus simple : créer un fichier avec le header DOCX
// Pour un vrai DOCX, on utilise le format PK (ZIP) avec le bon content type

const JSZip = (() => {
  try {
    return require("jszip");
  } catch {
    console.log("📦 Installing jszip...");
    execSync("npm install --no-save jszip", { cwd: path.join(__dirname, "../..") });
    return require("jszip");
  }
})();

async function generateDocx() {
  const zip = new JSZip();

  // [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // word/document.xml — un mini CV
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Jean Dupont</w:t></w:r></w:p>
    <w:p><w:r><w:t>Développeur Full Stack</w:t></w:r></w:p>
    <w:p><w:r><w:t>jean.dupont@email.com | +33 6 12 34 56 78 | Paris, France</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>EXPÉRIENCE PROFESSIONNELLE</w:t></w:r></w:p>
    <w:p><w:r><w:t>Développeur Senior - Accenture (2021-2024)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Développement d'applications web modernes avec React, Node.js et TypeScript.</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>FORMATION</w:t></w:r></w:p>
    <w:p><w:r><w:t>Master Informatique - Université Paris-Saclay (2019-2021)</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>COMPÉTENCES</w:t></w:r></w:p>
    <w:p><w:r><w:t>React, TypeScript, Node.js, PostgreSQL, Docker, Git</w:t></w:r></w:p>
  </w:body>
</w:document>`
  );

  // word/_rels/document.xml.rels
  zip.file(
    "word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`
  );

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  const outputPath = path.join(__dirname, "sample-cv.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ DOCX fixture generated: ${outputPath} (${buffer.length} bytes)`);
}

generateDocx().catch(console.error);
