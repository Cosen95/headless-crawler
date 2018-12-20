const puppeteer = require('puppeteer');
const { picture } = require('./config/default');
const srcToImg = require('./helper/srcToImg'); 

puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://image.baidu.com/');
    console.log('go to 百度图片');
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    console.log('reset viewport');

    await page.focus('#kw');
    await page.keyboard.sendCharacter('厦门');
    await page.click('.s_btn');
    console.log('go to search list');

    page.on('load', async() => {
        console.log('page loading done,start fetch...');

        const srcArr = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src)
        });

        console.log(`get ${srcArr.length} images, start download`);
        srcArr.forEach(async (src) => {
            // sleep
            await page.waitFor(200)
            await srcToImg(src, picture);
        })
    })
    
    browser.close();
}).catch(err => {
    console.log(err);
})