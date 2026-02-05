import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Send, Archive, Trash2, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    name: "Sarah Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "That design looks amazing! When can we discuss the next phase?",
    lastMessageTime: Date.now() - 300000,
    unreadCount: 2,
    messages: [
      {
        id: "msg1",
        conversationId: "conv1",
        sender: "You",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        content: "Hi Sarah, I wanted to check on the design progress",
        timestamp: Date.now() - 600000,
        read: true,
      },
      {
        id: "msg2",
        conversationId: "conv1",
        sender: "Sarah Designer",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        content: "Great! I've completed the mockups. Check your email!",
        timestamp: Date.now() - 450000,
        read: true,
      },
      {
        id: "msg3",
        conversationId: "conv1",
        sender: "Sarah Designer",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        content: "That design looks amazing! When can we discuss the next phase?",
        timestamp: Date.now() - 300000,
        read: false,
      },
    ],
  },
  {
    id: "conv2",
    name: "Mike's Coffee Shop",
    avatar: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&h=100&fit=crop",
    lastMessage: "New espresso machine arrived! Opening early tomorrow 6am",
    lastMessageTime: Date.now() - 1800000,
    unreadCount: 1,
    messages: [
      {
        id: "msg4",
        conversationId: "conv2",
        sender: "Mike's Coffee Shop",
        senderAvatar: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&h=100&fit=crop",
        content: "Thanks for the referral! We're now fully booked for the weekend",
        timestamp: Date.now() - 2400000,
        read: true,
      },
      {
        id: "msg5",
        conversationId: "conv2",
        sender: "Mike's Coffee Shop",
        senderAvatar: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&h=100&fit=crop",
        content: "New espresso machine arrived! Opening early tomorrow 6am",
        timestamp: Date.now() - 1800000,
        read: false,
      },
    ],
  },
  {
    id: "conv3",
    name: "Emma Marketing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "The campaign metrics look really promising. Let's schedule a call.",
    lastMessageTime: Date.now() - 3600000,
    unreadCount: 0,
    messages: [
      {
        id: "msg6",
        conversationId: "conv3",
        sender: "Emma Marketing",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        content: "I've reviewed your latest proposal. Looking great!",
        timestamp: Date.now() - 5400000,
        read: true,
      },
      {
        id: "msg7",
        conversationId: "conv3",
        sender: "Emma Marketing",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        content: "The campaign metrics look really promising. Let's schedule a call.",
        timestamp: Date.now() - 3600000,
        read: true,
      },
    ],
  },
];

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [archived, setArchived] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load conversations from localStorage or use mock data
    const saved = localStorage.getItem("conversations");
    if (saved) {
      try {
        setConversations(JSON.parse(saved));
      } catch (e) {
        setConversations(MOCK_CONVERSATIONS);
      }
    } else {
      setConversations(MOCK_CONVERSATIONS);
      localStorage.setItem("conversations", JSON.stringify(MOCK_CONVERSATIONS));
    }

    const archivedSaved = localStorage.getItem("archivedConversations");
    if (archivedSaved) {
      try {
        setArchived(new Set(JSON.parse(archivedSaved)));
      } catch (e) {
        console.error("Failed to parse archived conversations");
      }
    }
  }, []);

  const handleSendMessage = (conversationId: string) => {
    if (!messageInput.trim()) return;

    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          sender: "You",
          senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          content: messageInput,
          timestamp: Date.now(),
          read: true,
        };
        return {
          ...conv,
          lastMessage: messageInput,
          lastMessageTime: Date.now(),
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    });

    setConversations(updated);
    localStorage.setItem("conversations", JSON.stringify(updated));
    setMessageInput("");
  };

  const handleArchive = (conversationId: string) => {
    const newArchived = new Set(archived);
    if (newArchived.has(conversationId)) {
      newArchived.delete(conversationId);
    } else {
      newArchived.add(conversationId);
    }
    setArchived(newArchived);
    localStorage.setItem("archivedConversations", JSON.stringify(Array.from(newArchived)));
  };

  const handleDelete = (conversationId: string) => {
    const updated = conversations.filter(c => c.id !== conversationId);
    setConversations(updated);
    localStorage.setItem("conversations", JSON.stringify(updated));
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter(
    conv =>
      !archived.has(conv.id) &&
      (conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-20 flex flex-col md:flex-row">
      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-96 border-r border-border/50 overflow-y-auto flex-shrink-0",
        selectedConversation && "hidden md:flex md:flex-col"
      )}>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 p-3 sm:p-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Inbox</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-full bg-secondary border-none text-xs sm:text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              data-testid="input-search-inbox"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="divide-y divide-border/50 flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-3 sm:p-4 cursor-pointer border-l-4 transition-all hover:bg-secondary/50 touch-manipulation",
                  selectedConversation?.id === conv.id
                    ? "border-l-primary bg-secondary border-r-0"
                    : "border-l-transparent"
                )}
                onClick={() => setSelectedConversation(conv)}
                data-testid={`conversation-${conv.id}`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate text-sm sm:text-base">{conv.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {conv.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Message View */}
      {selectedConversation && (
        <div className="w-full md:w-[calc(100%-24rem)] flex flex-col bg-background">
          {/* Chat Header */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 p-3 sm:p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors touch-manipulation flex-shrink-0"
                data-testid="button-back-inbox"
              >
                <ChevronLeft size={18} />
              </button>
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.name}
                className="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h2 className="font-semibold truncate text-sm sm:text-base">{selectedConversation.name}</h2>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleArchive(selectedConversation.id)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                data-testid="button-archive-conversation"
                title="Archive"
              >
                <Archive size={18} />
              </button>
              <button
                onClick={() => handleDelete(selectedConversation.id)}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                data-testid="button-delete-conversation"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {selectedConversation.messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex gap-3",
                  msg.sender === "You" && "justify-end"
                )}
              >
                {msg.sender !== "You" && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                  />
                )}
                <div className={cn(
                  "max-w-xs sm:max-w-sm md:max-w-md px-3 sm:px-4 py-2 rounded-lg",
                  msg.sender === "You"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                )}>
                  <p className="text-xs sm:text-sm break-words">{msg.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    msg.sender === "You"
                      ? "text-primary-foreground/70"
                      : "text-secondary-foreground/70"
                  )}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="sticky bottom-0 border-t border-border/50 p-3 sm:p-4 bg-background/95 backdrop-blur-md">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(selectedConversation.id);
                  }
                }}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-secondary border-none text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                data-testid="input-message"
              />
              <Button
                size="icon"
                onClick={() => handleSendMessage(selectedConversation.id)}
                disabled={!messageInput.trim()}
                data-testid="button-send-message"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedConversation && (
        <div className="hidden md:flex flex-1 items-center justify-center text-center">
          <div>
            <Search size={48} className="text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
