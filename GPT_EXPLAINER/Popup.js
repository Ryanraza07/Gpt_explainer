const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
const API_KEY = ""; // Hardcoded for now

document.addEventListener("DOMContentLoaded", function () {
    const askButton = document.getElementById("askButton");
    const userInput = document.getElementById("userInput");
    const responseText = document.getElementById("responseText");

    askButton.addEventListener("click", async function () {
        const question = userInput.value.trim();
        if (!question) {
            responseText.textContent = "Please enter a question.";
            return;
        }

        responseText.textContent = "Thinking..."; // ✅ Show loading message
        const result = await fetchData(question);
        responseText.textContent = result;
    });
});

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
            throw new Error("Unexpected response format");
        }


        return data[0].generated_text;
    } catch (error) {
        console.error("Error fetching data:", error);
        return "Error fetching response";
    }
}
