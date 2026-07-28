import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const files = project.getSourceFiles("src/**/*.{ts,tsx}");

let modifiedCount = 0;

for (const sourceFile of files) {
  if (sourceFile.getFilePath().includes('CustomDialogProvider.tsx')) {
    continue;
  }
  
  let modified = false;
  let needsDialogImport = false;
  
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  
  for (const call of calls) {
    const expr = call.getExpression();
    const text = expr.getText();
    
    if (text === 'confirm' || text === 'window.confirm') {
      const parentFunc = call.getFirstAncestorByKind(SyntaxKind.ArrowFunction) || 
                         call.getFirstAncestorByKind(SyntaxKind.FunctionExpression) || 
                         call.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) ||
                         call.getFirstAncestorByKind(SyntaxKind.MethodDeclaration);
                         
      if (parentFunc && !parentFunc.isAsync()) {
        parentFunc.setIsAsync(true);
      }
      
      expr.replaceWithText('await DialogService.confirm');
      needsDialogImport = true;
      modified = true;
    }
  }
  
  if (needsDialogImport) {
    const importDecl = sourceFile.getImportDeclaration(decl => {
        const path = decl.getModuleSpecifierValue();
        return path.includes('CustomDialogProvider');
    });
    
    if (!importDecl) {
      const filePath = sourceFile.getFilePath();
      const depth = filePath.split('src/')[1].split('/').length - 1;
      const relativePrefix = depth === 0 ? './' : '../'.repeat(depth);
      const importPath = `${relativePrefix}components/ui/CustomDialogProvider`;
      
      sourceFile.addImportDeclaration({
        namedImports: ['DialogService'],
        moduleSpecifier: importPath
      });
    } else {
        const hasDialogService = importDecl.getNamedImports().some(n => n.getName() === 'DialogService');
        if (!hasDialogService) {
            importDecl.addNamedImport('DialogService');
        }
    }
  }
  
  if (modified) {
    sourceFile.saveSync();
    modifiedCount++;
    console.log(`Refactored: ${sourceFile.getFilePath()}`);
  }
}

console.log(`\nRefactoring complete! Modified ${modifiedCount} files.`);
