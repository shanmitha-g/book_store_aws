import React, { useEffect } from "react";

function LexChatbot() {
  useEffect(() => {
    // Load Lex scripts dynamically
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1000.0.min.js";
    sdkScript.async = true;
    document.body.appendChild(sdkScript);

    const lexScript = document.createElement("script");
    lexScript.src = "https://unpkg.com/amazon-lex-web-ui/dist/lex-web-ui-loader.js";
    lexScript.async = true;

    lexScript.onload = () => {
      const loaderOpts = {
        shouldLoadConfigFromJsonFile: false,
        awsRegion: "us-east-1",
        cognito: {
          poolId: "us-east-1:6f578a32-1f11-4261-85c3-452f5a929db3",
        },
        lex: {
          botName: "BookStoreFAQBot",
          botAlias: "prod",
          botAliasArn:
            "arn:aws:lex:us-east-1:910230630620:bot-alias/BookStoreFAQBot/prod",
          initialText:
            "👋 Hi! I’m the Book Assistant. How can I help you today?",
          initialSpeechInstruction: "Say hello to get started.",
        },
        ui: {
          parentElementId: "lex-chat",
          toolbarTitle: "Book Assistant",
          pushInitialTextOnRestart: false,
          toolbarLogo: "",
        },
      };

      window.LexWebUi.Loader.load(loaderOpts).then(() => {
        console.log("✅ Lex Chatbot connected successfully!");
      });
    };

    document.body.appendChild(lexScript);

    return () => {
      sdkScript.remove();
      lexScript.remove();
      const chatDiv = document.getElementById("lex-chat");
      if (chatDiv) chatDiv.innerHTML = "";
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Bookstore FAQ Assistant</h2>
      <div
        id="lex-chat"
        style={{
          height: "600px",
          width: "400px",
          margin: "30px auto",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      ></div>
    </div>
  );
}

export default LexChatbot;
