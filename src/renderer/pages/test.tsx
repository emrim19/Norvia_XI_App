import { useState } from "react";
import { callAgent } from "../../services/agentAccess";

const Test = () => {
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful academic librarian.");
  const [userMessage, setUserMessage] = useState("");
  const [tokenUsage, setTokenUsage] = useState(0);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAgent = async () => {
    if (!userMessage) return;

    setIsLoading(true);
    setResponse("The Librarian is thinking...");

    try {
      const agentMessage = await callAgent(systemPrompt, userMessage);
      setResponse(agentMessage.message);
      setTokenUsage(agentMessage.tokenUsage);
    } catch (error) {
      setResponse("Error: Could not reach the Librarian.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", fontFamily: "sans-serif" }}>
      <h2>Norvia XI | Agent Test Bench</h2>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>System Prompt:</label>
        <input 
          type="text" 
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>User Message:</label>
        <textarea 
          rows={3}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask something about your documents..."
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleAskAgent();
            }
        }}
        />
      </div>

      <button 
        onClick={handleAskAgent} 
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        {isLoading ? "Consulting..." : "Ask Librarian"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      <div>
        <label style={{ fontWeight: "bold" }}>Response:</label>
        <div style={{ 
          marginTop: "10px", 
          padding: "15px", 
          backgroundColor: "#000000", 
          borderRadius: "5px",
          minHeight: "50px",
          whiteSpace: "pre-wrap" // Preserves formatting from the AI
        }}>
          {response || "No response yet. Send a message to start."}
        </div>
      </div>
      <div>
        Tokens used: {tokenUsage}
      </div>
    </div>
  );
};

export default Test;