function showPaymentPopup1() 
{
    document.getElementById("paymentWarningPopup").style.display = "flex";
}
function closePopofNotes() 
{
    document.getElementById("paymentWarningPopup").style.display = "none";
}

//   ---------------------------------------------------------------------------------------
function showPaymentPopup() 
{
    const aadhar = document.getElementById("addmoney-aadhar").value.trim();
    const pan = document.getElementById("addmoney-pan").value.trim();
    const gmail = document.getElementById("addmoney-gmail").value.trim();
    const password = document.getElementById("addmoney-password").value.trim();
    const amount = document.getElementById("addmoney").value.trim();
    const userId = localStorage.getItem('userId');
    const statusMsg = document.getElementById("addmoney-status-message");

    // Reset message
    statusMsg.textContent = "";
    statusMsg.style.color = "red";

    // Basic validation
    if (!aadhar || !pan || !gmail || !password || !amount) {
        statusMsg.textContent = "All fields are required.";


         // Hide after 3 seconds
         setTimeout(() => {
            statusMsg.textContent = "";
        }, 5000);

        return;
    }

    // Send data to backend
    fetch('http://localhost:8080/api/user/add-money-request', 
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            aadhar: aadhar,
            pan: pan,
            gmail: gmail,
            paymentPassword: password,
            amount: amount,
            userId : userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) 
        {
            document.getElementById("processing-status").innerHTML = "";
            statusMsg.textContent = "Proceeding now...";
            statusMsg.style.color = "green";
            setTimeout(() => {
              document.getElementById("payment-popup").style.display = "flex";
          }, 5000);
        } 
        else 
        {
          if (data.message === "Generate Payment Password") 
          {
            document.getElementById("paymentWarningPopup").style.display = "flex";
            statusMsg.textContent = data.message || "Transaction failed.";
          }
           else
           {
            statusMsg.textContent = data.message;
           }
            setTimeout(() => {
                statusMsg.textContent = "";
            }, 5000);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        statusMsg.textContent = "Server error. Please try again.";
        setTimeout(() => {
            statusMsg.textContent = "";
        }, 5000);

    });
}


// --------------------------------------------------------------------------------------
function closePaymentPopup() 
{
  document.getElementById("payment-popup").style.display = "none";
}

function submitPaymentOtp() 
{
  const userId = localStorage.getItem('userId');
  const otp = document.getElementById("payment-otp").value.trim();
  const status = document.getElementById("processing-status");
  const submitBtn = document.querySelector(".popup-buttons button:first-child");
  const statusGif = document.getElementById("status-gif");
  const amount = document.getElementById("addmoney").value.trim();
  if (!otp) 
{
    status.innerHTML = "<span style='color:red;'>Please enter the OTP.</span>";
    return;
}
submitBtn.disabled = true;

  // Show "Processing..."
  status.innerHTML = "<span style='color:orange;'>Processing...</span>";

  fetch("http://localhost:8080/api/verify-AddPayment-otp", 
    {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId:userId, otp: otp,amount:amount})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Show green tick
      statusGif.src = "assets/images/success.gif"; 
      status.innerHTML = "<span style='color:green; font-size: 24px;'>✅ Payment Compleated ✅</span>";
      setTimeout(() => location.reload(), 4000);
      // You can add further logic here like hiding popup after 2 seconds
    } else {
        statusGif.style.display = "none";
      status.innerHTML = "<span style='color:red;'>Incorrect OTP. Try again.</span>";
      setTimeout(() => location.reload(), 3000);
    }
  })
  .catch(err => {
    console.error(err);
    statusGif.style.display = "none";
    status.innerHTML = "<span style='color:red;'>Server error. Try again later.</span>";
  });
}

