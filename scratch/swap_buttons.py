import re

app_file = r'c:\Users\MANUEL GRAPHICS\Downloads\facturado\src\App.tsx'
with open(app_file, 'r', encoding='utf-8') as f: content = f.read()

bell_regex = r'(\{\/\* Notification Bell \*\/\}.*?)(?=\{\/\* "\+" creation button with dropdown \*\/\})'
create_regex = r'(\{\/\* "\+" creation button with dropdown \*\/\}.*?)(?=<\/div>\s*\{\/\* RIGHT: COMPACT ACTION BUTTONS)'

bell_match = re.search(bell_regex, content, re.DOTALL)
create_match = re.search(create_regex, content, re.DOTALL)

if bell_match and create_match:
    bell_str = bell_match.group(1)
    create_str = create_match.group(1)
    new_content = content[:bell_match.start()] + create_str + '\n            ' + bell_str + content[create_match.end():]
    with open(app_file, 'w', encoding='utf-8') as f: f.write(new_content)
    print('Swapped successfully')
else:
    print('Failed to match')
