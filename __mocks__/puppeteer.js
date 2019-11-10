const puppeteer = jest.fn();

puppeteer.launch = jest.fn();

module.exports = puppeteer;
