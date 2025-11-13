/*import React, { useEffect } from "react";

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

-------

import React, { useEffect } from "react";

function LexChatbot() {
  useEffect(() => {
    // Step 1: Load AWS SDK first
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1000.0.min.js";
    sdkScript.async = true;

    sdkScript.onload = () => {
      // Step 2: Load Lex Web UI ONLY AFTER AWS SDK is ready
      const lexScript = document.createElement("script");
      lexScript.src =
        "https://unpkg.com/amazon-lex-web-ui/dist/lex-web-ui-loader.js";
      lexScript.async = true;

      lexScript.onload = () => {
        if (!window.LexWebUi) {
          console.error("❌ LexWebUi failed to load!");
          return;
        }

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
          },
        };

        window.LexWebUi.Loader.load(loaderOpts).then(() => {
          console.log("✅ Lex Chatbot loaded successfully!");
        });
      };

      lexScript.onerror = () =>
        console.error("❌ Failed to load Lex Web UI script");

      document.body.appendChild(lexScript);
    };

    sdkScript.onerror = () =>
      console.error("❌ Failed to load AWS SDK script");

    document.body.appendChild(sdkScript);

    // Cleanup
    return () => {
      sdkScript.remove();
      const lexDiv = document.getElementById("lex-chat");
      if (lexDiv) lexDiv.innerHTML = "";
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
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      ></div>
    </div>
     );
}
export default LexChatbot;*/



import React, { useEffect } from "react";

function LexChatbot() {
  useEffect(() => {
    // Step 1: Load AWS SDK first
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1000.0.min.js";
    sdkScript.async = true;

    sdkScript.onload = () => {
      // Step 2: Load Lex Web UI ONLY AFTER AWS SDK is ready
      const lexScript = document.createElement("script");
      // ✅ FIXED: Use working CDN URL
      lexScript.src = "https://cdn.jsdelivr.net/npm/amazon-lex-web-ui@latest/dist/lex-web-ui.min.js";
      lexScript.async = true;

      lexScript.onload = () => {
        if (!window.LexWebUi) {
          console.error("❌ LexWebUi failed to load!");
          return;
        }

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
              "👋 Hi! I'm the Book Assistant. How can I help you today?",
            initialSpeechInstruction: "Say hello to get started.",
          },
          ui: {
            parentElementId: "lex-chat",
            toolbarTitle: "Book Assistant",
            pushInitialTextOnRestart: false,
          },
        };

        window.LexWebUi.Loader.load(loaderOpts).then(() => {
          console.log("✅ Lex Chatbot loaded successfully!");
        });
      };

      lexScript.onerror = () =>
        console.error("❌ Failed to load Lex Web UI script");

      document.body.appendChild(lexScript);
    };

    sdkScript.onerror = () =>
      console.error("❌ Failed to load AWS SDK script");

    document.body.appendChild(sdkScript);

    // Cleanup
    return () => {
      sdkScript.remove();
      const lexScript = document.querySelector('script[src*="amazon-lex-web-ui"]');
      if (lexScript) lexScript.remove();
      const lexDiv = document.getElementById("lex-chat");
      if (lexDiv) lexDiv.innerHTML = "";
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
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      ></div>
    </div>
  );
}
export default LexChatbot;
