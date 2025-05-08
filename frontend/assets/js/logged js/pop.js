
// ----------------------------------------------------------------------Password change pop up js
document.addEventListener("DOMContentLoaded", () => {
    const otpPopup = document.getElementById("otp-popup");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");

    // OPTIONAL: If you're showing the popup from another button (like Save Changes)
    // You must manually show it like this:
    // document.getElementById("showOtpPopupBtn").addEventListener("click", () => {
    //     otpPopup.classList.remove("hidden");
    // });

    verifyOtpBtn.addEventListener("click", () => {
        const otp = document.getElementById("otpInput").value;
        const userId = localStorage.getItem("userId"); // or fetch from somewhere
        const newPassword = document.getElementById('newPassword').value;
        const otpMessage = document.getElementById("otpMessage");

        fetch("http://localhost:8080/api/verify-otp-pop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, otp,newPassword }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                otpMessage.style.color = "green";
                otpMessage.textContent = data.message;
                alert(data.message || "Password changed Successfully You Have been Logged out!!!");
                setTimeout(() => location.reload(), 5000); // or redirect
                localStorage.clear();
                window.location.replace("index.html");
            }
             else {
                otpMessage.style.color = "red";
                otpMessage.textContent = data.message;
                setTimeout(() => location.reload(), 3000);
            }
        })
        .catch(err => {
            otpMessage.style.color = "red";
            otpMessage.textContent = "Something went wrong.";
        });
    });
});

// ----------------------------------------------------------------------Payment Password change pop up js
document.addEventListener("DOMContentLoaded", () => {
    const otpPopup = document.getElementById("otp-popup");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn-generatepaymentpassword");

    // OPTIONAL: If you're showing the popup from another button (like Save Changes)
    // You must manually show it like this:
    // document.getElementById("showOtpPopupBtn").addEventListener("click", () => {
    //     otpPopup.classList.remove("hidden");
    // });

    verifyOtpBtn.addEventListener("click", () => {
        const otpofpaymentpassword = document.getElementById("otpInput-generatepaymentpassword").value;
        const userId = localStorage.getItem("userId"); // or fetch from somewhere
        const paymentPassword = document.getElementById('generatepaymentpassword').value;
        const otpMessage = document.getElementById("otpMessage-generatepaymentpassword");

        fetch("http://localhost:8080/api/verify-otp-generatePaymentPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, paymentPassword,otpofpaymentpassword }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message || " Payment Password changed Successfully ✅");
                otpMessage.style.color = "green";
                otpMessage.textContent = data.message;
                // alert(data.message || " Payment Password changed Successfully ✅");
                setTimeout(() => location.reload(), 5000); // or redirect
            }
             else {
                otpMessage.style.color = "red";
                otpMessage.textContent = data.message;
                setTimeout(() => location.reload(), 3000);
            }
        })
        .catch(err => {
            otpMessage.style.color = "red";
            otpMessage.textContent = "Something went wrong.";
        });
    });
});


// ----------------------------------------------------------------------Mobile change pop up js
document.addEventListener("DOMContentLoaded", () => {
    const otpPopup = document.getElementById("otp-popup1");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn1");

    // OPTIONAL: If you're showing the popup from another button (like Save Changes)
    // You must manually show it like this:
    // document.getElementById("showOtpPopupBtn").addEventListener("click", () => {
    //     otpPopup.classList.remove("hidden");
    // });

    verifyOtpBtn.addEventListener("click", () => {
        const otp = document.getElementById("otpInput1").value;
        const userId = localStorage.getItem("userId"); // or fetch from somewhere
        const newMobile = document.getElementById('newMobile').value;
        const otpMessage = document.getElementById("otpMessage1");

        fetch("http://localhost:8080/api/verify-otp-pop-mobile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, otp,newMobile }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                otpMessage.style.color = "green";
                otpMessage.textContent = data.message;
                alert(data.message || "Mobile Number Changed Successfully");
                setTimeout(() => location.reload(), 5000); // or redirect
            }
             else {
                otpMessage.style.color = "red";
                otpMessage.textContent = data.message;
                setTimeout(() => location.reload(), 3000);
            }
        })
        .catch(err => {
            otpMessage.style.color = "red";
            otpMessage.textContent = "Something went wrong.";
        });
    });
});



