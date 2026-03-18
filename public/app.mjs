import "./ui/user-create.js";
import "./ui/user-edit.js";
import "./ui/user-delete.js";

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