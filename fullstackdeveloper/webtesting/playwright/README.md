# Playwright Demo

### **Step 1: Install Node.js**

Playwright requires Node.js (version 16 or later). If you don’t have it, download and install it:

🔗 [Download Node.js](https://nodejs.org/)

---

### **Step 2: Create a New Project Directory**

Open **Command Prompt** or **PowerShell** and create a new folder (optional):

```bash
mkdir my-playwright-project
cd my-playwright-project
```

---

### **Step 3: Initialize a Node.js Project**

```bash
npm init -y
```

---

### **Step 4: Install Playwright**

Use **npm** to install Playwright:

```bash
npm install --save-dev playwright
```

This will install Playwright and its required binaries.

---

### **Step 5: Install Browsers (Optional)**

Playwright can automatically download the required browsers (Chromium, Firefox, WebKit):

```bash
npx playwright install
```

---

### **Step 6: Verify Installation**

Create a simple script to test Playwright:

```bash
npx playwright codegen playwright.dev
```

This will open a browser and generate Playwright code for actions you perform on the website.

---

**That’s it! 🎉**
You’re ready to start using Playwright on your Windows machine.

Awesome! Here's a quick **“Hello World”** script with Playwright to get you started.

---

### **Create a file**

In your project folder, create a file named **`index.js`**:

```javascript
// index.js
const { chromium } = require('playwright');

(async () => {
  // Launch a browser
  const browser = await chromium.launch({ headless: false }); // set to true to run without UI

  // Create a new page
  const page = await browser.newPage();

  // Go to a website
  await page.goto('https://playwright.dev');

  // Take a screenshot
  await page.screenshot({ path: `example.png` });

  // Close the browser
  await browser.close();

  console.log('Screenshot saved as example.png');
})();
```

---

### **Run the script**

In **Command Prompt** or **PowerShell**, run:

```bash
node index.js
```

You’ll see:

✅ A Chromium browser window open.
✅ It will navigate to [https://playwright.dev](https://playwright.dev).
✅ A screenshot called `example.png` will be saved in your project folder.

---

