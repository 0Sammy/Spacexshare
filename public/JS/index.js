//Nav Bar
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => [
  btn.classList.toggle("open"),
  nav.classList.toggle("flex"),
  nav.classList.toggle("hidden"),
]);
//Function For the landing image
const changeImageSrc = () => {
  const image = document.getElementById("landingImage")
  if (document.documentElement.classList.contains("dark")) {
    image.src = "../Images/landingPageDark.svg";
  } else {
    image.src = "../Images/landingPage.svg";
  }
}

//Run the function whenever the windows reloads 
window.onload = function() {
  changeImageSrc();
};

//Dark Mode
const moonIcon = document.querySelector(".moon-icon");
const sunIcon = document.querySelector(".sun-icon");

//Save what the user chooses and target his selection.
const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

//Icon toggle
const iconToggle = () => {
  moonIcon.classList.toggle("hidden");
  sunIcon.classList.toggle("hidden");
};

//Initial Theme Check
const themeCheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moonIcon.classList.add("hidden");
    return;
  }
  sunIcon.classList.add("hidden");
};

//Manually switch the theme
const themeSwitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    iconToggle();
    changeImageSrc();
    whyChooseUsImgSrc();
    return;
  }
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
  iconToggle();
  changeImageSrc();
  whyChooseUsImgSrc();
};

//Call theme switch when the button is clicked
moonIcon.addEventListener("click", () => {
  themeSwitch();
});
sunIcon.addEventListener("click", () => {
  themeSwitch();
});

//Check theme on initial load
themeCheck();

// For The Animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("unhide");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hide");
hiddenElements.forEach((el) => observer.observe(el));

//Testimonial Section
const carousel = document.getElementById("carousel")
const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")
const slideWidth = carousel.clientWidth;
let currentIndex = 0;

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + 5) % 5;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % 5;
  updateCarousel();
});

function updateCarousel() {
  const transformValue = -currentIndex * slideWidth;
  carousel.querySelector(".flex").style.transform = `translateX(${transformValue}px)`;
}

//Contact Us Form Submission

const form = document.getElementById('email-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('description').value;

  const emailLink = 'mailto:admin@spacexshare-ai.com?subject=' + encodeURIComponent(email) + '&body=' + encodeURIComponent('Name: ' + firstName + lastName + '\n\nMessage: ' + message);

  window.location.href = emailLink;

  // Clear form inputs
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('description').value = '';


  alert('Email sent!');
});