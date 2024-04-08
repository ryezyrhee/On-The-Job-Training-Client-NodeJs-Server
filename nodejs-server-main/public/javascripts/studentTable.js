function populateStudentRecords() {
    const recordsTable = document.getElementById('studentTable');
  
    fetch('/getAllStudentRecords')
        .then(response => {
            console.log('Raw response:', response);
            return response.json();
        })
        .then(records => {
            console.log('Fetched records:', records);
            recordsTable.innerHTML = '';
            records.forEach(record => {

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.firstName} ${record.lastName}</td>
                    <td style="${record.companyName !== null ? '' : 'color: rgb(165, 42, 42);'}">${record.companyName !== null ? record.companyName : 'None'}</td>
                    <td>${record.email}</td>
                    <td>${record.teacherName}</td>
                    <td style="${record.supervisor !== null ? '' : 'color: rgb(165, 42, 42);'}">${record.supervisor !== null ? record.supervisor : 'None'}</td>
                `;
  
                recordsTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching student records:', error);
        });
  }

  populateStudentRecords();