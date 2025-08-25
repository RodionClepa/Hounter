const fs = require("fs-extra");

async function copyFolders() {
  const folders = ["fonts", "img", "src"];
  for (const folder of folders) {
    await fs.copy(folder, `compressed/${folder}`);
  }
  console.log("✅ Assets copied to compressed/");
}

copyFolders().catch((err) => {
  console.error("❌ Error copying assets:", err);
  process.exit(1);
});
