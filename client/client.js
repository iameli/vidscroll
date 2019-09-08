import { render } from "react-dom";
import React from "react";
import Router from "./router";
import "normalize.css";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("service-worker.js");
// }
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    })
    .catch(function(err) {
      console.log("Service Worker registration failed: ", err);
    });
}
render(<Router />, document.querySelector("main"));
