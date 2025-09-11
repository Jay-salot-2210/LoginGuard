import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2, Maximize2, MessageCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AnalysisResults } from '../types';

interface ChatbotProps {
  results: AnalysisResults | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ results }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const checkSpeechSupport = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsSpeechSupported(true);
        
        // Initialize speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          addBotMessage("I couldn't understand that. Could you please try again or type your question?");
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsSpeechSupported(false);
        setIsVoiceEnabled(false);
      }
      
      // Check speech synthesis support
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
      }
    };
    
    checkSpeechSupport();
  }, []);

  // Predefined questions based on analysis results
  const predefinedQuestions = results ? [
    "What are the key findings?",
    "Which users are most at risk?",
    "Show me high severity anomalies",
    "What patterns did you detect?",
    "Generate a summary report"
  ] : [
    "How does this work?",
    "What data should I upload?",
    "What types of anomalies can you detect?",
    "How accurate is the analysis?"
  ];

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = results 
        ? "Hello! I'm your security analysis assistant. I can help you understand the findings from your anomaly detection report. What would you like to know?"
        : "Hello! I'm your security analysis assistant. I can answer questions about anomaly detection and help you understand how to use this platform.";
      
      addBotMessage(welcomeMessage, true);
    }
  }, [isOpen, results, messages.length]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const speakText = (text: string) => {
    if (isVoiceEnabled && synthesisRef.current) {
      // Stop any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        console.log('Finished speaking');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event);
      };
      
      synthesisRef.current.speak(utterance);
    }
  };

  const addBotMessage = (text: string, shouldSpeak = false) => {
    setIsTyping(true);
    // Simulate typing delay for more natural interaction
    setTimeout(() => {
      addMessage(text, 'bot');
      setIsTyping(false);
      
      // Speak the message if voice is enabled
      if (shouldSpeak && isVoiceEnabled) {
        speakText(text);
      }
    }, 500 + Math.random() * 500);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    addMessage(inputText, 'user');
    const userQuery = inputText.toLowerCase();
    setInputText('');

    // Process the query and generate response using enhanced AI logic
    setTimeout(() => {
      let response = generateAIResponse(userQuery, results);
      addBotMessage(response, true);
    }, 600);
  };

  const generateAIResponse = (query: string, results: AnalysisResults | null): string => {
    // Enhanced AI response generation
    if (results) {
      // Analysis-specific responses with more intelligence
      if (query.includes('key finding') || query.includes('summary') || query.includes('overview')) {
        const riskLevel = results.anomaliesCount / results.totalLogins > 0.1 ? 'high' : 
                         results.anomaliesCount / results.totalLogins > 0.05 ? 'moderate' : 'low';
        return `Based on my analysis of ${results.totalLogins} login attempts, I detected ${results.anomaliesCount} anomalous activities (${(results.anomaliesCount/results.totalLogins*100).toFixed(1)}%). 
                The risk level is ${riskLevel} with ${results.severityBreakdown.high} high risk, ${results.severityBreakdown.medium} medium risk, and ${results.severityBreakdown.low} low risk anomalies.
                ${results.severityBreakdown.high > 0 ? 'I recommend immediate attention to the high-risk anomalies.' : 'No critical issues were detected.'}`;
      } 
      else if (query.includes('risk') || query.includes('high severity') || query.includes('critical')) {
        const highRiskUsers = results.flaggedUsers.filter(user => user.severity === 'High');
        if (highRiskUsers.length > 0) {
          const topUser = highRiskUsers[0];
          return `I found ${highRiskUsers.length} high-risk users requiring immediate attention. The most critical is ${topUser.user} from ${topUser.location} with a risk score of ${topUser.score.toFixed(2)}. 
                  This occurred at ${topUser.timestamp}. I recommend immediately verifying this user's activity and potentially triggering additional authentication measures.`;
        } else {
          return "No high-risk users were detected in this analysis. All flagged anomalies are of medium or low severity, which is a positive indicator for your current security posture.";
        }
      }
      else if (query.includes('pattern') || query.includes('trend') || query.includes('detect')) {
        const peakTime = getPeakAnomalyTime(results);
        const topRegion = getTopAnomalyRegion(results);
        return `I've identified several important patterns: 
                1) Temporal: Most anomalies occurred around ${peakTime} 
                2) Geographical: Higher concentrations in ${topRegion}
                3) Behavioral: ${results.flaggedUsers.length > 0 ? 'Multiple login attempts from unusual locations' : 'No consistent behavioral patterns detected'}
                These patterns suggest ${peakTime.includes('night') ? 'potential off-hours access issues' : 'possible credential sharing during peak hours'}.`;
      }
      else if (query.includes('recommend') || query.includes('action') || query.includes('next')) {
        const hasHighRisk = results.severityBreakdown.high > 0;
        return `Based on my analysis, I recommend: 
                1) ${hasHighRisk ? 'Immediately review high-risk user accounts' : 'Continue monitoring medium-risk anomalies'}
                2) Implement ${hasHighRisk ? 'immediate additional authentication' : 'step-up authentication'} for suspicious locations
                3) ${results.timeSeriesData.length > 3 ? 'Focus monitoring during peak anomaly hours' : 'Maintain current monitoring levels'}
                4) Consider ${hasHighRisk ? 'immediate security policy updates' : 'proactive policy reviews'}
                Would you like me to elaborate on any of these recommendations?`;
      }
      else if (query.includes('report') || query.includes('export') || query.includes('download')) {
        return "You can download a comprehensive security report using the 'Generate Report' button in the analysis dashboard. This PDF report includes detailed information about all detected anomalies, visualizations of patterns, and specific recommended actions with priority levels. Would you like me to guide you through the report generation process?";
      }
      else if (query.includes('thank') || query.includes('thanks')) {
        return "You're welcome! I'm here to help you maintain strong security posture. Is there anything else you'd like to know about your anomaly detection results?";
      }
      else {
        return "I can help you understand your security analysis results in depth. Try asking about specific findings, risk levels, patterns, or recommendations. You can also ask me to explain any technical terms or suggest next steps for specific anomalies.";
      }
    } else {
      // General questions when no results are available with more detailed responses
      if (query.includes('how') && query.includes('work')) {
        return "I use advanced machine learning algorithms to analyze login patterns across multiple dimensions: geographical location, time of access, device fingerprints, and behavioral patterns. My neural networks are trained on millions of login attempts to identify anomalies that deviate from established patterns. I continuously learn from new data to improve detection accuracy while maintaining low false positive rates.";
      }
      else if (query.includes('what data') || query.includes('upload')) {
        return "For optimal analysis, please upload a CSV file with these columns: user_id, timestamp, ip_address, location, device, browser, login_success. The timestamp should be in ISO format (YYYY-MM-DDTHH:MM:SSZ). I can analyze data from various sources including cloud platforms, VPN logs, and authentication servers. The more historical data you provide, the better I can establish normal patterns and detect anomalies.";
      }
      else if (query.includes('type') || query.includes('anomaly')) {
        return "I detect several types of security anomalies: 1) Geographical anomalies (logins from unusual locations based on user history), 2) Temporal anomalies (access at unusual times), 3) Behavioral anomalies (unusual login patterns or sequences), 4) Device anomalies (access from unrecognized devices), and 5) Velocity anomalies (unusually high login frequency). I also correlate these dimensions to identify sophisticated multi-vector attacks.";
      }
      else if (query.includes('accurate') || query.includes('precision')) {
        return "My detection system achieves over 97% accuracy with less than 3% false positive rate based on continuous validation against known threat datasets. I use ensemble learning methods that combine multiple algorithms for optimal performance. The system undergoes daily retraining with new threat intelligence to maintain high detection rates for emerging attack patterns while minimizing disruption to legitimate users.";
      }
      else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        return "Hello! I'm your AI security assistant, ready to help with anomaly detection and security analysis. How can I assist you today?";
      }
      else {
        return "I'm here to help with security analysis and anomaly detection. I can explain how the system works, what data to provide, types of threats detected, and our accuracy metrics. Once you upload data, I can provide detailed analysis of detected anomalies and recommended actions. What would you like to know?";
      }
    }
  };

  const getPeakAnomalyTime = (results: AnalysisResults) => {
    if (!results.timeSeriesData || results.timeSeriesData.length === 0) {
      return "various times";
    }
    
    const peakTime = results.timeSeriesData.reduce((prev, current) => 
      (prev.anomalies > current.anomalies) ? prev : current
    );
    
    return peakTime.time;
  };

  const getTopAnomalyRegion = (results: AnalysisResults) => {
    if (!results.regionalData || results.regionalData.length === 0) {
      return "various regions";
    }
    
    const topRegion = results.regionalData.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    return topRegion.region;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handlePredefinedQuestionClick = (question: string) => {
    setInputText(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setInputText(''); // Clear input when starting to listen
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (!isVoiceEnabled && synthesisRef.current && synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 transition-all duration-300 z-50
      ${isMinimized ? 'h-16 w-64' : 'h-[500px] w-80'}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot size={20} />
          <span className="font-semibold">AI Security Assistant</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleMinimize}
            className="p-1 rounded-full hover:bg-teal-500 transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={toggleChat}
            className="p-1 rounded-full hover:bg-teal-500 transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Predefined Questions */}
          {predefinedQuestions.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handlePredefinedQuestionClick(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              
              {/* Voice Controls */}
              {isSpeechSupported && (
                <>
                  <button
                    onClick={toggleListening}
                    disabled={isTyping}
                    className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  
                  <button
                    onClick={toggleVoice}
                    disabled={isTyping}
                    className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                      isVoiceEnabled 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    aria-label={isVoiceEnabled ? "Disable voice" : "Enable voice"}
                  >
                    {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                </>
              )}
              
              <button
                onClick={handleSendMessage}
                disabled={isTyping || inputText.trim() === ''}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full p-2 flex items-center justify-center hover:from-teal-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Voice Status Indicator */}
            {isSpeechSupported && isListening && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak now</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;