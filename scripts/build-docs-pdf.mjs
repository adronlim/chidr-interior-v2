// Combine all repo markdown into a single PDF via headless Chrome.
// Run: `yarn docs:pdf` → writes dist/chidr-interior-v2-docs.pdf
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ORDER = [
  { file: 'README.md',                 title: 'Overview' },
  { file: 'docs/ARCHITECTURE.md',      title: 'Architecture' },
  { file: 'docs/PROJECT-STRUCTURE.md', title: 'Project Structure' },
  { file: 'docs/DEVOPS.md',            title: 'DevOps' },
  { file: 'docs/GITHUB.md',            title: 'GitHub Workflow' },
  { file: 'docs/FRONTEND.md',          title: 'Frontend' },
  { file: 'docs/BACKEND.md',           title: 'Backend' },
  { file: 'docs/CMS.md',               title: 'CMS' },
  { file: 'docs/UI-MOCKUP.md',         title: 'UI Mockup' },
];

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
];

const css = `
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  html { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", system-ui, sans-serif; font-size: 10.5pt; line-height: 1.55; color: #1a1a1a; }
  body { margin: 0; }
  .cover { page-break-after: always; padding-top: 30vh; text-align: center; }
  .cover h1 { font-family: Georgia, "Cormorant Garamond", serif; font-weight: 500; font-size: 40pt; margin: 0 0 0.4em; letter-spacing: -0.02em; }
  .cover .subtitle { font-size: 13pt; color: #555; letter-spacing: 0.02em; }
  .cover .meta { margin-top: 5em; font-size: 9.5pt; color: #999; text-transform: uppercase; letter-spacing: 0.18em; }
  .toc { page-break-after: always; }
  .toc h1 { font-size: 22pt; margin: 0 0 1em; border: none; padding: 0; }
  .toc ol { padding-left: 1.4em; }
  .toc li { padding: 0.45em 0; font-size: 12pt; }
  .toc li .file { color: #999; font-family: ui-monospace, "SF Mono", "Menlo", monospace; font-size: 9.5pt; margin-left: 0.6em; }
  .toc a { color: #1a1a1a; text-decoration: none; }
  .doc { page-break-after: always; }
  .doc:last-child { page-break-after: auto; }
  h1 { font-size: 22pt; margin: 0 0 0.6em; border-bottom: 1px solid #d4cfc4; padding-bottom: 0.25em; letter-spacing: -0.015em; }
  h2 { font-size: 15pt; margin: 1.6em 0 0.6em; border-bottom: 1px solid #ece8df; padding-bottom: 0.2em; letter-spacing: -0.01em; page-break-after: avoid; }
  h3 { font-size: 12pt; margin: 1.4em 0 0.4em; page-break-after: avoid; }
  h4 { font-size: 10.5pt; margin: 1.2em 0 0.3em; page-break-after: avoid; }
  p { margin: 0.5em 0 0.8em; }
  code { font-family: ui-monospace, "SF Mono", "Menlo", monospace; font-size: 9.5pt; background: #f4f0e8; padding: 1px 5px; border-radius: 3px; }
  pre { background: #f4f0e8; padding: 10pt 12pt; border-radius: 4px; overflow: hidden; page-break-inside: avoid; margin: 0.8em 0; }
  pre code { background: none; padding: 0; font-size: 8.5pt; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
  table { border-collapse: collapse; margin: 1em 0; width: 100%; font-size: 9.5pt; page-break-inside: avoid; }
  th, td { border-bottom: 1px solid #e2dcd2; padding: 5pt 7pt; text-align: left; vertical-align: top; }
  th { background: #f8f5ef; font-weight: 600; }
  blockquote { border-left: 3px solid #a6814c; padding: 0.2em 1em; color: #555; margin: 1em 0; background: #faf7f1; }
  a { color: #8a6534; text-decoration: none; }
  hr { border: none; border-top: 1px solid #e2dcd2; margin: 1.8em 0; }
  ul, ol { padding-left: 1.4em; margin: 0.5em 0 0.8em; }
  li { margin: 0.2em 0; }
  img { max-width: 100%; }
`;

const today = new Date().toISOString().slice(0, 10);

const sections = await Promise.all(
  ORDER.map(async ({ file, title }) => {
    const md = await readFile(join(root, file), 'utf8');
    const html = marked.parse(md);
    return { title, file, html };
  }),
);

const toc = sections
  .map(
    (s, i) =>
      `<li><a href="#sec-${i}">${escapeHtml(s.title)}</a><span class="file">${escapeHtml(s.file)}</span></li>`,
  )
  .join('\n');

const body = sections
  .map((s, i) => `<section class="doc" id="sec-${i}">${s.html}</section>`)
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CH iDesign &amp; Renovation — Project Documentation</title>
  <style>${css}</style>
</head>
<body>
  <section class="cover">
    <h1>CH iDesign &amp; Renovation</h1>
    <div class="subtitle">chidr-interior-v2 — Project Documentation</div>
    <div class="meta">Generated ${today}</div>
  </section>
  <section class="toc">
    <h1>Contents</h1>
    <ol>${toc}</ol>
  </section>
  ${body}
</body>
</html>`;

const outDir = join(root, 'dist');
await mkdir(outDir, { recursive: true });
const htmlPath = join(outDir, 'docs.html');
const pdfPath = join(outDir, 'chidr-interior-v2-docs.pdf');
await writeFile(htmlPath, html, 'utf8');

const chrome = CHROME_CANDIDATES.find((p) => {
  try {
    // statSync would be cleaner but we already imported promises; spawnSync 'test' is portable enough
    return spawnSync('test', ['-x', p]).status === 0;
  } catch {
    return false;
  }
});

if (!chrome) {
  console.error('No headless-capable Chrome/Chromium/Edge found.');
  process.exit(1);
}

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=10000',
    '--print-to-pdf-no-header',
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ],
  { stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('Chrome exited with status', result.status);
  process.exit(1);
}

console.log(`PDF written: ${pdfPath}`);

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
