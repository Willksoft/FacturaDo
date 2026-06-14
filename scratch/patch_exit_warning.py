import re

with open('c:/Users/MANUEL GRAPHICS/Downloads/facturado/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Rename const setCurrentTab = ... to rawSetCurrentTab
content = content.replace('const setCurrentTab = (newTab: TabType) => {\\n    navigate(\\'/\\' + newTab);\\n  };', 'const rawSetCurrentTab = (newTab: TabType) => {\\n    navigate(\\'/\\' + newTab);\\n  };')

# 2. Rename checkAndNavigate declaration to setCurrentTab
content = content.replace('const checkAndNavigate = (destination: TabType) => {', 'const setCurrentTab = (destination: TabType) => {')

# 3. Rename checkAndNavigate calls to setCurrentTab
content = content.replace('checkAndNavigate(', 'setCurrentTab(')

# 4. In executeNavigation, change setCurrentTab(destination) to rawSetCurrentTab
content = content.replace('setCurrentTab(destination);\\n    setMobileMenuOpen(false);', 'rawSetCurrentTab(destination);\\n    setMobileMenuOpen(false);')

with open('c:/Users/MANUEL GRAPHICS/Downloads/facturado/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
