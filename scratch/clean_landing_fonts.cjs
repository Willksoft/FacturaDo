const fs = require('fs');
const path = 'c:/Users/MANUEL GRAPHICS/Downloads/facturado/src/features/auth/LandingAndAuth.tsx';

let content = fs.readFileSync(path, 'utf8');

// Replace font-extrabold with font-medium
content = content.replace(/font-extrabold/g, 'font-medium');

// Replace font-bold with font-medium
content = content.replace(/font-bold/g, 'font-medium');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully cleaned landing page font weights to font-medium');
