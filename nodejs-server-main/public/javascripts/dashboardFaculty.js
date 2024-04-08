function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function populateAnnouncement() {
  fetch('/getAnnouncements')
    .then(response => response.json())
    .then(records => {
      if (records.length === 0) {
        updates.innerHTML = '<p>No announcements available</p>';
      } else {
        records.forEach(record => {
          const newDiv = document.createElement("div");
          newDiv.classList.add("announcement");

          const titleElement = document.createElement("h3");
          titleElement.textContent = record.title;

          const dateElement = document.createElement("small");
          dateElement.textContent = `Date: ${formatDate(record.date)}`; // Use formatDate function here

          const textElement = document.createElement("p");
          textElement.textContent = record.text;

          newDiv.appendChild(titleElement);
          newDiv.appendChild(dateElement);
          newDiv.appendChild(textElement);

          updates.appendChild(newDiv);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching announcements:', error);
      updates.innerHTML = '<p>Error fetching announcements</p>';
    });
}

function openModal(record) {
  const modalContent = document.getElementById('modalBody');
  console.log(record.studID);

  // Fetch all documents
  fetch(`/getDocuments?studID=${record.studID}`) // Adjust the URL if needed
    .then(response => response.json())
    .then(documents => {
      console.log("BRUHH DOCUMENTS: ", documents);
      // Fetch student documents from the new route
      fetch(`/getStudentDocumentsFaculty?studID=${record.studID}`) // Adjust the URL if needed
        .then(response => response.json())
        .then(studentDocuments => {
          console.log('record.studID', record.studID );
          console.log('All Documents:', documents);
          console.log('Student Documents:', studentDocuments);
          // Example: Populate modal content with documents as checkboxes

            modalContent.innerHTML = `
            <p>Student:   <span style="color: black; font-weight: bold;"> ${record.firstName} ${record.lastName}</span></p>
            <p>Company: <span style="color: black;">${record.companyName}</span></p><br>
            <div class="set-doc-container">
              <button onclick="openDemerit(${record.studID})" class="set-req-docs-demerit">Give Demerit</button>
              <button onclick="openCompanyDetails(${record.studID})" class="set-req-docs">View Company Details</button>
              <button onclick="openDocChecklistModal(${record.studID})" class="set-req-docs">Add Required Documents</button>
            </div>
            <hr>
            <h3>Required Documents for <span style="color: black; font-weight: bold;"> ${record.firstName}</span>:</h3>
            <form id="documentForm" style="margin-top: 2%; height: 57%; overflow: auto;">
              ${documents.map(doc => {
                const isChecked = studentDocuments.some(studentDoc => studentDoc.docID === doc.docID);
                return `<label><input type="checkbox" name="documents" value="${doc.docID}" ${isChecked ? 'checked' : ''}> ${doc.docName}</label><br>`;
              }).join('')}
            </form>
            <div class="update-doc-container">
              <button id="updateDocumentsButton" class = "update-stud-sub">Update Documents</button>
            </div>
            `;

          const modal = document.getElementById('myModal');
          modal.style.display = 'block';
          document.getElementById('updateDocumentsButton').addEventListener('click', () => {
            console.log('Button clicked');
            updateDocuments(record.studID);
          });
        })
        .catch(error => {
          console.error('Error fetching student documents:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching documents:', error);
    });
}

// If there is no checkbox, find a way to send an empty array
function updateDocuments(studID) {
  const documentForm = document.getElementById('documentForm');
  const checkboxes = documentForm.querySelectorAll('[name="documents"]');
  const selectedDocuments = Array.from(checkboxes).map(checkbox => ({
    docID: checkbox.value,
    checked: checkbox.checked,
  }));

  fetch('/updateDocuments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studID,
      selectedDocuments,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Documents updated successfully:', data);
      closeModal(); // Close the modal after updating
    })
    .catch(error => {
      console.error('Error updating documents:', error);
    });
}


function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}

function calculateProgress(totalRenderedHours, totalRequiredHours) {
  const renderedHours = parseTime(totalRenderedHours);
  const requiredHours = parseTime(totalRequiredHours);
  const percentage = (renderedHours / requiredHours) * 100;

  // Ensure the percentage does not exceed 100%
  const cappedPercentage = Math.min(percentage, 100);

  console.log(`Percentage: ${cappedPercentage}%`);
  return cappedPercentage;
}

// Function to convert time to seconds
function parseTime(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Function for Filter (you got this Gregg)
// Get the table rows

//UPLOAD PHOTO
function handleFileSelect(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const profilePhotoImg = document.getElementById('profile-photo-img');
      profilePhotoImg.src = e.target.result;

      uploadFile(file);
    };

    reader.readAsDataURL(file);
  }
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log('File uploaded successfully:', data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
}

//CHECKLIST FOR DOCUMENTS TO SELECT REQUIRED DOCUMENTS FOR EACH STUDENTS
    // Open the modal
    function openDocChecklistModal(studID) {
      const studId = studID;
      const modalContent = document.getElementById('modalBody2');
      const modal = document.getElementById('documentChecklistModal');
  
      modal.style.display = 'block';
  
      fetch('/getOptionalDocuments')
          .then(response => response.json())
          .then(records => {
              if (records.length > 0) {
                  console.log("Records", records);
                  modalContent.innerHTML = `
                      <h3>Select Document Requirements that you want to add:</h3>
                      <form id="documentChecklistForm" style="margin-top: 2%; height: 57%; overflow: auto;">
                      </form>
                      <div class="update-doc-container">
                          <button id="updateDocumentsButton" class="update-stud-sub">Add Document Requirements</button>
                      </div>
                  `;
  
                  const form = document.getElementById('documentChecklistForm');
                  records.forEach(record => {
                      const checkbox = document.createElement('input');
                      checkbox.type = 'checkbox';
                      checkbox.name = record.docName; // Use docName as the name attribute
                      checkbox.value = record.docID;
                      checkbox.id = `document_${record.docID}`;
  
                      const label = document.createElement('label');
                      label.htmlFor = `document_${record.docID}`;
                      label.appendChild(document.createTextNode(`${record.docName} (${record.isOptional ? 'Optional' : 'Required'})`));
  
                      form.appendChild(checkbox);
                      form.appendChild(label);
                      form.appendChild(document.createElement('br'));
                  });
  
                  // Add event listener to the modal for event delegation
                  modal.addEventListener('click', function (event) {
                      console.log(form);
                      const target = event.target;
  
                      if (target && target.id === 'updateDocumentsButton') {
                          console.log('Update Documents Button clicked!');
                          updateRequiredDocuments(studID);
                      }
                  });
              } else {
                  modalContent.innerHTML = "Nothing to see here";
              }
          })
          .catch(error => {
              console.error('Error fetching announcements:', error);
              // Assuming you have an 'updates' element to display errors
              updates.innerHTML = '<p>Error fetching announcements</p>';
          });
  }
  
  function updateRequiredDocuments(studID) {
    const documentForm = document.getElementById('documentChecklistForm');
    const checkboxes = documentForm.querySelectorAll('[type="checkbox"]');
    const selectedDocuments = Array.from(checkboxes).map(checkbox => ({
        docID: checkbox.value,
        docName: checkbox.name, // Use name attribute as docName
        checked: checkbox.checked,
    }));

    console.log(selectedDocuments);

    fetch('/updateIndividualDocuments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studID,
            selectedDocuments,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Documents updated successfully:', data);
            closeModal(); // Close the modal after updating
        })
        .catch(error => {
            console.error('Error updating documents:', error);
        });
}

  // Close the modal
  function closeDocChecklistModal() {
    const modal = document.getElementById('documentChecklistModal');
  
    modal.style.display = 'none';
  }

  function closeCompanyDetailsModal() {
    const modal = document.getElementById('companyDetailsModal');
  
    modal.style.display = 'none';
  }


  // Handle checklist submission
  function submitDocumentChecklist() {
      const form = document.getElementById('documentChecklistForm');
      const checkboxes = form.querySelectorAll('[name="documents"]');

      const selectedDocuments = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value);

      // Perform actions with selectedDocuments (e.g., send to server)
      console.log('Selected Documents:', selectedDocuments);

      // Close the modal
      closeModal();
  }

  function openCompanyDetails(studID) {
    const modal = document.getElementById('companyDetailsModal');
    modal.style.display = 'block';
  
    const modalContent = document.getElementById('modalBody3');
    fetch(`/getStudentCompanyDetails?studID=${studID}`)
      .then(response => response.json())
      .then(records => {
        // Check if there are records and if the first record has the 'companyName' field
        if (records && records.length > 0 && records[0].companyName) {
          modalContent.innerHTML = `
            <p> ${records[0].firstName} ${records[0].lastName} works at <span style="font-weight: bold;">${records[0].companyName}</span></p><br>
            <p> <span style="font-weight: bold;">${records[0].companyName}</span>: ${records[0].companyDescription}</p><br>
            <p> Company Location: <span style="font-weight: bold;">${records[0].companyLocation}</span></p><br>
            <p> ${records[0].firstName}'s Supervisor: <spanstyle="font-weight: bold;">${records[0].supervisor ? records[0].supervisor : 'None'}</span></p><br>
          `;
        } else {
          modalContent.innerHTML = '<p>No company details available</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching student company details:', error);
      });
  }
  
    function openDemerit(studID) {
      const modal = document.getElementById('addDemeritModal');
      modal.style.display = 'block';
       
    const modalContent = document.getElementById('modalBody4');
    fetch(`/studentProgress?studID=${studID}`)
      .then(response => response.json())
      .then(records => {
          modalContent.innerHTML = `
          <p> Student: <span style="font-weight: bold;">${records[0].firstName} ${records[0].lastName}</span></p>
            <p> Total Rendered Hours: <span style="font-weight: bold;">${records[0].total_time}</span></p>
            <p> Hours Required for ${records[0].firstName}: <span style="font-weight: bold;">${records[0].hours_required}</span></p><br>
            <div class="demerit-input">
            <label for="timeInput">Enter Time Demerit (in hours): </label>
            <input type="number" id="timeInput" name="timeInput" min="0" step="0.5" required style = " height: 30px; font-size: 15px"><br><br></div>
            <div class= "demerit-container-btn">
            <button class = "set-req-docs-demerit" onclick="convertAndSendTime(${studID})">Add Demerit</button></div>
          `;
      })
      .catch(error => {
        console.error('Error fetching student total rendered hours and required hours:', error);
      });
    }
  
    function closeDemeritModal() {
      const modal = document.getElementById('addDemeritModal');
    
      modal.style.display = 'none';
    }
  
  function convertHoursToHHMMSS(hours) {
      const totalSeconds = hours * 3600;
      const hh = Math.floor(totalSeconds / 3600);
      const mm = Math.floor((totalSeconds % 3600) / 60);
      const ss = Math.floor(totalSeconds % 60);
  
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }

  
function convertAndSendTime(studID) {
  const timeInput = document.getElementById('timeInput').value;
  const convertedTime = convertHoursToHHMMSS(timeInput);

  // Assuming you have an endpoint on the server to handle the data
  fetch('/addDemerit', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          studID: studID,
          demeritTime: convertedTime,
      }),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      // Optionally, close the modal or perform other actions
      closeDemeritModal();
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}
