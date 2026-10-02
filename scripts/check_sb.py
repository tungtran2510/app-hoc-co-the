import os
import json
from supabase import create_client

env = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip('"\'')

url = env.get('NEXT_PUBLIC_SUPABASE_URL')
key = env.get('SUPABASE_SERVICE_ROLE_KEY') or env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
sb = create_client(url, key)
res = sb.from_('settings').select('*').eq('workspace_id', 'default').execute()
if res.data:
    row = res.data[0]
    print('APP_NAME:', row.get('app_name'))
    print('AUTHOR_PROFILE:', json.dumps(row.get('author_profile'), indent=2, ensure_ascii=False))
    print('BLOCK_STYLES.recommended_books_title:', row.get('block_styles', {}).get('recommended_books_title'))
    print('BLOCK_STYLES.recommended_books count:', len(row.get('block_styles', {}).get('recommended_books') or []))
    for b in (row.get('block_styles', {}).get('recommended_books') or []):
        print(' - ID:', b.get('id'), 'Title:', b.get('title'), 'Cover:', b.get('cover_url'))
    print('HOTLINE:', row.get('hotline'))
    print('ZALO:', row.get('zalo_url'))
else:
    print('NO SETTINGS IN SUPABASE')
