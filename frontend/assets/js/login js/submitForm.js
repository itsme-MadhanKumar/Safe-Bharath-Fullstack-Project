document.addEventListener("DOMContentLoaded", function () 
{

    if (document.getElementById("register-form")) 
    {
        handleRegistration();
    } 
    else if (document.getElementById("otp-form")) 
    {
        
        handleOtpVerification();
    }
    else if(document.getElementById("login-form"))
    {
        verifyUser();
    }
});
//--------------------------------------------------------------------------Handiles Registration submit
function handleRegistration()
{      
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.getElementById("message");
    registerForm.addEventListener("submit", function (event) 
    {
        event.preventDefault();

        const formData = 
        {
            fullname: document.getElementById("fullname").value,
            mobile: document.getElementById("mobile").value,
            aadhar: document.getElementById("aadhar").value,
            pan: document.getElementById("pan").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };
        // ✅ Store email before sending to backend
        localStorage.setItem("registeredEmail", formData.email);

        fetch("http://localhost:8080/api/register", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.style.color = data.message.includes("Successful") ? "green" : "red";
            messageDiv.style.display = "block"; // 🔥 This ensures it's visible

            if (data.message.includes("Successful")) {
                localStorage.setItem("registeredEmailforSecurity", formData.email);
                setTimeout(() => 
                    {
                    window.location.href = "otp.html";
                }, 2000);
            }
            else 
            {
                 // Print retrieved JSON in the console
                 console.log("Error response:", data);
                messageDiv.textContent = data.message;
                messageDiv.style.color = "red";
                messageDiv.style.display = "block";
                setTimeout(() => {
                    messageDiv.textContent = "";
                }, 3000);

            }
        })
        .catch(() => {
            alert("Server down 🛜 , Try again later");
            messageDiv.textContent = "Error registering. Try again.";
            messageDiv.style.color = "red";
        });
    });
}
//----------------------------------------------------------------------------------------Handels OTP
function handleOtpVerification() 
{
        const email = localStorage.getItem("registeredEmailforSecurity");
        if (!email) {
            window.location.href = "index.html"; // Redirect to login if no email
            return;
        }
    const otpForm = document.getElementById("otp-form");
    const otpMessageDiv = document.getElementById("otp-message");
    otpMessageDiv.style.display = "none";   // Make it invisible if OTP fails


    otpForm.addEventListener("submit", function (event) 
    {
        event.preventDefault();
        const otpData = {
            email: localStorage.getItem("registeredEmail"),
            otp: document.getElementById("otp").value
        };
        localStorage.clear();
        fetch("http://localhost:8080/api/verify-otp",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(otpData)
        })
        .then(response => response.json())
        .then(data => {
            otpMessageDiv.textContent = data.message;
            otpMessageDiv.style.color = data.message.includes("verified") ? "green" : "red";
            otpMessageDiv.style.display = "block"; // 🔥 This ensures it's visible

            if (data.message.includes("verified")) 
                {
                setTimeout(() => {
                    window.location.href = "pages/conformation.html";

                }, 2000);
            }
            else
            {
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }
        })
        .catch(() => {
            otpMessageDiv.textContent = "OTP verification failed. Try again.";
            otpMessageDiv.style.color = "red";
           
        });
    });
}
//------------------------------------------------------------verify user #Login
// Handles Login verification
function verifyUser() {
    const loginForm = document.getElementById("login-form");
    const loginMessageDiv = document.getElementById("login-message");
    loginForm.addEventListener("submit", function (event) 
    {
        event.preventDefault();
        const loginData = {
            aadhar: document.getElementById("username").value,  // Aadhar number
            password: document.getElementById("password").value  // Password
        };

        fetch("http://localhost:8080/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            loginMessageDiv.textContent = data.message;
            loginMessageDiv.style.color = data.message.includes("success") ? "green" : "red";
            loginMessageDiv.style.display = "block"; // Ensures it's visible

            if (data.message.includes("success")) 
                {
                    localStorage.setItem("userId", data.userId || loginData.aadhar);  // Prefer backend's userId, fallback to aadhar
                // Redirect to the user's dashboard or another page
                setTimeout(() => {
                    window.location.href = "admin.html";  // Or your desired page
                }, 2000);
            } 
            else 
            {
                // Handle failed login attempt
                loginMessageDiv.textContent = data.message;
                loginMessageDiv.style.color = "red";
                loginMessageDiv.style.display = "block";
                  // Reload after 3 seconds
                  setTimeout(() => location.reload(), 3000);
                
            }
        })
        .catch(() => {
            loginMessageDiv.textContent = "Login failed. Please try again Later.";
            loginMessageDiv.style.color = "red";
            loginMessageDiv.style.display = "block";
             // Reload after 3 seconds
             setTimeout(() => location.reload(), 4000);
        });
    });
}
//----------------------------------------------------------

