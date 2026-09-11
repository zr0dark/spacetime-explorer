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
const core=html.slice(html.indexOf('function acceleration('),html.indexOf('let bodies='));
const {stepOrbit,initialBodies,acceleration}=new Function(core+';return {stepOrbit,initialBodies,acceleration}')();
const energy=(b,mu)=>b.v.reduce((s,v)=>s+v*v,0)/2-mu/Math.hypot(...b.p);
const angular=b=>Math.hypot(b.p[1]*b.v[2]-b.p[2]*b.v[1],b.p[2]*b.v[0]-b.p[0]*b.v[2],b.p[0]*b.v[1]-b.p[1]*b.v[0]);
for(const kind of ['circular','elliptical']){
 const b=initialBodies(kind,4)[0],e=energy(b,4),h=angular(b);let min=Infinity,max=0;
 for(let i=0;i<30000;i++){stepOrbit(b,1/240,4);const r=Math.hypot(...b.p);min=Math.min(min,r);max=Math.max(max,r)}
 assert.equal(b.status,'orbiting');assert.ok(Math.abs((energy(b,4)-e)/e)<1e-4);assert.ok(Math.abs(angular(b)-h)<1e-10);
 if(kind==='elliptical')assert.ok(max-min>1);else assert.ok(max-min<.001);
}
assert.ok(energy(initialBodies('escape',4)[0],4)>0);
const a=acceleration([3,0,0],4),a2=acceleration([3,0,0],8);assert.equal(a2[0],2*a[0]);
const hit={p:[1.01,0,0],v:[-2,0,0],status:'orbiting'};stepOrbit(hit,.02,4);assert.equal(hit.status,'impacted');
const gone={p:[59.99,0,0],v:[10,0,0],status:'orbiting'};stepOrbit(gone,.02,4);assert.equal(gone.status,'escaped');
console.log('Orbit core: fixed-mass energy/angular momentum, ellipse radial range, circular stability, escape energy, mass acceleration, collision and escape bounds passed.');

const solar=initialBodies('solar',4);assert.equal(solar.length,8);assert.deepEqual(solar.map(b=>b.name),['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']);
for(const b of solar){for(let i=0;i<2400;i++)stepOrbit(b,1/240,4);assert.equal(b.status,'orbiting');assert.ok(b.p.every(Number.isFinite))}
console.log('Eight-planet preset: names/order and finite stable integration passed.');
