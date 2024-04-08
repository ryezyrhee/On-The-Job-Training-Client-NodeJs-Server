document.getElementById('getStarted').addEventListener('click', function() {
    const loginPageURL = `${window.location.protocol}//${window.location.host}/login`;
    window.location.href = loginPageURL;
  });
  