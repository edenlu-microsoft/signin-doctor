import { exec } from "child_process";
import puppeteer from "puppeteer";

function startVitePreview(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const previewProcess = exec("npm run preview", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error starting Vite preview: ${err.message}`);
        reject(err);
        return;
      }
      console.log(`Vite preview stdout: ${stdout}`);
      console.error(`Vite preview stderr: ${stderr}`);
    });

    previewProcess.stdout?.on("data", (data) => {
      if (data.includes("localhost:4173")) {
        resolve();
      }
    });

    previewProcess.stderr?.on("data", (data) => {
      console.error(`Vite preview stderr: ${data}`);
    });
  });
}

function startViteNodeServer(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const serverProcess = exec("npm run server", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error starting Vite node server: ${err.message}`);
        reject(err);
        return;
      }
      console.log(`Vite node server stdout: ${stdout}`);
      console.error(`Vite node server stderr: ${stderr}`);
    });

    serverProcess.stdout?.on("data", (data) => {
      console.log(`Vite node server stdout: ${data}`);
      resolve();
    });

    serverProcess.stderr?.on("data", (data) => {
      console.error(`Vite node server stderr: ${data}`);
    });
  });
}

(async () => {
  try {
    const task1 = startVitePreview();
    const task2 = startViteNodeServer();

    Promise.allSettled([task1, task2]);

    const browser = await puppeteer.launch({
      headless: false, // Set to false if you want to see the browser
      args: ["--window-size=800,600"],
    });

    const page = await browser.newPage();
    await page.goto("http://localhost:4173");

    console.log("Browser loaded with Vite preview");
  } catch (error) {
    console.error("Failed to start the servers or browser:", error);
  }
})();
