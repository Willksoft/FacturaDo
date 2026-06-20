const fs = require('fs');
const path = require('path');

function fixStore(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/typeof update === 'function' \? update/g, "typeof update === 'function' ? (update as any)");
    fs.writeFileSync(file, content);
}

fixStore(path.join(__dirname, '../src/stores/useCatalogStore.ts'));
fixStore(path.join(__dirname, '../src/stores/useFinanceStore.ts'));
fixStore(path.join(__dirname, '../src/stores/useConfigStore.ts'));

console.log("Fixed TS errors in stores.");
