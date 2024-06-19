import { exec } from "child_process";
import open from "open";

// Start both services
exec(
  "npm run start",
  { cwd: "C:/Users/edenlu/Desktop/projects/doctor-app" },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting services: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);

    // Open the browser after a delay to ensure the service is up
    setTimeout(() => {
      open("http://localhost:5173");
    }, 5000); // Adjust the delay as necessary
  }
);
