import { initHomePage } from "./app.js";

console.log(
  `%cCopyright © ${new Date().getFullYear()} simonsun.cc`,
  "background-color:rgb(6, 113, 245); color: white; font-size: 24px; font-weight: bold; padding: 10px;"
);

initHomePage().catch((error) => {
  console.error("Failed to initialize SimonHome", error);
});
