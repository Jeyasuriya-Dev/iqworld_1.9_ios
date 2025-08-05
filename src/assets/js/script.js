const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebar = document.querySelector(".sidebar");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");

sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("close", "hoverable");
});
sidebarExpand.addEventListener("click", () => {
  sidebar.classList.remove("close", "hoverable");
});

sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI;
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});

if (window.innerWidth < 768) {
  sidebar.classList.add("close");
} else {
  sidebar.classList.remove("close");
}




// document.onreadystatechange = function () {
//   if (document.readyState === "complete") {

//   }
//   else {
//     window.onload = () => {
//       var newDiv = document.createElement("div");
//       newDiv.id = "loaderiq";
//       newDiv.innerHTML = (`
//       <div class="loader-body" style=" font-family: 'Barlow', sans-serif !important; z-index:100;">
//       <div class="container">
//       <div class="part2">
//         IQ 
//       </div>
//         <div class="part1">
//           World
//         </div>
//      </div>
//       <div class="loader">
//         <div class="loading">
//         </div>
//       </div>
//       </div>
//       `);

//       var currentDiv = document.getElementById("pooo");
//       document.body.insertBefore(newDiv, currentDiv);
//       // document.body.appendChild();
//     };
//   };
// }
