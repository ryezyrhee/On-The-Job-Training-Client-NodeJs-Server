async function populateClassList() {
    const classListElement = document.getElementById('filterDropdown');

    try {
        const response = await fetch('/getClasses');
        const classes = await response.json();
        console.log(classes);

        const classArray = classes.map(course => course.courseID);

        // Populate the dropdown
        classes.forEach(course => {
            classListElement.innerHTML += `<option value="${course.courseID}">${course.courseID}</option>`;
        });

        return classArray;
    } catch (error) {
        console.error('Error fetching classes:', error);
        return []; // Return an empty array in case of an error
    }
}

// Use the async function with await
async function initializeSortAndFilter() {
    const classes = await populateClassList();
    console.log(classes);

    // INSTRUCTORS WITH STUDENTS
    function populateStudentRecords() {
        const sortDropdown = document.getElementById('sortDropdown');
        const searchInput = document.getElementById('searchInput');
        const filterDropdown =document.getElementById('filterDropdown')
        fetch('/getStudentRecords')
        .then(response => response.json())
        .then(records => {
                populate(records);
                let currentSort = sortDropdown.value;
                sortDropdown.addEventListener('change', function () {
                    currentSort =sortDropdown.value;
                if (currentSort === 'name') {
                    records.sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));
                    populate(records);
                } else if (currentSort === 'company') {
                    records.sort((a, b) => (a.companyName || 'None').localeCompare(b.companyName || 'None'));
                    populate(records);
                } else if (currentSort === 'progress') {
                    records.sort((a, b) => calculateProgress(b.total_time, b.hours_required) - calculateProgress(a.total_time, a.hours_required));
                    populate(records);
                }
            })
                searchInput.addEventListener('input', function () {
                    const searchQuery = searchInput.value.toLowerCase().trim();
    
                    const filteredRecords = records.filter(record =>
                        record.firstName.toLowerCase().includes(searchQuery) ||
                        record.lastName.toLowerCase().includes(searchQuery) ||
                        (record.companyName && record.companyName.toLowerCase().includes(searchQuery))
                    );
    
                    populate(filteredRecords);
                });
        })
        .catch(error => {
            console.log(error);
        })
        let currentFilter = filterDropdown.value;
        filterDropdown.addEventListener('change', function (){
            sortDropdown.value = 'name';
            currentFilter = filterDropdown.value;
        if(currentFilter != 'All'){
            fetch(`/getClassRecords?filter=${currentFilter}`)
            .then(response => response.json())
            .then(records => {
                populate(records);
                let currentSort = sortDropdown.value;
                sortDropdown.addEventListener('change', function () {
                    currentSort =sortDropdown.value;
                if (currentSort === 'name') {
                    records.sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));
                    populate(records);
                } else if (currentSort === 'company') {
                    records.sort((a, b) => (a.companyName || 'None').localeCompare(b.companyName || 'None'));
                    populate(records);
                } else if (currentSort === 'progress') {
                    records.sort((a, b) => calculateProgress(b.total_time, b.hours_required) - calculateProgress(a.total_time, a.hours_required));
                    populate(records);
                }
            })
            searchInput.addEventListener('input', function () {
                const searchQuery = searchInput.value.toLowerCase().trim();

                const filteredRecords = records.filter(record =>
                    record.firstName.toLowerCase().includes(searchQuery) ||
                    record.lastName.toLowerCase().includes(searchQuery) ||
                    (record.companyName && record.companyName.toLowerCase().includes(searchQuery))
                );

                populate(filteredRecords);
            });
            })
            .catch(error => {
                console.log(error);
            })
        }else{
                fetch('/getStudentRecords')
                .then(response => response.json())
                .then(records => {
                    populate(records);
                    let currentSort = sortDropdown.value;
                    sortDropdown.addEventListener('change', function () {
                        currentSort =sortDropdown.value;
                    if (currentSort === 'name') {
                        records.sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));
                        populate(records);
                    } else if (currentSort === 'company') {
                        records.sort((a, b) => (a.companyName || 'None').localeCompare(b.companyName || 'None'));
                        populate(records);
                    } else if (currentSort === 'progress') {
                        records.sort((a, b) => calculateProgress(b.total_time, b.hours_required) - calculateProgress(a.total_time, a.hours_required));
                        populate(records);
                    }
                })
                searchInput.addEventListener('input', function () {
                    const searchQuery = searchInput.value.toLowerCase().trim();

                    const filteredRecords = records.filter(record =>
                        record.firstName.toLowerCase().includes(searchQuery) ||
                        record.lastName.toLowerCase().includes(searchQuery) ||
                        (record.companyName && record.companyName.toLowerCase().includes(searchQuery))
                    );

                    populate(filteredRecords);
                });
                })
                .catch(error => {
                    console.log(error);
                })
        }
    })
    }
    populateStudentRecords();
}

  function populate(records){
    const recordsTable = document.getElementById('recordsTable');
    recordsTable.innerHTML = '';
    records.forEach(record => {
        const hardcodedTotalRenderedHours = record.total_time;
        const hardcodedTotalRequiredHours = record.hours_required;
        console.log(hardcodedTotalRenderedHours);
        console.log(hardcodedTotalRequiredHours);
        const progressPercentage = calculateProgress(hardcodedTotalRenderedHours, hardcodedTotalRequiredHours);
        if (record.companyName == null) {
        record.companyName = 'None';
        }
  
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${record.firstName} ${record.lastName}</td>
                <td style="${record.companyName !== 'None' ? '' : 'color: rgb(165, 42, 42);'}">${record.companyName !== 'None' ? record.companyName : 'None'}</td>
                <td>
                <div class="progress-container">
                    <div class="progress-circle"></div>
                    <div class="progress-circle2" style="background: conic-gradient(
                        #7380ec 0% var(--progress, 0%),
                        #7380ec ${(progressPercentage.toFixed(2)/100)*360}deg var(--progress, 0%),
                        transparent ${(progressPercentage.toFixed(2)/100)*360}deg 360deg">
                        <div class="percentage" style="color: ${progressPercentage === 0 ? 'rgb(165, 42, 42)' : 'inherit'}">
                        ${progressPercentage.toFixed(0)}%
                    </div>
                    </div>
                    </div>
                </td>
                
                <td>${record.courseNumber}: ${record.courseCode}</td>
                <td>${record.email}</td>
            `;
  
        row.addEventListener('click', () => {
        openModal(record);
        });
        
        // Add hover effect in JavaScript
        row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = '#f0f0f0';
        row.style.cursor = 'pointer';
        });
    
        row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = ''; 
        row.style.cursor = '';
        });
        recordsTable.appendChild(row);
    });
  }