// ====================================================================================END OF ADD PAYMENT
// Function to handle the submission of Send Money form
document.getElementById("sendmoney-submit-btn").addEventListener("click", function() {
  // Get values from the form inputs
  const receiverAadhar = document.getElementById("sendmoney-aadhar-Reciever").value.trim();
  const receiverPan = document.getElementById("sendmoney-pan-yours").value.trim();
  const loginPassword = document.getElementById("sendmoney-gmail-yours").value.trim();
  const paymentPassword = document.getElementById("sendmoney-password-yours").value.trim();
  const amount = document.getElementById("sendmoney-yours").value.trim();
  const userId = localStorage.getItem('userId');
  const statusMsg = document.getElementById("sendmoney-status-message");

  // Clear previous status message
  statusMsg.textContent = "";
  statusMsg.style.color = "red";

  // Basic validation
  if (!receiverAadhar || !receiverPan || !loginPassword || !paymentPassword || !amount) {
      statusMsg.textContent = "All fields are required.";
      statusMsg.style.color = "red";
      // Hide after 3 seconds
      setTimeout(() => {
        statusMsg.textContent = "";
    }, 5000);

    return;
  }

  // Validate amount (ensure it's a positive number)
  if (isNaN(amount) || Number(amount) <= 0) {
      statusMsg.textContent = "Please enter a valid amount.";
      statusMsg.style.color = "red";
      return;
  }

  // Send data to backend (adjust the API endpoint as necessary)
  fetch('http://localhost:8080/api/send-money-request', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          receiverAadhar: receiverAadhar,
          receiverPan: receiverPan,
          loginPassword: loginPassword,
          paymentPassword: paymentPassword,
          amount: amount,
          userId: userId
      })
  })
  .then(response => response.json())
  .then(data => 
    {
      if (data.success) 
      {
          document.getElementById("processing-status").innerHTML = "";
          statusMsg.textContent = "Proceeding now...";
          statusMsg.style.color = "green";
          setTimeout(() => {
            document.getElementById("sendmoney-popup").style.display = "flex";
        }, 5000);

          // // Optionally clear the form after submission
          // document.getElementById("sendmoney-aadhar-Reciever").value = "";
          // document.getElementById("sendmoney-pan-yours").value = "";
          // document.getElementById("sendmoney-gmail-yours").value = "";
          // document.getElementById("sendmoney-password-yours").value = "";
          // document.getElementById("sendmoney-yours").value = "";
      } 
      else 
      {
        if (data.message === "Generate Payment Password") 
        {
          document.getElementById("paymentWarningPopup").style.display = "flex";
          statusMsg.textContent = data.message || "Transaction failed.";
        }
         else
         {
          statusMsg.textContent = data.message;
         }
          setTimeout(() => 
            {
              statusMsg.textContent = "";
          }, 5000);
      }
  })
  .catch(error => {
      console.error("Error:", error);
      statusMsg.textContent = "Server error. Please try again later.";
      statusMsg.style.color = "red";
      setTimeout(() => 
        {
          statusMsg.textContent = "";
      }, 5000);
  });
});

// Optional: Redirect user to generate payment password
function goToGeneratePassword() {
  window.location.href = "generate-password.html"; // Adjust the URL as needed
}



// ----------------------------------------------------------------------------------------------------
// Show the Send Money Payment Popup
function showSendMoneyPopup() {
  document.getElementById("sendmoney-popup").style.display = "flex";
}

// Close the Send Money Payment Popup
function closeSendMoneyPopup() 
{
  document.getElementById("sendmoney-popup").style.display = "none";
}

function closeSendMoneyPopupofLoanPayment() 
{
  document.getElementById("pay-loan-popup").style.display = "none";
  setTimeout(() => location.reload(), 1000);
}

// Submit the OTP for Send Money
function submitSendMoneyOtpofUser() {
  const userId = localStorage.getItem('userId');
  const otp = document.getElementById("sendmoney-payment-otp").value.trim();
  const status = document.getElementById("sendmoney-processing-status");
  const submitBtn = document.querySelector(".sendmoney-popup-buttons button:first-child");
  const statusGif = document.getElementById("sendmoney-status-gif");
  const amount = document.getElementById("sendmoney-yours").value.trim();
  const receiverAadhar = document.getElementById("sendmoney-aadhar-Reciever").value.trim();

  // Basic validation for OTP
  if (!otp) {
      status.innerHTML = "<span style='color:red;'>Please enter the OTP.</span>";
      return;
  }

  submitBtn.disabled = true;

  // Show "Processing..."
  status.innerHTML = "<span style='color:orange;'>Processing...</span>";

  // Send OTP to backend for verification
  fetch("http://localhost:8080/api/verify-SendPayment-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, otp: otp, amount: amount, receiverAadhar:receiverAadhar })
  })
  .then(res => res.json())
  .then(data => 
    {
      if (data.success) 
        {
          // Show green tick and successful payment message
          statusGif.src = "assets/images/success.gif";
          status.innerHTML = "<span style='color:green; font-size: 24px;'>✅ Payment Completed ✅</span>";
          setTimeout(() => location.reload(), 4000);
      } 
      else {
          // Display error message for incorrect OTP
          statusGif.style.display = "none";
          status.innerHTML = "<span style='color:red;'>Incorrect OTP. Try again.</span>";
      }
  })
  .catch(err => {
      // Handle any server errors
      console.error(err);
      statusGif.style.display = "none";
      status.innerHTML = "<span style='color:red;'>Server error. Try again later.</span>";
  });
}
// ========================================================================================

