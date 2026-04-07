const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 6 });

  const filePath = 'file:///' + path.resolve('전단지.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // 앞면 캡처
  const front = await page.$('.flyer-front');
  if (front) {
    await front.screenshot({ path: '전단지_앞면.jpg', type: 'jpeg', quality: 100 });
    console.log('전단지_앞면.jpg 저장 완료');
  }

  // 뒷면 캡처
  const back = await page.$('.flyer-back');
  if (back) {
    await back.screenshot({ path: '전단지_뒷면.jpg', type: 'jpeg', quality: 100 });
    console.log('전단지_뒷면.jpg 저장 완료');
  }

  // 쿠폰 앞면 캡처
  const coupons = await page.$$('.coupon');
  if (coupons[0]) {
    await coupons[0].screenshot({ path: '쿠폰_앞면.jpg', type: 'jpeg', quality: 100 });
    console.log('쿠폰_앞면.jpg 저장 완료');
  }

  // 쿠폰 뒷면 캡처
  if (coupons[1]) {
    await coupons[1].screenshot({ path: '쿠폰_뒷면.jpg', type: 'jpeg', quality: 100 });
    console.log('쿠폰_뒷면.jpg 저장 완료');
  }

  await browser.close();
})();
