// Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X } from "lucide-react";
import { AnalysisResults } from "../types";

interface ChatbotProps {
  results?: AnalysisResults | null;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ results }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ✅ New: Notify user when analysis results are available
  useEffect(() => {
    if (results) {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "✅ Your file has been analyzed! Ask me about dashboard metrics, flagged users, or reports."
        }
      ]);
    }
  }, [results]);

  const generateBotReply = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Casual conversations
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! 👋 I'm your AnomalyGuard Assistant. I can guide you through uploading files, analyzing data, and checking reports. Ask me anything!";
    }
    if (msg.includes("how are you")) {
      return "I'm doing great! 😎 Ready to help you detect anomalies. How's your day going?";
    }
    if (msg.includes("good") || msg.includes("fine") || msg.includes("great")) {
      return "Awesome! Let's make your system safer 💪";
    }
    if (msg.includes("thanks") || msg.includes("thank you")) {
      return "You're welcome! 😊 I'm here anytime you need guidance.";
    }
    if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you")) {
      return "Bye! 👋 Stay safe and secure. Come back if you need help with analysis.";
    }
    if (msg.includes("joke")) {
      return "Why did the hacker break into the bakery? Because he heard the cookies were safe! 😆";
    }
    if (msg.includes("help") || msg.includes("support") || msg.includes("problem")) {
      return "I can guide you with uploads, running analysis, viewing flagged users, and generating reports. Just ask me what you want to do!";
    }

    // Site guidance
    if (msg.includes("upload") || msg.includes("file") || msg.includes("csv") || msg.includes("log")) {
      return "To analyze your logs, go to the Upload page 📂, select your CSV or log file, then click 'Run Analysis'. After that, the dashboard will show your results.";
    }
    if (msg.includes("dashboard") || msg.includes("results") || msg.includes("overview")) {
      if (results) {
        return `The dashboard displays total logins: ${results.totalLogins}, anomalies detected: ${results.anomaliesCount}, severity breakdown, and flagged users. You can click on each section to see details.`;
      } else {
        return "The dashboard will display analysis results after you upload a file and run analysis.";
      }
    }
    if (msg.includes("report") || msg.includes("summary") || msg.includes("export")) {
      if (results) {
        return `You can download detailed reports for your analysis. Total logins: ${results.totalLogins}, anomalies: ${results.anomaliesCount}. Go to the Reports section 📊 to export.`;
      } else {
        return "You haven't uploaded a file yet. Upload a CSV/log file to generate reports.";
      }
    }
    if (msg.includes("flagged") || msg.includes("risk") || msg.includes("anomaly")) {
      if (results) {
        const { high, medium, low } = results.severityBreakdown;
        return `Current analysis shows ${high} high-risk, ${medium} medium-risk, and ${low} low-risk events. Check flagged users in the dashboard 🔍.`;
      } else {
        return "No analysis data yet. Upload a file to detect anomalies.";
      }
    }
    if (msg.includes("reset") || msg.includes("start over") || msg.includes("clear")) {
      return "You can reset the demo by clicking the 'Reset Demo' button at the top right. This will clear uploaded files and analysis results.";
    }
    if (msg.includes("scroll") || msg.includes("workflow") || msg.includes("how it works")) {
      return "Use the navigation buttons or scroll to see each section: Home, How it Works, Upload & Analyze. Click on buttons to jump to sections smoothly.";
    }

    // Default fallback
    return "I’m focused on AnomalyGuard AI. Ask me about uploads, running analysis, dashboard, flagged users, reports, or just chat casually!";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botText = generateBotReply(input);
      const botMsg: Message = { sender: "bot", text: botText };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat icon */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">AnomalyGuard Assistant</h3>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm max-w-[80%] ${
                  msg.sender === "user" ? "bg-teal-100 ml-auto text-gray-800" : "bg-gray-100 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="p-3 rounded-lg text-sm max-w-[80%] bg-gray-100 text-gray-700 animate-pulse">
                AI is typing...
              </div>
            )}
          </div>

          {/* Input box */}
          <div className="flex border-t border-gray-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 p-3 outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-teal-600 text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
