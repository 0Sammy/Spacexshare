//Showing the Forms
const basic = document.getElementById('basic');
const other = document.getElementById('other');
const profileDetails = document.getElementById("profileDetails");
const profileButton = document.getElementById('profileButton');
const basicButton = document.getElementById('basicButton');
const otherButton = document.getElementById('otherButton');
const otherIcon = document.getElementById("otherIcon");
const basicIcon = document.getElementById("basicIcon");
const profileIcon = document.getElementById("profileIcon");
const basicText = document.getElementById("basicText");
const otherText = document.getElementById("otherText");
const profileText = document.getElementById("profileText");

//For Basic Information
profileButton.addEventListener("click", () =>{
  profileDetails.classList.remove("hidden")
  basic.classList.add("hidden")
  other.classList.add("hidden")
  profileButton.classList.add("border-l-4" , "border-lightBlue")
  profileText.classList.remove("text-[#9EA0A3]")
  profileText.classList.add("font-semibold" , "text-lightBlue")
  profileIcon.src = "../Images/profileDetailsHover.svg";

  if (otherText.classList.contains("font-semibold") || basicText.classList.contains("font-semibold")) {
    otherText.classList.remove("font-semibold" , "text-lightBlue")
    basicText.classList.remove("font-semibold" , "text-lightBlue")
    basicText.classList.add("text-[#9EA0A3]")
    otherText.classList.add("text-[#9EA0A3]")
    otherIcon.src = "../Images/bank.svg";
    basicIcon.src = "../Images/crypto.svg";
    otherButton.classList.remove("border-l-4" ,"border-lightBlue")
    basicButton.classList.remove("border-l-4" ,"border-lightBlue")
  }
})
basicButton.addEventListener("click", () =>{
  basic.classList.remove("hidden")
  other.classList.add("hidden")
  profileDetails.classList.add("hidden")
  basicButton.classList.add("border-l-4" , "border-lightBlue")
  basicText.classList.remove("text-[#9EA0A3]")
  basicText.classList.add("font-semibold" , "text-lightBlue")
  basicIcon.src = "../Images/cryptoHover.svg"

  if (otherText.classList.contains("font-semibold") || profileText.classList.contains("font-semibold")) {
    otherText.classList.remove("font-semibold" , "text-lightBlue")
    otherIcon.src = "../Images/bank.svg";
    otherText.classList.add("text-[#9EA0A3]")
    otherButton.classList.remove("border-l-4" ,"border-lightBlue")
    profileText.classList.add("text-[#9EA0A3]")
    profileText.classList.remove("font-semibold" , "text-lightBlue")
    profileIcon.src = "../Images/profileDetails.svg";
    profileButton.classList.remove("border-l-4" ,"border-lightBlue")
  }
})
//For Other Information
otherButton.addEventListener("click", () =>{
  profileDetails.classList.add("hidden")
  basic.classList.add("hidden")
  other.classList.remove("hidden")
  otherText.classList.remove("text-[#9EA0A3]")
  otherButton.classList.add("border-l-4" ,"border-lightBlue")
  otherText.classList.add("font-semibold" , "text-lightBlue")
  otherIcon.src = "../Images/bankHover.svg"

  if (basicText.classList.contains("font-semibold") || profileText.classList.contains("font-semibold")){
    basicText.classList.remove("font-semibold" , "text-lightBlue")
    basicText.classList.add("text-[#9EA0A3]")
    basicIcon.src = "../Images/crypto.svg";
    basicButton.classList.remove("border-l-4" ,"border-lightBlue")
    profileText.classList.remove("font-semibold" , "text-lightBlue")
    profileText.classList.add("text-[#9EA0A3]")
    profileIcon.src = "../Images/profileDetails.svg";
    profileButton.classList.remove("border-l-4" ,"border-lightBlue")
  }
})

//For the country dropdown
const dropdownButton = document.getElementById('dropdownButton');
const dropdownContent = document.getElementById('dropdownContent');
const chosenOptionInput = document.getElementById('chosenOption');

dropdownButton.addEventListener('click', () => {
  dropdownContent.classList.toggle('hidden');
  dropdownButton.querySelector('.dropdown-arrow').classList.toggle('rotate-180');
});

dropdownContent.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    const selectedOption = event.target.textContent;
    dropdownButton.querySelector('span').textContent = selectedOption;
    chosenOptionInput.value = selectedOption;
    dropdownContent.classList.add('hidden');
    dropdownButton.querySelector('.dropdown-arrow').classList.remove('rotate-180');
  }
});

//For the see Icon
myFunction = () => {
  const x = document.getElementById("myPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  const eye = document.getElementById("eye");
  eye.setAttribute("name", eye.getAttribute("name") === "eye" ? "eye-off" : "eye");
}