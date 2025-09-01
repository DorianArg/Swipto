import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatBubbleProps {
  cryptoData: any;
}

export default function ChatBubble({ cryptoData }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Réinitialiser le chat quand la crypto change
  useEffect(() => {
    if (cryptoData?.name) {
      setMessages([
        {
          role: "assistant",
          content: `👋 Salut ! Je peux t'aider avec des questions sur **${cryptoData.name}** ou les cryptos en général !`,
          timestamp: new Date(),
        },
      ]);
      setHasNewMessage(true);

      // Retirer l'indicateur après 3 secondes
      setTimeout(() => setHasNewMessage(false), 3000);
    }
  }, [cryptoData?.id]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
          cryptoData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "😅 Désolé, j'ai un problème technique. Peux-tu réessayer ?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[380px] h-[500px] bg-gradient-to-br from-[#18192B] to-[#23243a] rounded-2xl shadow-2xl border border-[#23243a]/50 overflow-hidden"
          >
            {/* Header du chat */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Crypto Assistant</h3>
                  <p className="text-xs text-purple-100">
                    {cryptoData?.name
                      ? `Expert en ${cryptoData.name}`
                      : "Expert crypto"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
              >
                ✕
              </button>
            </div>

            {/* Zone des messages */}
            <div
              ref={messagesContainerRef}
              className="h-[340px] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[280px] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                        : "bg-[#2e3046] text-gray-100 rounded-bl-md border border-[#3f415b]"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Indicateur de frappe */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#2e3046] p-3 rounded-2xl rounded-bl-md border border-[#3f415b]">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Zone de saisie */}
            <div className="border-t border-[#23243a] bg-[#18192B] p-4">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Question sur ${
                    cryptoData?.name || "les cryptos"
                  }...`}
                  className="flex-1 bg-[#2e3046] text-white placeholder-gray-400 px-3 py-2 rounded-lg border border-[#3f415b] focus:border-purple-500 focus:outline-none transition text-sm"
                  disabled={loading}
                  maxLength={200}
                />
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "⏳" : "📤"}
                </motion.button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Groq AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulle flottante */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        {/* Icône de chat */}
        <span className="text-2xl text-white">{isOpen ? "✕" : "💬"}</span>

        {/* Indicateur de nouveau message */}
        <AnimatePresence>
          {hasNewMessage && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-xs text-white font-bold"
              >
                !
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Effet de pulsation */}
        <motion.div
          animate={hasNewMessage && !isOpen ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75"
        />
      </motion.button>

      {/* Bulle d'aide au survol */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-black/80 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Questions sur {cryptoData?.name || "cette crypto"} ? 🤖
          </div>
        </div>
      )}
    </div>
  );
}
