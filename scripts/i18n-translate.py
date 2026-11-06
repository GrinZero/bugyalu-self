"""Optional machine-translation seed; sends pending public website text to Google.
Cached translations and curated overrides are retained. Run i18n:extract first.
"""
import json
import re
import time
import subprocess
import urllib.parse
from pathlib import Path

root = Path(__file__).resolve().parents[1]
path = root / 'src/i18n/en.json'
catalog = json.loads(path.read_text())
overrides = json.loads((root / 'src/i18n/en.overrides.json').read_text())
strings = json.loads((root / 'src/i18n/pending.json').read_text())
missing = [text for text in strings if text not in catalog and text not in overrides]
batches = []
for text in missing:
    if not batches or sum(len(s) + 12 for s in batches[-1]) + len(text) > 1400:
        batches.append([])
    batches[-1].append(text)

for index, batch in enumerate(batches, 1):
    query = '\n'.join(f'[{i:05}]\n{text}' for i, text in enumerate(batch))
    url = 'https://translate.google.com/translate_a/single?' + urllib.parse.urlencode(
        dict(client='gtx', sl='zh-CN', tl='en', dt='t', q=query))
    for attempt in range(4):
        try:
            response = subprocess.run(['curl', '--fail', '--silent', '--show-error', '--max-time', '45', url], capture_output=True, text=True, check=True)
            data = json.loads(response.stdout)
            translated = ''.join(item[0] for item in data[0] if item[0])
            parts = re.split(r'\[\s*(\d{5})\s*\]', translated)
            entries = {int(parts[i]): parts[i + 1].strip() for i in range(1, len(parts), 2)}
            if set(entries) != set(range(len(batch))) or not all(entries.values()):
                raise ValueError('Translation markers changed; refusing an ambiguous mapping')
            for i, text in enumerate(batch):
                catalog[text] = entries[i]
            path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2, sort_keys=True) + '\n')
            print(f'Batch {index}/{len(batches)} saved ({len(catalog)} cached strings)', flush=True)
            break
        except (subprocess.CalledProcessError, TimeoutError) as error:
            if attempt == 3:
                raise SystemExit(f'Translation paused: {error}. Rerun to resume cached work.')
            delay = 30 * (attempt + 1)
            print(f'Translation unavailable ({error}); retrying in {delay}s', flush=True)
            time.sleep(delay)
    time.sleep(1)
