const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/ai/AIAssistantWidget.tsx');
let content = fs.readFileSync(file, 'utf8');

// The widget root div is:
// <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
// We will change bottom-6 to bottom-20 md:bottom-6 to clear the bottom nav on mobile
if (content.includes('fixed bottom-6 right-6 z-50')) {
  content = content.replace(
    'fixed bottom-6 right-6 z-50',
    'fixed bottom-24 md:bottom-6 right-6 z-50'
  );
  fs.writeFileSync(file, content);
  console.log("Updated AIAssistantWidget positioning");
} else {
  console.log("Root div for AI Assistant not found as expected");
}
