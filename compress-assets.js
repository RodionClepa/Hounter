const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const compressing = require("compressing");

const baseDir = __dirname; // Root of your project
const targetDir = baseDir; // Scan files starting from here
const outputDir = path.join(baseDir, "compressed"); // Where compressed files go

const outputExtensions = [".js", ".css", ".html", ".json"];
const EXCLUDE_DIRS = new Set([
  "node_modules",
  "scss",
  "src",
  "fonts",
  "img",
  "compressed",
]);

// Recursively collect eligible files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (outputExtensions.includes(path.extname(entry.name))) {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

// Compress using Brotli
function brotliCompressFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    const brotli = zlib.createBrotliCompress({
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    });

    input.pipe(brotli).pipe(output).on("finish", resolve).on("error", reject);
  });
}

// Compress using Gzip
async function gzipCompressFile(inputPath, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await compressing.gzip.compressFile(inputPath, outputPath);
}

(async () => {
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Target directory "${targetDir}" does not exist.`);
    process.exit(1);
  }

  const files = getAllFiles(targetDir);

  if (files.length === 0) {
    console.log("⚠️  No matching files found to compress.");
    return;
  }

  for (const originalFile of files) {
    const relativePath = path.relative(baseDir, originalFile);
    const gzipPath = path.join(outputDir, `${relativePath}.gz`);
    const brotliPath = path.join(outputDir, `${relativePath}.br`);

    await gzipCompressFile(originalFile, gzipPath);
    await brotliCompressFile(originalFile, brotliPath);

    console.log(`✅ Compressed: ${relativePath}`);
  }

  console.log(`\n🎉 All compressed files saved to "${outputDir}"`);
})();
