const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 await page.locator('canvas').scrollIntoViewIfNeeded();
 const box=await page.locator('canvas').boundingBox();
 const y=Math.round(Math.max(100,box.y+160)), x=195;
 const cdp=await page.context().newCDPSession(page);
 const send=async(type,coords)=>{await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:coords.map(([id,x,y])=>({id,x,y}))});await page.waitForTimeout(40);};
 const state=()=>page.evaluate(()=>({scale:spacetimeModel.project([0,0,0]).scale,point:spacetimeModel.project([1,2,3])}));
 const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
 const initial=await state();
 await send('touchStart',[[1,x-50,y]]);
 await send('touchMove',[[1,x-30,y+10]]);
 assert.notEqual((await state()).point.x,initial.point.x);
 await send('touchStart',[[1,x-30,y+10],[2,x+50,y+10]]);
 const base=await state();
 await send('touchMove',[[1,x-30,y+10],[2,x+130,y+10]]);
 close((await state()).scale/base.scale,2);
 await send('touchMove',[[1,x-30,y+10],[2,x+170,y+10]]);
 close((await state()).scale/base.scale,2.1);
 await send('touchMove',[[1,x-30,y+10],[2,x-20,y+10]]);
 close((await state()).scale/base.scale,.55);
 // Lifting the second contact must not rotate or zoom the camera.
 const pinchEnd=await state();
 await send('touchEnd',[[2,x-20,y+10]]);
 assert.deepEqual(await state(),pinchEnd);
 await send('touchMove',[[1,x-20,y+10]]);
 close((await state()).scale,pinchEnd.scale);
 assert.notEqual((await state()).point.x,pinchEnd.point.x);
 await send('touchCancel',[]);
 const canceled=await state();
 await page.locator('canvas').dispatchEvent('pointermove',{pointerId:1,clientX:300,clientY:300});
 assert.deepEqual(await state(),canceled);
 // Lost capture removes its pointer and leaves no stale drag.
 await page.evaluate(()=>{const c=document.querySelector('canvas');c.addEventListener('pointerdown',e=>window.lastTestPointer=e.pointerId,{once:true})});
 await send('touchStart',[[5,x,y]]);
 await page.evaluate(()=>document.querySelector('canvas').dispatchEvent(new PointerEvent('lostpointercapture',{pointerId:window.lastTestPointer})));
 await send('touchMove',[[5,x+10,y]]); // stale contact must no longer change the camera
 assert.deepEqual(await state(),canceled);
 await send('touchEnd',[]);
 assert.equal(await page.locator('canvas').evaluate(e=>getComputedStyle(e).touchAction),'none');
 assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).touchAction),'auto');
 assert.deepEqual(errors,[]);
 console.log('PASS: actual Chromium touch input rotates, pinches both directions, clamps zoom, transitions without jumps, cancels/lost capture cleanly; page gestures outside canvas preserved.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
