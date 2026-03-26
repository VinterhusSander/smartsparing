import "./ui/user-create.js";
import "./ui/user-edit.js";
import "./ui/user-delete.js";
import "./ui/goal-create.js";
import "./ui/saving-create.js";
import "./ui/goal-list.js";
import "./ui/saving-list.js";
import "./ui/savings-summary.js";

console.log("Components loaded ✅");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered ✅");
    } catch (error) {
      console.error("Service worker registration failed ❌", error);
    }
  });
}