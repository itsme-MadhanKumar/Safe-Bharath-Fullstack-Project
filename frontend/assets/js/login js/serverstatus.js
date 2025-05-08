async function checkServerStatus() {
    const indicator = document.getElementById("server-indicator");
    const indicator1 = document.getElementById("server-indicator1");
    const rainContainer = document.getElementById("rain-container");
    const statusMsg = document.getElementById("message-of-server-status");

    try {
        const response = await fetch("http://localhost:8080/api/health"); // Replace with your backend health URL

        if (response.ok) 
            {
            indicator.classList.remove("red");
            indicator.classList.add("green"); 
            
            statusMsg.textContent = "";
          
            // stopRain(); // Stop rain when the server is ON
        } 
        else 
        {
            indicator.classList.remove("green");
            indicator.classList.add("red"); // Red = Server OFF (Static)
            // startRain(); // Start rain when the server is OFF
            statusMsg.style.color = "red";
            statusMsg.textContent = "Proceeding now...";
        }
    } catch (error) {
      
        indicator.classList.remove("green");
        indicator.classList.add("red");
        statusMsg.style.color = "red";
        statusMsg.textContent = "Reconnecting...";
     
        // startRain(); // Start rain on error (server down)
    }
}

// Function to create rain effect
function startRain() {
    const rainContainer = document.getElementById("rain-container");
    rainContainer.style.display = "block";
    rainContainer.innerHTML = ""; // Clear previous drops

    for (let i = 0; i < 250; i++) 
    { // Adjust number of drops
        let drop = document.createElement("div");
        drop.classList.add("rain-drop");
        drop.style.left = Math.random() * window.innerWidth + "px";
        drop.style.animationDuration = (Math.random() * 2 + 1) + "s"; // Random speed
        rainContainer.appendChild(drop);
    }
}

// Function to stop rain
function stopRain() {
    const rainContainer = document.getElementById("rain-container");
    rainContainer.style.display = "none";
}

// Check server status every 5 seconds
setInterval(checkServerStatus, 7000);

// Initial check
checkServerStatus();
