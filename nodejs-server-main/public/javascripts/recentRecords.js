function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function populateRecentRecords() {
    const recordsTable = document.getElementById('recordsTable');
    
    fetch('/getLatestRecords')
      .then(response => response.json())
      .then(records => {
        recordsTable.innerHTML = '';
        if(records.length > 0){
          records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${formatDate(record.date)}</td>
              <td>${record.workDescription}</td>
              <td>${record.renderedHours}</td>
            `;

            recordsTable.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching latest records:', error);
      });
  }
  
  function progressWidthFill() {
    const progressWidth = document.getElementById('progress');
    const percent = document.getElementById('progPercent');
    fetch('/getProgress')
      .then(response => response.json())
      .then(data => {
        let percentage = 0;  
        if(data.length > 0){
          if(data[0].time !== '00:00:00' && data[0].hours_required !== null){
            const totalRenderedHours = parseTime(data[0].total_time);
            const totalRequiredHours = parseTime(data[0].hours_required);
            percentage = (totalRenderedHours/ totalRequiredHours) * 100;
          }
          console.log(`Percentage: ${percentage}%`);
          progressWidth.style.width = percentage + '%';
          if(percentage > 0){
            percent.innerText = percentage.toFixed(0) + '%';
            percent.style.textAlign = "center";
            percent.style.color ="white";
            percent.style.fontSize = "10px";
          }
      }
      })
      .catch(error => {
        console.error('Error fetching latest records:', error);
      });
  }

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

  //function to convert time to seconds
function parseTime(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
  populateRecentRecords();
  progressWidthFill();
  