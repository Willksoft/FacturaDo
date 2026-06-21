const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/features/billing/DocumentEditView.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. In handleAddItem, ensure imageUrl and showImage are set when adding a product
const addTarget = `        discount: currentLineDiscount,
      };
      setItems([...items, newItem]);`;
const addReplacement = `        discount: currentLineDiscount,
        imageUrl: prod ? prod.imageUrl : undefined,
        showImage: templateSettings?.showProductPhotos !== false,
      };
      setItems([...items, newItem]);`;
if (content.includes(addTarget)) {
    content = content.replace(addTarget, addReplacement);
}

// 2. Add an inline toggle or checkbox to the item row for showImage
const rowTarget = `                              <Input
                                value={it.name}
                                onChange={(e) => handleUpdateLineName(idx, e.target.value)}
                                className="w-full h-8 px-2 text-xs border-neutral-250 rounded font-semibold bg-white"
                              />
                              {prod ? (`;
const rowReplacement = `                              <div className="flex gap-2 items-center">
                                {templateSettings?.showProductPhotos && it.imageUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...items];
                                      updated[idx].showImage = !updated[idx].showImage;
                                      setItems(updated);
                                    }}
                                    title={it.showImage !== false ? "Ocultar foto en el PDF" : "Mostrar foto en el PDF"}
                                    className={\`shrink-0 w-8 h-8 rounded border \${it.showImage !== false ? 'border-indigo-500 ring-1 ring-indigo-500 opacity-100' : 'border-neutral-200 opacity-40 grayscale'} overflow-hidden transition-all\`}
                                  >
                                    <img src={it.imageUrl} alt="img" className="w-full h-full object-cover" />
                                  </button>
                                )}
                                <Input
                                  value={it.name}
                                  onChange={(e) => handleUpdateLineName(idx, e.target.value)}
                                  className="w-full h-8 px-2 text-xs border-neutral-250 rounded font-semibold bg-white"
                                />
                              </div>
                              {prod ? (`;
if (content.includes(rowTarget)) {
    content = content.replace(rowTarget, rowReplacement);
}

fs.writeFileSync(file, content);
console.log('DocumentEditView.tsx patched with product image thumbnail toggle');
