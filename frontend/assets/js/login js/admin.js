document.getElementById('dashboard-btn').addEventListener('click', function() {
    showSection('dashboard');
});

document.getElementById('user-management-btn').addEventListener('click', function() {
    showSection('user-management');
});

document.getElementById('transaction-management-btn').addEventListener('click', function() {
    showSection('transaction-management');
});

document.getElementById('profile-management-btn').addEventListener('click', function() {
    showSection('profile-management');
});

document.getElementById('settings-btn').addEventListener('click', function() {
    showSection('settings');
});

document.getElementById('Notification-btn').addEventListener('click', function() {
    showSection('Notification-box');
});

document.getElementById('check-status-btn').addEventListener('click', function() {
    showSection('check-loan-status-box');
});
document.getElementById('pay-loan-btn').addEventListener('click', function() {
    showSection('Pay-Loan-box');
});

// Function to hide all sections and show the selected one
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.box');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}
document.getElementById("edit-profile-btn").addEventListener("click", () => {
    hideAllSections();
    document.getElementById("edit-profile").style.display = "block";
  });
  
  function hideAllSections() {
    const sections = document.querySelectorAll(".box");
    sections.forEach(section => section.style.display = "none");
  }
  
  document.getElementById("logout-btn").addEventListener("click", () => {
    // Optional: Clear any user session data here if stored in localStorage/sessionStorage
    localStorage.clear();

    // Redirect to the login page
    window.location.replace("index.html");
});


// Initialize by showing the Dashboard content
showSection('dashboard');
