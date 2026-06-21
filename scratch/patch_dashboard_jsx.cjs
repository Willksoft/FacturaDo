const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/dashboard/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="text-[9px] text-red-800 font-bold uppercase mb-1">> 90 Días</div>`;
const replacement = `<div className="text-[9px] text-red-800 font-bold uppercase mb-1">&gt; 90 Días</div>`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Fixed JSX syntax error in Dashboard.tsx");
} else {
    console.log("Could not find the target string in Dashboard.tsx");
}
