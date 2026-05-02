async function generate() {
  const input = document.getElementById("prompt").value.trim();
  const output = document.getElementById("output");

  if (!input) {
    alert("Enter something!");
    return;
  }

  output.innerText = "Generating... ⏳";

  try {
    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();

   console.log("DATA:", data); // 🔥 debug

   output.innerText = data.result ? data.result : "Something went wrong";

  } catch (error) {
    console.log("ERROR:", error);
    output.innerText = "Error connecting to AI ❌";
  }
}