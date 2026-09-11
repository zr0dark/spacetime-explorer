import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const source=html.match(/function clockRate\(r,s=rs\)\{([^}]+)\}/)[1];
const rate=new Function('r','s',source);
assert.equal(rate(Infinity,.5),1);
assert.equal(rate(3,0),1);
assert.ok(Math.abs(rate(1.45,.5)-0.8094272134003795)<1e-8);
assert.ok(rate(1.45,.5)<rate(3,.5));
assert.ok(rate(3,.5)<rate(5.6,.5));
for(const strength of [.3,1,1.3])for(const compactness of [.5,.00000424])for(const r of [1.45,3,5.6]){let rs=strength*compactness;assert.ok(rs<1);assert.ok(rate(r,rs)>0&&rate(r,rs)<1)}
assert.ok(1-rate(1.45,.00000424)<.000002);
assert.ok(!/<script[^>]+src=|<link[^>]+href=/i.test(html));
console.log('Clock model: reference, zero mass, known value, radial ordering, domain, weak-field, offline assertions passed.');
