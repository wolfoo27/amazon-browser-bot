const puppeteer = require('puppeteer');

// Insert personal credentials
const email = '';
const password = '';

function press_enter(page) {
    return Promise.all([
        page.waitForNavigation({waitUntil:'networkidle2'}),
        page.keyboard.press(String.fromCharCode(13))
      ]);
}

function click_wait(page, selector) {
    return Promise.all([
        page.waitForNavigation({waitUntil:'networkidle2'}),
        page.click(selector)
      ]);
}

(async () => {
  const browser = await puppeteer.launch({headless:false, defaultViewport:null, args: ['--start-maximized']});
  const page = (await browser.pages())[0];
  await page.goto('https://www.amazon.it/');
  await click_wait(page, "a[data-nav-role='signin']");
  await page.keyboard.type(email);
  await press_enter(page);
  await page.keyboard.type(password);
  await press_enter(page);

  // Search for the "signout" button as login proof
  if(await page.$('#nav-item-signout') !== null) console.log('Login done!');
  else return console.log('Something went wrong during login');

  // Navigate to the product page
  await page.goto('https://www.amazon.it/dp/B07RL2VWXQ');


    await Promise.all([page.waitForTimeout(5000), page.click('#buy-now-button')]);

  // Conclude the purchase
  await click_wait(page, '#turbo-checkout-pyo-button');
})();