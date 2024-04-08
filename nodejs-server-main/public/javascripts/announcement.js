const updates = document.getElementById('updates'); // Assuming updates is the container for announcements
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

  populateAnnouncement();
