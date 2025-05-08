// ---------------------------------------------------------------------------Password btn save button
document.getElementById('savePasswordBtn').addEventListener('click', () => 
{
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const userId = localStorage.getItem('userId');

    if (!oldPassword || !newPassword) 
        {
        alert("Please fill both old and new password.");
        return;
    }

    fetch('http://localhost:8080/api/user/update-password', 
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            oldPassword,
            newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) 
        {
            // Show OTP popup or confirmation
            document.getElementById('otp-popup').classList.remove('hidden');
        } else {
            // Show error message
            alert(data.message || "Password update failed.");
        }
    })
    .catch(err => {
        alert("Server down 🛜 - Try again Later")
        console.error('Error:', err);
    });
});


// ---------------------------------------------------------------------------Generate payment password save button
document.getElementById('saveGeneratePasswordBtn').addEventListener('click', () => {
    const generatedpassword = document.getElementById('generatepaymentpassword').value;
    const userId = localStorage.getItem('userId');

    if (!generatedpassword  || !userId) 
        {
        alert("Please fill the new Payment Password.");
        return;
    }

    fetch('http://localhost:8080/api/user/generate-payment-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            generatedpassword
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            // Show OTP popup or confirmation
            document.getElementById('generatepaymentpasswordpopup').classList.remove('hidden');
        } else {
            // Show error message
            alert(data.message || "Payment Password update failed.");
        }
    })
    .catch(err => {
        alert("Server down 🛜 - Try again Later")
        console.error('Error:', err);
    });
});

// ---------------------------------------------------------------------------Mobile btn save button

document.getElementById('saveMobileBtn').addEventListener('click', () => {
    const oldMobile = document.getElementById('oldMobile').value;
    const newMobile = document.getElementById('newMobile').value;
    const userId = localStorage.getItem('userId');


    if (!oldMobile || !newMobile) 
        {
        alert("Please fill both old and new Mobile Number.");
        return;
    }

    fetch('http://localhost:8080/api/user/update-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            oldMobile,
            newMobile
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            // Show OTP popup or confirmation
            document.getElementById('otp-popup1').classList.remove('hidden');
        } else {
            // Show error message
            alert(data.message || "Mobile Number update failed.");
        }
    })
    .catch(err => {
        alert("Server down 🛜 - Try again Later")
        console.error('Error:', err);
    });
});



// ---------------------------------------------------------------------------Address btn save button

document.getElementById('saveAddressBtn').addEventListener('click', () => {
    const addresshome = document.getElementById('newAddress').value;
    const userId = localStorage.getItem('userId');


    if (!addresshome || !userId) 
        {
        alert("Please fill the Original Address");
        return;
    }

    fetch('http://localhost:8080/api/user/update-address', 
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            addresshome,
            userId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            // Show OTP popup or confirmation
            document.getElementById('otp-popup2').classList.remove('hidden');
        } else {
            // Show error message
            alert(data.message || "Home Address update failed.");
        }
    })
    .catch(err => {
        alert("Server down 🛜 - Try again Later")
        console.error('Error:', err);
       
    });
});


// --------------------------------------------------------------------------profile pic btn save button
document.getElementById("saveProfilePicBtn").addEventListener("click", () => {
    const profilePicInput = document.getElementById("profilePic");

    if (profilePicInput.files.length === 0) {
        alert("Please choose a profile image.");
        return;
    }
    const formData = new FormData();
    const userId = localStorage.getItem('userId');
    formData.append("userId", userId);
    formData.append("profilePic", document.getElementById("profilePic").files[0]);

    fetch("http://localhost:8080/api/profile/updateProfilePic", {
      method: "POST",
      body: formData
    })
    .then(res => {
      if (res.ok)
         {
            alert("done")
            setTimeout(() => location.reload(), 1000); // or redirect
      } else {
        throw new Error("Failed to update profile picture.");
      }
    })
    .catch(err => {
        alert("Server down 🛜 - Try again Later")
        console.log(err)
    });
  });
  



// --------------------------------------------------------------------------camera profile pic btn save button
let video = document.getElementById('cameraPreview');
let canvas = document.getElementById('snapshotCanvas');
let startBtn = document.getElementById('startCameraBtn');
let snapBtn = document.getElementById('takeSnapshotBtn');
let uploadBtn = document.getElementById('uploadSnapshotBtn');
let stream = null;

// Start camera
startBtn.onclick = async function () {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block';
    snapBtn.style.display = 'inline-block';
};

