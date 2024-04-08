function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function populateRecords() {
    const recordsTable = document.getElementById('timeTable');
    const wholeTable = document.getElementById('record');
    fetch('/getRecordHistory')
      .then(response => response.json())
      .then(records => {
        if(records.length === 0){
          wholeTable.style.display = 'none';
          const noRecordsMessage = document.createElement('p');
          noRecordsMessage.textContent = 'No Daily time records yet.';
          noRecordsMessage.id = 'no-records';
          document.body.appendChild(noRecordsMessage);
        }else{
          recordsTable.innerHTML = '';
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
  
  populateRecords();
  