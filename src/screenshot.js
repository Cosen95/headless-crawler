const puppeteer = require('puppeteer');
const { screenshot } = require('./config/default');

// (async () => {
//     const browser = await puppeteer.launch({
//         executablePath: './chromium/chrome.exe',
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto('https://www.baidu.com');
//     await page.screenshot({
//         path: `${screenshot}/${Date.now()}.png`
//     });
//     await browser.close();
// })()

puppeteer.launch({
    headless: false,
}).then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    await page.screenshot({
        path: `${screenshot}/${Date.now()}.png`
    });
    browser.close();
}).catch(err => {
    console.log(err);
})