let notificationInterval;
let lastNotificationTimestamp = null;

document.getElementById("Notification-btn").addEventListener("click", function () 
{
    document.querySelectorAll(".box").forEach(box => box.style.display = "none");
    document.getElementById("Notification-box").style.display = "block";

    fetchNotifications(); // Immediate fetch
    clearInterval(notificationInterval);
    notificationInterval = setInterval(fetchNotifications, 5000);
});

function fetchNotifications() {
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:8080/api/notifications?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("notification-list");
            container.innerHTML = "";

            if (data.length === 0) {
                container.innerHTML = "<p>No notifications found.</p>";
                document.getElementById("notification-count").textContent = 0;
                return;
            }

            let unreadCount = 0;

            data.forEach((item, index) => {
                if (item.status === "UNREAD") unreadCount++;

                const box = document.createElement("div");
                box.className = "notification-item";
                box.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.message}</p>
                    <small>${item.timestamp}</small>
                    <hr>
                `;
                container.appendChild(box);

                // Show popup for newest item if it's new
                if (index === 0 && item.timestamp !== lastNotificationTimestamp) {
                    lastNotificationTimestamp = item.timestamp;
                    showNotificationPopup(item.title, item.message);
                }
            });

            document.getElementById("notification-count").textContent = unreadCount;
        })
        .catch(error => {
            console.error("Error fetching notifications:", error);
        });
}

function showNotificationPopup(title, message) {
    // Play notification sound
    const sound = new Audio("assets/sounds/notification.mp3");
    sound.play();

    // Create popup
    const popup = document.createElement("div");
    popup.className = "custom-notification-popup";

    popup.innerHTML = `
        <div class="popup-header">
            <span class="popup-title">🔔 New Notification</span>
            <span class="popup-close-btn">&times;</span>
        </div>
        <div class="popup-content">
            <div class="popup-inner-title">${title}</div>
            <div class="popup-message">${message}</div>
        </div>
    `;

    document.body.appendChild(popup);

    popup.querySelector(".popup-close-btn").addEventListener("click", () => {
        popup.remove();
    });
}

// ===================================================================
document.getElementById("delete-close-btn").addEventListener("click", function () {
    document.getElementById("delete-account-popup").style.display = "none";
});

function showDeleteAccountPopup() {
    document.getElementById("delete-account-popup").style.display = "block";
    processDeleteStep(1);
}

function processDeleteStep(step) {
    const stepStatusElement = document.getElementById(`delete-step-${step}-status`);
    stepStatusElement.textContent = "Processing...";
    stepStatusElement.style.color = "red";

    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:8080/api/delete-step/${step}?userId=${encodeURIComponent(userId)}`)
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (ok && (data.success === true || data.success === "true")) {
                stepStatusElement.style.color = "green";
                stepStatusElement.textContent = "Completed ✅";

                if (step < 5) {
                    processDeleteStep(step + 1);
                } 
            } else {
                stepStatusElement.style.color = "red";
                stepStatusElement.textContent = `Failed ❌: ${data.message}`;
            }
        })
        .catch(error => {
            stepStatusElement.textContent = "Failed ❌";
            console.error("Error in deletion step:", error);
        });
}



// =====================================================================close
document.getElementById("delete-close-btn").addEventListener("click", function () 
{
    

    let allCompleted = true;

    for (let i = 1; i <= 5; i++) {
        const statusText = document.getElementById(`delete-step-${i}-status`).textContent.trim();
        if (statusText !== "Completed ✅") {
            allCompleted = false;
            break;
        }
    }

    if (allCompleted) 
    {
        localStorage.clear(); // <-- this calls the function
        window.location.href = "index.html"; // redirect only if all steps completed
    } else {
        location.reload(); // otherwise reload the page
    }
});




























// document.getElementById("Notification-btn").addEventListener("click", function () {
//     document.querySelectorAll(".box").forEach(box => box.style.display = "none");
//     document.getElementById("Notification-box").style.display = "block";

//     const userId = localStorage.getItem("userId");

//     fetch(`http://localhost:8080/api/notifications?userId=${userId}`)
//         .then(response => response.json())
//         .then(data => {
//             const container = document.getElementById("notification-list");
//             container.innerHTML = "";

//             if (data.length === 0) {
//                 container.innerHTML = "<p>No notifications found.</p>";
//                 return;
//             }

//             let unreadCount = 0;

//             data.forEach(item => {
//                 const box = document.createElement("div");
//                 box.className = "notification-item";
//                 if (item.status === "UNREAD") unreadCount++;

//                 box.innerHTML = `
//                     <h4>${item.title}</h4>
//                     <p>${item.message}</p>
//                     <small>${item.timestamp}</small>
//                     <hr>
//                 `;
//                 container.appendChild(box);
//             });

//             document.getElementById("notification-count").textContent = unreadCount;
//         })
//         .catch(error => {
//             console.error("Error fetching notifications:", error);
//         });
// });
