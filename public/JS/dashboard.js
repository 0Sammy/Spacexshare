function dropDown() {
  document.querySelector('#submenu').classList.toggle('hidden')
  document.querySelector('#arrow').classList.toggle('rotate-180')
}
  dropDown()
  
function Openbar() {
  document.querySelector('.sidebar').classList.toggle('left-[-300px]')
}

//Top right heading profile
const toggleDropDownBtn = document.querySelector("#toggleDropDownBtn")
toggleDropDownBtn.addEventListener("click", function (e) {
  document.querySelector("#optionBox").classList.toggle("hidden")
})