// ====================================================================Choose type of loan
function showLoanForm(type) {
    const userId = localStorage.getItem("userId"); // assuming you're storing userId in localStorage

    if (!userId) {
        alert("User not logged in.");
        return;
    }

    const messageBox = document.getElementById("already-applied-message");
    messageBox.style.display = "none"; // Hide message initially
    // Check with backend first if the user has already applied
    fetch(`http://localhost:8080/api/loan/check-applied/${type}/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.alreadyApplied) {

                messageBox.style.display = "block";
                document.getElementById("ug-loan-form").style.display = "none";
                document.getElementById("pg-loan-form").style.display = "none";
                document.getElementById("abroad-loan-form").style.display = "none";
            } else {
                // Store selected type and show form
                localStorage.setItem("selectedLoanType", type);
                console.log("Loan type selected:", type);
                document.getElementById("ug-loan-form").style.display = "none";
                document.getElementById("pg-loan-form").style.display = "none";
                document.getElementById("abroad-loan-form").style.display = "none";
                document.getElementById(`${type}-loan-form`).style.display = "grid";
            }
        })
        .catch(error => {
            console.error("Error checking loan application:", error);
            alert("Something went wrong while checking loan status.");
        });
}

// ============================================================================================UG
document.getElementById("ug-loan-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const statusMsg = document.getElementById("message-loan-ug");
    const messageBox = document.querySelector(".pulse-alert-box-ug");

    // Clear previous message
    statusMsg.textContent = "";
    statusMsg.style.color = "red";

    // Show the message box
    messageBox.style.display = "block";

    const fields = {
        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value.trim(),
        dob: document.getElementById("dob").value.trim(),
        tenthPercentage: document.getElementById("tenth-percentage").value.trim(),
        twelfthPercentage: document.getElementById("twelfth-percentage").value.trim(),
        universityName: document.getElementById("university-name").value.trim(),
        courseName: document.getElementById("course-name").value.trim(),
        courseDuration: document.getElementById("course-duration").value.trim(),
        counselingCode: document.getElementById("counseling-code").value.trim(),
        aadhaarCard: document.getElementById("aadhaar-card").value.trim(),
        panCard: document.getElementById("pan-card").value.trim(),
        fatherIncome: document.getElementById("father-income").value.trim(),
        loanAmount: document.getElementById("loan-amount").value.trim()
    };

    for (const key in fields) {
        if (fields[key] === "") {
            statusMsg.textContent = `Please fill in the ${key.replace(/([A-Z])/g, ' $1')}.`;
            return;
        }
    }

    const collateralFiles = document.getElementById("collateral-documents-ug").files;
    if (collateralFiles.length === 0) {
        statusMsg.textContent = "Please upload at least one collateral document.";
        return;
    }

    // Check if all uploaded files are PDFs
    for (let i = 0; i < collateralFiles.length; i++) {
        if (collateralFiles[i].type !== "application/pdf") {
            statusMsg.textContent = "Only PDF files are allowed for collateral documents.";
            return;
        }
    }

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(fields)], { type: "application/json" }));

    for (let i = 0; i < collateralFiles.length; i++) {
        formData.append("collateralDocuments", collateralFiles[i]);
    }

    fetch("http://localhost:8080/api/loan/ug", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        statusMsg.textContent = data.message || "Application submitted successfully.";
        statusMsg.style.color = "green";
    })
    .catch(error => {
        console.error("Error submitting UG loan details:", error);
        statusMsg.textContent = "Failed to submit UG loan application. Try again later.";
    });
});


// ================================================================================================PG
document.getElementById("pg-loan-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const statusMsg = document.getElementById("message-loan-pg");
    const messageBox = document.querySelector(".pulse-alert-box-pg");

    // Clear previous message
    statusMsg.textContent = "";
    statusMsg.style.color = "red";

    // Show the message box
    messageBox.style.display = "block";

    const fields = {
        name: document.getElementById("pg-name").value.trim(),
        age: document.getElementById("pg-age").value.trim(),
        dob: document.getElementById("pg-dob").value.trim(),
        tenthPercentage: document.getElementById("pg-tenth-percentage").value.trim(),
        twelfthPercentage: document.getElementById("pg-twelfth-percentage").value.trim(),
        cgpa: document.getElementById("pg-cgpa").value.trim(),
        universityName: document.getElementById("pg-university-name").value.trim(),
        courseName: document.getElementById("pg-course-name").value.trim(),
        courseDuration: document.getElementById("pg-course-duration").value.trim(),
        counselingCode: document.getElementById("pg-counseling-code").value.trim(),
        aadhaarCard: document.getElementById("pg-aadhaar-card").value.trim(),
        panCard: document.getElementById("pg-pan-card").value.trim(),
        fatherIncome: document.getElementById("pg-father-income").value.trim(),
        loanAmount: document.getElementById("pg-loan-amount").value.trim()
    };

    for (const key in fields) {
        if (fields[key] === "") {
            statusMsg.textContent = `Please fill in the ${key.replace(/([A-Z])/g, ' $1')}.`;
            return;
        }
    }

    const collateralFiles = document.getElementById("collateral-documents-pg").files;
    if (collateralFiles.length === 0) {
        statusMsg.textContent = "Please upload at least one collateral document.";
        return;
    }

    // Ensure all uploaded files are PDFs
    for (let i = 0; i < collateralFiles.length; i++) {
        if (collateralFiles[i].type !== "application/pdf") {
            statusMsg.textContent = "Only PDF files are allowed for collateral documents.";
            return;
        }
    }

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(fields)], { type: "application/json" }));

    for (let i = 0; i < collateralFiles.length; i++) {
        formData.append("collateralDocuments", collateralFiles[i]);
    }

    fetch("http://localhost:8080/api/loan/pg", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        statusMsg.textContent = data.message || "PG loan application submitted successfully.";
        statusMsg.style.color = "green";
    })
    .catch(error => {
        console.error("Error submitting PG loan details:", error);
        statusMsg.textContent = "Failed to submit PG loan application. Try again later.";
    });
});
// ==========================================================================================Abroad
document.getElementById("abroad-loan-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const messageBox = document.querySelector(".pulse-alert-box-abroad");

    const messageText = document.getElementById("message-loan-abroad");

    // Show message box
    messageBox.style.display = "block";
    messageText.style.color = "red";

    // Field values
    const fields = {
        name: document.getElementById("abroad-name").value.trim(),
        fatherName: document.getElementById("father-name").value.trim(),
        motherName: document.getElementById("mother-name").value.trim(),
        community: document.getElementById("community").value.trim(),
        age: document.getElementById("abroad-age").value.trim(),
        dob: document.getElementById("abroad-dob").value.trim(),
        tenthPercentage: document.getElementById("abroad-tenth-percentage").value.trim(),
        twelfthPercentage: document.getElementById("abroad-twelfth-percentage").value.trim(),
        ugPg: document.getElementById("abroad-ug-pg").value.trim(),
        universityName: document.getElementById("university-name-abroad").value.trim(),
        courseName: document.getElementById("course-name-abroad").value.trim(),
        courseDuration: document.getElementById("course-duration-abroad").value.trim(),
        aadhaarCard: document.getElementById("aadhaar-card-abroad").value.trim(),
        panCard: document.getElementById("pan-card-abroad").value.trim(),
        fatherIncome: document.getElementById("father-income-abroad").value.trim(),
        travelExpenses: document.getElementById("travel-expenses").value.trim(),
        loanAmount: document.getElementById("loan-amount-abroad").value.trim()
    };

    // Validation check
    for (const key in fields) {
        if (fields[key] === "") {
            messageText.textContent = `Please fill in the ${key.replace(/([A-Z])/g, ' $1')}.`;
            return;
        }
    }

    const collateralFiles = document.getElementById("collateral-documents-abroad").files;
    if (collateralFiles.length === 0) {
        messageText.textContent = "Please upload at least one collateral document.";
        return;
    }

    for (let i = 0; i < collateralFiles.length; i++) {
        if (collateralFiles[i].type !== "application/pdf") {
            messageText.textContent = "Only PDF files are allowed for collateral documents.";
            return;
        }
    }

    // Prepare data
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(fields)], { type: "application/json" }));

    for (let i = 0; i < collateralFiles.length; i++) {
        formData.append("collateralDocuments", collateralFiles[i]);
    }

    // Submit via fetch
    fetch("http://localhost:8080/api/loan/abroad", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            messageText.textContent = data.message || "Abroad loan application submitted successfully.";
            messageText.style.color = "green";
        })
        .catch(error => {
            console.error("Error submitting abroad loan form:", error);
            messageText.textContent = "Failed to submit abroad loan application. Try again later.";
        });
});
// ================================================================================================

document.getElementById("check-status-btn").addEventListener("click", function () {
    document.querySelectorAll(".box").forEach(box => box.style.display = "none");
    document.getElementById("check-loan-status-box").style.display = "block";
  
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:8080/api/loan-status?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById("loan-status-list");
        container.innerHTML = "";
  
        if (data.length === 0) {
          container.innerHTML = "<p>No loan status found.</p>";
          return;
        }
  
        const loanBox = document.createElement("div");
        loanBox.className = "loan-box";
  
        const title = document.createElement("div");
        title.className = "loan-box-title";
        title.textContent = "Your Loan Applications";
  
        const details = document.createElement("div");
        details.className = "loan-details";
  
        data.forEach(item => {
          const itemBox = document.createElement("div");
          itemBox.className = "loan-item";
          itemBox.innerHTML = `
          <strong>Loan Type:</strong> ${item.loanType}<br>
          <strong>App ID:</strong> ${item.applicationId}<br>
          <strong>Name:</strong> ${item.name}<br>
          <strong>Amount:</strong> ₹${item.loanAmount}<br>
          <strong>Date:</strong> ${item.applicationDate}<br>
          <strong>Status:</strong> ${item.status}
        `;        
          details.appendChild(itemBox);
        });
  
        loanBox.appendChild(title);
        loanBox.appendChild(details);
        container.appendChild(loanBox);
      })
      .catch(error => {
        console.error("Error fetching loan status:", error);
      });
  });
  

// document.getElementById('check-status-btn').addEventListener('click', () => {
//     document.querySelectorAll('.box').forEach(box => box.style.display = 'none');
//     document.getElementById('check-loan-status-box').style.display = 'block';

//     const userId = localStorage.getItem("userId"); // or wherever you store logged-in user ID

//     fetch(`http://localhost:8080/api/loan-status?userId=${userId}`)
//         .then(response => response.json())
//         .then(data => {
//             const container = document.getElementById('notification-list');
//             container.innerHTML = '';

//             if (data.length === 0) {
//                 container.innerHTML = '<p>No loan applications found.</p>';
//                 return;
//             }

//             data.forEach(item => {
//                 const div = document.createElement('div');
//                 div.className = 'loan-status-item';
//                 div.innerHTML = `
//                     <p><strong>Loan Type:</strong> ${item.loanType}</p>
//                     <p><strong>Application ID:</strong> ${item.applicationId}</p>
//                     <p><strong>Name:</strong> ${item.name}</p>
//                     <p><strong>Loan Amount:</strong> ₹${item.loanAmount}</p>
//                     <p><strong>Application Date:</strong> ${new Date(item.applicationDate).toLocaleString()}</p>
//                     <p><strong>Status:</strong> ${item.status}</p>
//                     <hr>
//                 `;
//                 container.appendChild(div);
//             });
//         })
//         .catch(error => {
//             document.getElementById('notification-list').innerHTML = `<p style="color:red;">Error loading loan status.</p>`;
//             console.error("Error fetching loan status:", error);
//         });
// });