// ==========================================================================Pay loan js 1

// ✅ SEARCH BUTTON HANDLER WITH ERROR HANDLING
document.getElementById('searchLoanBtn').addEventListener('click', function() {
  const applicationId = document.getElementById('applicationIdInput').value.trim();

  fetch(`http://localhost:8080/api/loan/search/${applicationId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Server returned an error: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.found) 
        {
        document.getElementById('detailApplicationId').textContent = data.application_id;
        document.getElementById('detailName').textContent = data.name;
        document.getElementById('detailAadhaar').textContent = data.aadhaar_card;
        document.getElementById('detailLoanAmount').textContent = data.loan_amount;

        document.getElementById('loanDetails').style.display = 'block';
        document.getElementById('loanMessage').textContent = '';
      } else {
        document.getElementById('loanDetails').style.display = 'none';
        document.getElementById('loanMessage').textContent = 'No record found!';
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      document.getElementById('loanDetails').style.display = 'none';
      document.getElementById('loanMessage').textContent = 'Error occurred while searching. Please try again.';
    });
});

// ✅ PAY BUTTON HANDLER WITH ERROR HANDLING
document.getElementById('payLoanBtn').addEventListener('click', function() {
  const payAmount = document.getElementById('payAmount').value.trim();
  const applicationId = document.getElementById('detailApplicationId').textContent;
  const userId = localStorage.getItem('userId');
  const statusMsg = document.getElementById("loanMessage");

  fetch(`http://localhost:8080/api/loan/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId: applicationId, amount: payAmount,userId:userId})
  })
    .then(response => 
      {
      if (!response.ok) 
        {
        throw new Error('Server returned an error: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) 
      {
        // document.getElementById("pay-loan-popup").style.display = "flex";
        statusMsg.textContent = "Proceeding Now";
        statusMsg.style.color = "green";
        setTimeout(function() {document.getElementById("pay-loan-popup").style.display = "flex";}, 4000);
        // document.getElementById('loanMessage').textContent = 'Payment successful!';
      } 
      else 
      {
        statusMsg.style.color = "red";
        document.getElementById('loanMessage').textContent = 'Payment failed: ' + (data.message || 'Unknown error');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
   
      statusMsg.textContent = "Error occurred while processing payment. Please try again.";
      statusMsg.style.color = "red";
    });
});

// ================================================================================Loan payment js

// Function when clicking "Verify & Proceed"
function submitSendMoneyOtp() 
{
  const otpInput = document.getElementById('payloan-payment-otp').value.trim();
  const userId = localStorage.getItem('userId');
  const payAmount = document.getElementById('payAmount').value.trim();
  const applicationId = document.getElementById('detailApplicationId').textContent;
  const statusMsg = document.getElementById('payloan-processing-status');
  const loadingGif = document.getElementById('sendmoney-status-gif');

  // Clear any previous messages
  statusMsg.textContent = '';

  // Simple validation
  if (otpInput.length !== 6 || !/^\d{6}$/.test(otpInput)) 
    {
      statusMsg.textContent = 'Please enter a valid 6-digit OTP.';
      statusMsg.style.color = 'red';
      return;
  }

  // Show loading gif
  loadingGif.style.display = 'inline-block';

  statusMsg.style.color = 'green';
  statusMsg.textContent = 'Processing...';

  // Simulate API call (replace this fetch with your real API endpoint)
  fetch('http://localhost:8080/api/loan/verify-otp', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId:userId, otp: otpInput,payAmount:payAmount,applicationId:applicationId})
  })
  .then(response => response.json())
  .then(data => {
      loadingGif.style.display = 'none';
      if (data.success) 
        {
          statusMsg.style.color = 'green';
          statusMsg.textContent = 'Payment confirmed successfully!';
          // Optional: Close popup after delay
          setTimeout(() => {
              closeSendMoneyPopupofLoanPayment();
          }, 1500);
      } 
      else 
      {
          statusMsg.textContent = 'Invalid OTP. Please try again.';
          statusMsg.style.color = 'red';
      }
  })
  .catch(error => {
      loadingGif.style.display = 'none';
      statusMsg.textContent = 'Error verifying OTP. Try again.';
      statusMsg.style.color = 'red';
      console.error('OTP verification error:', error);
      // setTimeout(() => location.reload(), 3000);
  });
}

