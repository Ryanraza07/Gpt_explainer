const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
const API_KEY = ""; // Hardcoded for now

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchAIResponse") {  // ✅ FIXED ACTION NAME
        fetchData(request.text)
            .then(response => sendResponse({ response })) // ✅ Send response properly
            .catch(error => sendResponse({ response: "Error fetching response" }));

        return true; // ✅ Keep message channel open for async response
    }
});

// Fetch data from Hugging Face API
async function fetchData(inputText) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: inputText })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
            throw new Error("Invalid response format from API");
        }

        return data[0].generated_text;
    } catch (error) {
        console.error("Error fetching data:", error);
        return "Error fetching response";
    }
}

