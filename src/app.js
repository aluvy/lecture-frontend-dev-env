import MainController from "./controllers/MainController.js";
import "./app.scss";

document.addEventListener("DOMContentLoaded", () => {
  new MainController();
});

if (module.hot) {
  console.log("핫 모듈 켜짐");

  // module.hot.accept("./result", async ()=>{
  //   console.log("result 모듈 변경 됨");
  //   resultEl.innerHTML = await result.render();
  // });
}

// eslint-disable-next-line no-undef
console.log(MODE);
