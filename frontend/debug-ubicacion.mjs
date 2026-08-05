import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://domus-frontend-production-f950.up.railway.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
// 1) nodos hijos del contenedor de ubicación y sus alturas
const nodos = await page.evaluate(() => {
  const fc = document.querySelector('.MuiDrawer-paper .MuiFormControl-root');
  const parent = fc.parentElement;
  const cs = getComputedStyle(parent);
  const out = [`PARENT <${parent.tagName}> display=${cs.display} lineHeight=${cs.lineHeight} fontSize=${cs.fontSize}`];
  parent.childNodes.forEach(n => {
    if (n.nodeType === 3) { out.push(`  TEXTO "${n.textContent.replace(/\n/g, '\\n').substring(0, 20)}"`); }
    else { const r = n.getBoundingClientRect(); out.push(`  <${n.tagName}> h=${Math.round(r.height)} top=${Math.round(r.top)} display=${getComputedStyle(n).display}`); }
  });
  return out;
});
console.log(nodos.join('\n'));
// 2) municipio funciona tras elegir provincia?
await page.locator('.MuiDrawer-paper div.MuiSelect-select').first().click();
await page.waitForTimeout(600);
await page.getByRole('option', { name: 'MADRID' }).click();
await page.waitForTimeout(2000);
await page.locator('.MuiDrawer-paper div.MuiSelect-select').nth(1).click();
await page.waitForTimeout(800);
const ops = await page.locator('li[role="option"]').count();
console.log('opciones de municipio tras elegir MADRID:', ops);
await browser.close();
