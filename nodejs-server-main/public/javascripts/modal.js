const modalWork = document.getElementById('myModal');
const modalBtn = document.getElementById('modalBtn');
const closeWork = document.getElementById('closeWorkModal')
const closeCompany =document.getElementById('closeCompanyModal')
const workForm = document.getElementById('workForm');
const currentDate = document.getElementById('currentDate');
const modalCompany = document.getElementById('companyModal');
const selectCompanyModal = document.getElementById('selectCompanyModal');
const closeSelectCompany = document.getElementById('closeSelectCompanyModal');

modalBtn.onclick = function() {
    modalWork.style.display = 'block';
}

closeWork.onclick = function() {
    modalWork.style.display = 'none';
}
closeCompany.onclick = function(){
    modalCompany.style.display = 'none';
}

closeSelectCompany.onclick = function() {
    selectCompanyModal.style.display = 'none';
}

function interpretDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const interpretedDate = new Date(year, month - 1, day);

    return interpretedDate;
}
const interpretedDate = interpretDate(currentDate.innerText);

const formattedDate = interpretedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

currentDate.innerText = formattedDate + ' (' + interpretedDate.toLocaleDateString('en-US', { weekday: 'short' }) + ')';

function selectCompany(){
    selectCompanyModal.style.display = "block";
}

function addCompany() {
    modalCompany.style.display= "block";
}

function populateCompanies() {
    const companyDropdown = document.getElementById("companySelect");
    fetch('/getAllCompanies')
        .then(response => response.json())
        .then(records => {
            companyDropdown.innerHTML = "";
            if (records.length > 0) {
                var defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.text = "Select a company";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                companyDropdown.appendChild(defaultOption);

                records.forEach(record => {
                    var option = document.createElement("option");
                    option.value = record.companyID; // Assuming the company ID is used as the value
                    option.text = record.companyName; // Replace with the actual property name from your data
                    companyDropdown.appendChild(option);
                });
            }
        });
}

// window.onload = function () {
//     populateCompanies();

//     // Attach the event listener to the "Update" button using the ID
//     var updateButton = document.getElementById("updateCompanyButton");
//     if (updateButton) {
//         updateButton.addEventListener("click", handleUpdateButtonOnClick);
//     }
// };

// window.onload = function () {
//     populateCompanies();
// };

function handleUpdateButtonOnClick(studentID) {
    // Prevent the default form submission behavior
    var selectedCompanyId = document.getElementById("companySelect").value;
    var supervisorName = document.getElementById("companySupervisor").value;

    console.log("Selected Company ID:", selectedCompanyId);
    console.log("Supervisor Name:", supervisorName);
    console.log("Student ID from session:", studentID);

    // Prepare the data for the POST request
    var data = {
        companyID: selectedCompanyId,
        supervisorName: supervisorName,
        studentID: studentID
    };

    // Make a POST request to the server
    fetch('/updateStudentCompany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server if needed
        console.log("Server response:", result);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}


// // Attach the event listener to the "Update" button using the ID
// var updateButton = document.getElementById("updateCompanyButton");
// if (updateButton) {
//     updateButton.addEventListener("click", function() {
//         // Pass userData.studID to the function
//         handleUpdateButtonOnClick('<%= userData.studID %>');
//     });
// }


// function submitForm(event) {
//     event.preventDefault(); // Prevent the default form submission
  
//     const form = document.getElementById('companyForm');
//     const formData = new FormData(form);
  
//     // Make an AJAX request to the server
//     fetch('/addCompany', {
//       method: 'POST',
//       body: formData,
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log(data); // Log the response from the server
//       // You can perform additional actions based on the server response if needed
//     })
//     .catch(error => {
//       console.error('Error submitting form:', error);
//       // Handle the error, display an error message, etc.
//     });
//   }

function handleUpdateCompanyButtonOnClick(studentID){
    var companyName = document.getElementById("companyName").value;
    var companyLocation = document.getElementById("companyLocation").value;
    var supervisor = document.getElementById("companySupervisor").value;
    var description = document.getElementById("companyDescription").value;
    
    var data = {
        companyName: companyName,
        companyLocation: companyLocation,
        supervisor: supervisor,
        companyDescription: description,
        studentID: studentID
    };

    console.log(companyName);
    console.log(companyLocation);
    console.log(supervisor);
    console.log(description);
    console.log("Add company BUTTON IS CLICKED");

    // Make a POST request to the server
    fetch('/addCompany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server if needed
        console.log("Server response:", result);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
  