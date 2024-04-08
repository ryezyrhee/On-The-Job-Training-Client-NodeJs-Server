const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
let currentIndex = 1;

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider(index) {
  currentIndex = index;

  let currentImage = document.querySelector(`.img-${currentIndex}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(currentIndex - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  bullets[currentIndex - 1].classList.add("active");
}

function autoSlide() {
  currentIndex = (currentIndex % images.length) + 1;
  moveSlider(currentIndex);
}

const slideInterval = setInterval(autoSlide, 2000);

bullets.forEach((bullet) => {
  bullet.addEventListener("click", function () {
    clearInterval(slideInterval);
    moveSlider(this.dataset.value);
  });
});


// function handleLoginFormSubmit(event) {
//   event.preventDefault();

//   const idNumberInput = document.querySelector('.actual-form .input-wrap input[type="text"]');
//   const passwordInput = document.querySelector('.actual-form .input-wrap input[type="password"]');

//   const email = idNumberInput.value;
//   const password = passwordInput.value;

//   console.log("idNumberInput: ", email);
//   fetch('/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       email: email,
//       password: password
//     })
//   }).then(response => {
//     if (response.status === 200) {
//       response.json().then(userData => {
//         if (userData) {
//           console.log('Logged in as:', userData.firstName, userData.lastName);
//         } else {
//           alert('Invalid login credentials');
//         }
//       });
//     } else {
//       alert('Error during login');
//     }
//   });
// }
