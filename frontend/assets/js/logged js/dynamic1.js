document.addEventListener("DOMContentLoaded", () => {
  const userid = localStorage.getItem("userId"); // or use "userid" if that's the key
  document.getElementById("popup-blur").style.display = "none";
  if (userid) 
  {
    fetch(`http://localhost:8080/api/user/profile/${userid}`)
      .then(response => {
        if (!response.ok) 
        {
          throw new Error("Profile not found");
        }
        return response.json();
      })
      .then(data => {
        document.getElementById("user-name").innerText = data.fullname;
        document.getElementById("profile-pic").src = "data:image/png;base64," + data.profilePicBase64;

        document.getElementById("user-name-dashboard").innerText = data.fullname;
        document.getElementById("profile-pic-dashboard").src = "data:image/png;base64," + data.profilePicBase64;

      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        window.location.href = "index.html";
      });
  } else {
    console.error("User ID not found in localStorage.");
    window.location.href = "index.html";
  }
});


// window.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("popup-blur").style.display = "none";
// });

// --------------------------------------------------------------------------------dashboard to fecth
// Function to fetch user dashboard data from the backend
function fetchUserDashboard(userId) {
  fetch(`http://localhost:8080/api/user/dashboard?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
          if (data) {
              // Populate the dashboard with the fetched data
              document.getElementById("fullname").textContent = data.fullname;
              document.getElementById("mobile").textContent = data.mobile;
              document.getElementById("aadhar").textContent = data.aadhar;
              document.getElementById("pan").textContent = data.pan_id;
              document.getElementById("address").textContent = data.address;
              document.getElementById("email").textContent = data.email;
              document.getElementById("status").textContent = data.status;
              document.getElementById("balance").textContent = data.balance;
          } else {
              console.error("No data found for the provided userId.");
          }
      })
      .catch(error => {
          console.error("Error fetching dashboard data:", error);
      });
}

// Call fetchUserDashboard function on page load or when the section becomes visible
document.addEventListener("DOMContentLoaded", function () 
{
  const userId1 = localStorage.getItem("userId");
  fetchUserDashboard(userId1);
});



// ---------------------------------------------------------------------------check server health status -dashboard
    async function checkServerStatus() {
        try {
            const response = await fetch('http://localhost:8080/api/health-check', {
                method: 'GET',
                cache: 'no-store',
            });

            if (!response.ok) 
            {
                throw new Error('Server not responding');
            }
            document.getElementById("server-error-dashboard").style.display = "none";
            document.getElementById("server-error-sendMoney").style.display = "none";
            document.getElementById("server-error-editProfile").style.display = "none";
            document.getElementById("date-time-dashboard").style.display = "block";
            
        } catch (error) 
        {
          document.getElementById("server-error-sendMoney").style.display = "block";
          document.getElementById("server-error-dashboard").style.display = "block";
          document.getElementById("server-error-editProfile").style.display = "block";
          document.getElementById("date-time-dashboard").style.display = "none";


        }
    }

    // Call the check once on page load
    window.addEventListener("load", () => 
      {
        checkServerStatus();
        // checkServerStatus1();
        // Optional: Repeat every 15 seconds
        setInterval(checkServerStatus, 5000);
    });



// ---------------------------------------------------------------------------fetching trans from db 5 sec - history
const userId = localStorage.getItem("userId");

fetch(`http://localhost:8080/api/transactions/${userId}`)
  .then(response => response.json())
  .then(data => {
    const tableBody = document.querySelector("#transactionsTable tbody");
    tableBody.innerHTML = ""; // clear previous rows

    data.forEach(tx => {
      const isSender = tx.senderId === userId;
      const transactionType = isSender ? "Debited" : "Credited";
      const amount = isSender ? tx.debited : tx.credited;
      const counterParty = isSender ? tx.receiverId : tx.senderId;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.utrId}</td>
        <td>${isSender ? "You" : counterParty}</td>
        <td>${isSender ? counterParty : "You"}</td>
        <td>${!isSender ? amount : "-"}</td>
        <td>${isSender ? amount : "-"}</td>
        <td>${new Date(tx.timeStamp).toLocaleString()}</td>
        <td>${tx.paymentStatus}</td>
       
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error("Error fetching transactions:", error));



//---------------------------------------------------------------transaction history search js
document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId");
  const tableBody = document.querySelector("#transactionsTable tbody");
  const searchInput = document.getElementById("utrSearch");
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearSearchBtn");

  let allTransactions = [];

  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(tx => {
      const isSender = tx.senderId === userId;
      const isReceiver = tx.receiverId === userId;

      if (!isSender && !isReceiver) return; // only show if user is sender or receiver

      const amount = isSender ? tx.debited : tx.credited;
      const counterParty = isSender ? tx.receiverId : tx.senderId;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.utrId}</td>
        <td>${isSender ? "You" : counterParty}</td>
        <td>${isSender ? counterParty : "You"}</td>
        <td>${!isSender ? amount : "-"}</td>
        <td>${isSender ? amount : "-"}</td>
        <td>${new Date(tx.timeStamp).toLocaleString()}</td>
        <td>${tx.paymentStatus}</td>
      
      `;
      tableBody.appendChild(row);
    });
  }

  function fetchTransactions() {
    fetch(`http://localhost:8080/api/transactions/${userId}`)
      .then(response => response.json())
      .then(data => {
        allTransactions = data;
        renderTable(data);
      })
      .catch(err => {
        console.error("Error fetching transaction history:", err);
      });
  }

  searchBtn.addEventListener("click", () => {
    const searchUTR = searchInput.value.trim();
    if (searchUTR === "") return;

    const filtered = allTransactions.filter(tx => tx.utrId === searchUTR);
    renderTable(filtered);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderTable(allTransactions);
  });


  fetchTransactions();
  // setInterval(fetchTransactions, 15000); 
});

