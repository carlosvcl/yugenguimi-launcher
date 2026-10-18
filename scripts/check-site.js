#!/usr/bin/env node
'use strict';
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const site=fs.existsSync(path.join(root,'site/index.html'))?path.join(root,'site'):root;
const read=name=>fs.readFileSync(path.join(site,name),'utf8');
const html=read('index.html'),conf=read('site-config.js');
assert(fs.existsSync(path.join(site,'.nojekyll')),'missing .nojekyll');
assert(/releaseUrl:\s*null/.test(conf),'release must remain unpublished');
const refs=new Set();
for(const m of html.matchAll(/(?:src|href)="(assets\/[^"#?]+)/g))refs.add(m[1]);
for(const m of conf.matchAll(/image:\s*['"](assets\/[^'"]+)/g))refs.add(m[1]);
const missing=[...refs].filter(f=>!fs.existsSync(path.join(site,f)));
assert.deepEqual(missing,[],'missing local site images');
assert(fs.existsSync(path.join(site,'404.html')),'404 fallback missing');
console.log('YUGEN_SITE_STATIC_VALIDATION_OK assets='+refs.size+' release=DISABLED pages=CONFIGURED');