// ----------------------------------------------------------------------Address change  pop up js
document.addEventListener("DOMContentLoaded", () => {
    const otpPopup = document.getElementById("otp-popup2");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn2");

    // OPTIONAL: If you're showing the popup from another button (like Save Changes)
    // You must manually show it like this:
    // document.getElementById("showOtpPopupBtn").addEventListener("click", () => {
    //     otpPopup.classList.remove("hidden");
    // });

    verifyOtpBtn.addEventListener("click", () => {
        const otp = document.getElementById("otpInput2").value;
        const userId = localStorage.getItem("userId"); // or fetch from somewhere
        const addresshome = document.getElementById('newAddress').value;
        const otpMessage = document.getElementById("otpMessage2");
        fetch("http://localhost:8080/api/verify-otp-pop-address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ addresshome,otp,userId }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                otpMessage.style.color = "green";
                otpMessage.textContent = data.message;
                alert(data.message || "Home Address Changed Successfully");
                setTimeout(() => location.reload(), 5000); // or redirect
            }
             else {
                otpMessage.style.color = "red";
                otpMessage.textContent = data.message;
                setTimeout(() => location.reload(), 3000);
            }
        })
        .catch(err => {
            otpMessage.style.color = "red";
            otpMessage.textContent = "Something went wrong.";
        });
    });
});

// ----------------------------------------------------------------------email  change pop up js 
// Show the popup
function showPopup() {
    document.getElementById('popup-blur').style.display = 'flex';
}

// Hide the popup
function closePopup() {
    document.getElementById('popup-blur').style.display = 'none';
}

// Handle OTP submission
function submitOtp() {
    const oldOtp = document.getElementById('oldEmailOtp').value.trim();
    const newOtp = document.getElementById('newEmailOtp').value.trim();
    const newEmail = document.getElementById("newEmail").value;
    const userId = localStorage.getItem('userId');
    const messageDiv = document.getElementById('otp-message');

    messageDiv.style.display = 'none';
    messageDiv.textContent = '';

    if (oldOtp === '' || newOtp === '') {
        showMessage('Both OTPs are required.', 'error');
        return;
    }

    // Replace this with your actual backend endpoint
    fetch('http://localhost:8080/api/email/verify-dual-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId:userId, oldOtp: oldOtp, newOtp: newOtp , newEmail: newEmail})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success === "true") {
            alert("Email chamged suffessfully - "+newEmail);
            showMessage('OTP Verified Successfully!', 'success');
            setTimeout(() => {
                closePopup();
                location.reload();
            }, 3000);
        } else {
            alert("Invalid Otp , try again");
            showMessage(data.message || data.error || 'OTP verification failed.', 'error');
        }
        
    })
    .catch(err => {
        alert("Server down ! , Try again later");
        console.error(err);
        showMessage('An error occurred. Try again.', 'error');
    });
}

// Show message
function showMessage(msg, type) {
    const messageDiv = document.getElementById('otp-message');
    messageDiv.style.display = 'block';
    messageDiv.textContent = msg;
    messageDiv.style.color = type === 'success' ? 'green' : 'red';
}

// ----------------------------------------------------------------------Take action pop up js 
document.addEventListener("DOMContentLoaded", () => 
    {
    const otpPopup = document.getElementById("otp-popup4");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn4");

    // OPTIONAL: If you're showing the popup from another button (like Save Changes)
    // You must manually show it like this:
    // document.getElementById("showOtpPopupBtn").addEventListener("click", () => {
    //     otpPopup.classList.remove("hidden");
    // });

    verifyOtpBtn.addEventListener("click", () => {
        const otp = document.getElementById("otpInput4").value;
        const userId = localStorage.getItem("userId"); // or fetch from somewhere
        const action = document.getElementById('accountAction').value;
        const otpMessage = document.getElementById("otpMessage4");

        fetch("http://localhost:8080/api/verify-otp-pop-takeAction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, otp,action }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                otpMessage.style.color = "green";
                otpMessage.textContent = data.message;
                document.getElementById('blur-background').style.display = 'block';
                closePopupofTakeAction();
                showDeleteAccountPopup();
            }
             else 
             {
                otpMessage.style.color = "red";
                otpMessage.textContent = data.message;
                setTimeout(() => location.reload(), 3000);
            }
        })
        .catch(err => {
            otpMessage.style.color = "red";
            otpMessage.textContent = "Something went wrong.";
        });
    });
});
// ============================================================================END/
