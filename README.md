# headless-crawler

## node实现爬虫与反爬虫

## 概念介绍

### 爬虫

* 按照一定规则自动抓取网络信息的程序

### 反爬虫

* User-Agent,Referer,验证码
* 单位时间访问次数、访问量
* 关键信息图片混淆
* 异步加载

## 项目依赖

### puppeteer
1.介绍
Puppeteer  翻译是操纵木偶的人，利用这个工具，我们能做一个操纵页面的人。Puppeteer是一个Nodejs的库，支持调用Chrome的API来操纵Web，相比较Selenium或是PhantomJs,它最大的特点就是它的操作Dom可以完全在内存中进行模拟既在V8引擎中处理而不打开浏览器，而且关键是这个是Chrome团队在维护，会拥有更好的兼容性和前景。
2.功能
* 利用网页生成PDF、图片
* 爬取SPA应用，并生成预渲染内容（即“SSR” 服务端渲染）
* 可以从网站抓取内容
* 自动化表单提交、UI测试、键盘输入等
* 帮你创建一个最新的自动化测试环境（chrome），可以直接在此运行测试用例。捕获站点的时间线，以便追踪你的网站，帮助分析网站性能问题
3.安装（有坑）
`yarn add puppeteer`
> Tip：下载 Chromium 失败解决办法
用 cnpm 安装
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm i puppeteer
```
相关文档参考：`https://lzw.me/a/puppeteer-install-skip-download-chrome.html`
`https://www.sunzhongwei.com/use-the-puppeteer-automation-chrome-chromium-operation`
4.项目实战
* 抓取百度首页截图
`src/screenshot.js`
```
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

```
* 模仿用户行为（进入百度图片首页，输入关键词，拿到图片）
`src/grabPicture.js`
```
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

```

## 扩展
node.js使用puppeteer headless浏览器爬取豆瓣电影
`https://blog.csdn.net/squirrelpineal/article/details/81260312`


