import React, { useState, useEffect } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

const ApplicationThreadModal = ({ isOpen, onClose, applicationId, application, role }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && application) {
      setMessages(application.messages || []);
    }
  }, [isOpen, application]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const res = await api.post(`/jobs/application/${applicationId}/message`, {
        content: newMessage,
      });
      setMessages(res.data.application.messages);
      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Conversation Thread</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
              {role === "Recruiter" ? `Chatting with ${application.applicant?.fullName}` : "Chatting with Recruiter"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 min-h-[300px]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10">
              <div className="text-4xl mb-4 opacity-20">💬</div>
              <p className="text-xs font-bold uppercase tracking-widest text-center px-10">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.senderModel === role ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm font-medium ${
                  msg.senderModel === role 
                    ? "bg-indigo-600 text-white rounded-br-none" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                }`}>
                  {msg.content}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    {msg.senderModel === role ? "You" : msg.senderModel}
                  </span>
                  <span className="text-[8px] text-slate-300">•</span>
                  <span className="text-[9px] font-medium text-slate-400 italic">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 pr-16 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
              className="absolute right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationThreadModal;
