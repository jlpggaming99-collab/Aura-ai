const API_KEY = "YOUR_NEW_API_KEY";

const chatBox = document.getElementById("chatBox");

async function sendMessage() {
    const input = document.getElementById("message");
    const text = input.value.trim();

    if (!text) return;

    chatBox.innerHTML += `
        <div class="message user">${text}</div>
    `;

    input.value = "";

    chatBox.innerHTML += `
        <div class="message bot" id="typing">
            Aura AI is typing...
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: text
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        document.getElementById("typing").remove();

        let reply = "Sorry, I couldn't respond.";

        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts
        ) {
            reply = data.candidates[0].content.parts[0].text;
        }

        chatBox.innerHTML += `
            <div class="message bot">${reply}</div>
        `;

    } catch (error) {

        document.getElementById("typing")?.remove();

        chatBox.innerHTML += `
            <div class="message bot">
                Error: ${error.message}
            </div>
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

document
.getElementById("message")
.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

document
.getElementById("imageUpload")
.addEventListener("change", function() {

    const file = this.files[0];

    if (!file) return;

    const img = document.createElement("img");

    img.src = URL.createObjectURL(file);

    img.style.maxWidth = "200px";
    img.style.borderRadius = "10px";
    img.style.margin = "10px";

    chatBox.appendChild(img);

    chatBox.scrollTop = chatBox.scrollHeight;
});
