import json, urllib.request, concurrent.futures
from pathlib import Path
items={};mapping={}
for name in ['home','about-me','bmw','myntra','bloom']:
 d=json.load(open('research/'+name+'.json'));seen=set();mapping[name]=[]
 for im in d['images']:
  url=im.get('src','').split('?')[0]
  if not url or url in seen:continue
  seen.add(url)
  key=url.split('/')[-1];items[key]=url;mapping[name].append('assets/'+key)
Path('research/assets-map.json').write_text(json.dumps(mapping,indent=2))
def download(item):
 key,url=item
 if key.endswith('.svg'):return
 urllib.request.urlretrieve(url+'?width=1600',Path('assets')/key)
 return key
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
 for result in pool.map(download,items.items()):pass
print('Downloaded',len(items),'assets')
