const puppeteer = require('puppeteer');

// test('should add numbers', ()=>{
//     var sum = 1 + 2;
//     expect(sum).toEqual(3);
// });
let browser, page;

beforeEach( async ()=>{
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

afterEach( async()=>{
    await browser.close();
})

test('checking the text in the header', async ()=>{
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster')
});

test('clicking login start', async ()=>{
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google.\com/);
});


test.only('when signed in, show logout button', async ()=>{
    const id = '5b274d52726afe80cb527391';
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };

    const sessionString = Buffer.from(
        JSON.stringify(sessionObject))
        .toString('base64');
    
    const Keygrip = require('keygrip');
    const keys = require('../config/keys');

    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);
    console.log(sig);
    console.log(sessionString);

    await page.setCookie({ name: 'session', value: sessionString});
    await page.setCookie({ name: 'session.sig', value: sig});
    await page.goto('http://localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el=>el.innerHTML);
    expect(text).toEqual('Logout');
});


