document.addEventListener("mouseup", (event) => {
    let selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 0) {
        // Remove existing popups before adding a new one
        let oldPopup = document.getElementById("ai-popup");
        if (oldPopup) oldPopup.remove();

        let popup = document.createElement("div");
        popup.innerText = "Thinking...";
        popup.id = "ai-popup";

        // Set popup styles
        popup.style.position = "absolute"; // ✅ Use `absolute` for better positioning
        popup.style.background = "#fff";
        popup.style.color = "#000";
        popup.style.padding = "8px";
        popup.style.border = "1px solid black";
        popup.style.borderRadius = "5px";
        popup.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
        popup.style.zIndex = "1000";

        // ✅ Position near cursor properly
        popup.style.top = `${event.clientY + window.scrollY + 10}px`;
        popup.style.left = `${event.clientX + window.scrollX + 10}px`;

        document.body.appendChild(popup);

        // Send text to background script
        chrome.runtime.sendMessage({ action: "fetchAIResponse", text: selectedText }, (response) => {
            if (response && response.response) {
                popup.innerText = response.response;  // ✅ Update popup
            } else {
                popup.innerText = "Error fetching response";
            }
        });

        // Remove popup after 10 seconds
        setTimeout(() => popup.remove(), 10000);
    }
});


