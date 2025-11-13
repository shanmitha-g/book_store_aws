export async function sendToLex(text) {
  const response = await fetch(
    "https://ughrsg8j7b.execute-api.us-east-1.amazonaws.com/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        sessionId: "user-" + Date.now()
      })
    }
  );

  return response.json();
}
