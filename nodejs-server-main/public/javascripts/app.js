const sideMenu = document.querySelector("aside");
const profileBtn = document.querySelector("#profile-btn");
const themeToggler = document.querySelector(".theme-toggler");
const body = document.body;

profileBtn.onclick = function() {
    sideMenu.classList.toggle('active');
}
window.onscroll = () => {
    sideMenu.classList.remove('active');
    if(window.scrollY > 0){document.querySelector('header').classList.add('active');}
    else{document.querySelector('header').classList.remove('active');}
}

themeToggler.onclick = function() {
    document.body.classList.toggle('dark-theme');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')
}

// Requirements modal

// Function to open the modal
function openDocumentModal() {
    const modal = document.getElementById('documentModal');
    modal.style.display = 'block';
}

// Function to close the modal
function closeDocumentModal() {
    const modal = document.getElementById('documentModal');
    modal.style.display = 'none';
}

function validatePassword() {
    var newPassword = document.getElementById("newpass").value;
    var confirmPassword = document.getElementById("confirmpass").value;
    var submitBtn = document.getElementById("submitBtn");

    if (newPassword === confirmPassword) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", "true");
    }
}

// progressBar
// Update progress bar function
// async function updateProgressBar() {
//     try {
//       const response = await fetch('/getProgressData'); // Assuming the endpoint is exposed at '/progressData'
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const { totalRequiredHours, hoursWorked } = await response.json();
  
//       // Update the progress bar width
//       const progressElement = document.querySelector('.progress');
//       const percentage = (hoursWorked / totalRequiredHours) * 100;
//       progressElement.style.setProperty('--progress-width', `${percentage}%`);
//     } catch (error) {
//       console.error('Error updating progress bar:', error);
//     }
//   }
  
//   // Call the function to update the progress bar when the page loads
//   updateProgressBar();
  