// Take snapshot
snapBtn.onclick = function () {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    video.style.display = 'none';
    canvas.style.display = 'block';
    snapBtn.style.display = 'none';
    uploadBtn.style.display = 'inline-block';
    stream.getTracks().forEach(track => track.stop());
};

// Start camera
startBtn.onclick = async function () {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block';
    snapBtn.style.display = 'inline-block';

    const note = document.getElementById("showthenotesofcamera");
    note.style.display = 'block';

    // Auto turn off after 15 seconds
    setTimeout(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';
            snapBtn.style.display = 'none';
        }
        // Hide the note
        note.style.display = 'none';
    }, 15000);
};



// Upload snapshot to backend
uploadBtn.onclick = function () {
    const userId = localStorage.getItem('userId'); // get from localStorage

    if (!userId) {
        showAlert("User ID not found in localStorage.", true);
        return;
    }

    canvas.toBlob(async function (blob) {
        const formData = new FormData();
        formData.append('profilePic', blob, 'camera-image.jpg');
        formData.append('userId', userId);

        try 
        {
            const response = await fetch('http://localhost:8080/api/profile/updateProfilePic', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();

            if (response.ok) {
                showAlert(result, false); // success
                setTimeout(() => location.reload(), 3000); // or redirect

            } else {
                showAlert(result || "Something went wrong.", true); // error
            }
        } catch (err) {
            showAlert("Server down. Try again later.", true);
        }
    }, 'image/jpeg');
};

// Show alert message
function showAlert(message, isError) {
    const msgDiv = document.getElementById('profileUpdateMessage');
    msgDiv.innerText = message;
    msgDiv.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    msgDiv.style.color = isError ? '#721c24' : '#155724';
    msgDiv.style.borderColor = isError ? '#f5c6cb' : '#c3e6cb';
    msgDiv.style.display = 'block';
}

// -----------------------------------------------------------------------sennding data to backend (email old and new)
document.getElementById("saveEmailBtn").addEventListener("click", () => {
    const oldEmail = document.getElementById("oldEmail").value;
    const newEmail = document.getElementById("newEmail").value;
    localStorage.setItem("newEmail",newEmail);
    const userId = localStorage.getItem('userId');

    if (oldEmail === '' || newEmail === '') {
        alert("Please fill in both old and new email fields.");
        return;
    }

    fetch('http://localhost:8080/api/email/change-email-request', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldEmail, newEmail, userId }),
    })
    .then(response => response.text()) // 🔁 Because you're returning plain text, not JSON
    .then(data => {
        console.log("Server response:", data);
        if (data.includes("accepted")) {
            // ✅ Show OTP popup if success
            document.getElementById("popup-blur").style.display = "flex";
            localStorage.setItem("storedEmail", newEmail); // Save for OTP verification
        } else {
            alert("Error: " + data);
        }
    })
    .catch(err => {
        alert("Error: " + err.message);
    });
});

// --------------------------------------------------------------------------take action  btn save button
document.getElementById('submitActionBtn').addEventListener('click', () => 
{
    const action = document.getElementById('accountAction').value;
    const userId = localStorage.getItem('userId');

    if (!action || !userId) 
    {
        alert("Please Choose the option to take Immediate Actions !.");
        return;
    }
    fetch('http://localhost:8080/api/user/update-takeaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            action
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) 
        {
            // Show OTP popup or confirmation
            document.getElementById('otp-popup4').classList.remove('hidden');
        } else 
        {
            // Show error message
            alert(data.message || "Action Take failed.");
            document.getElementById('otp-popup4').classList.remove('hidden');
        }
    })
    .catch(err => {
        alert("Server down 🛜 - Try again Later")
        console.error('Error:', err);
    });
});
// --------------------------------------------------------------------------take action taking cameera js
// Hide the popup
function closePopupofTakeActionCamera() 
{
    document.getElementById('faceVerificationPopup').style.display = 'none';
    setTimeout(() => location.reload(), 2000);
}

function closePopupofTakeAction() 
{
    document.getElementById('otp-popup4').style.display = 'none';

}
// --------------------------------------------------------------------------edit profile button on add money js
function goToGeneratePassword() {
    // Hide all sections
    document.querySelectorAll('.box').forEach(box => box.style.display = 'none');

    // Show Edit Profile section
    document.getElementById('edit-profile').style.display = 'block';

    // Scroll to the payment password input field
    const targetElement = document.getElementById('generatepaymentpassword');
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.focus();
    }
}

// --------------------------------------------------------------------------date and time  js
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });
    document.getElementById("date-time").textContent = dateTimeString;
}

setInterval(updateDateTime, 1000); // Update every second
updateDateTime(); // Initial call


// ==============================================================================//END


  