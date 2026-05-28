'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatItem {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'admin';
  adminName?: string;
  dateLabel?: string; // set only on items that need a date separator
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function MessageUs() {
  const currentUser = useAppStore((s) => s.currentUser);
  const currentPage = useAppStore((s) => s.currentPage);
  const messages = useAppStore((s) => s.messages);
  const addMessage = useAppStore((s) => s.addMessage);

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't show for non-logged-in users or on admin/superadmin pages
  const shouldHide =
    !currentUser ||
    currentUser.role === 'admin' ||
    currentUser.role === 'superadmin' ||
    currentPage === 'admin' ||
    currentPage === 'superadmin';

  // Flatten messages + replies into chat items and compute date separators
  const chatItems: ChatItem[] = useMemo(() => {
    const userMessages = messages.filter(
      (m) => m.userId === currentUser?.id
    );
    const flat: ChatItem[] = userMessages.flatMap((m) => {
      const items: ChatItem[] = [
        {
          id: m.id,
          text: m.text,
          timestamp: m.timestamp,
          sender: 'user',
        },
      ];
      m.replies.forEach((r) => {
        items.push({
          id: r.id,
          text: r.text,
          timestamp: r.timestamp,
          sender: 'admin',
          adminName: r.adminName,
        });
      });
      return items;
    });

    // Compute date separators by comparing with previous item
    return flat.map((item, idx) => {
      const itemDate = formatDate(item.timestamp);
      const prevItemDate =
        idx > 0 ? formatDate(flat[idx - 1].timestamp) : '';
      const result: ChatItem = { ...item };
      if (itemDate !== prevItemDate) {
        result.dateLabel = itemDate;
      }
      return result;
    });
  }, [messages, currentUser?.id]);

  // Check for unread admin replies
  const hasUnreadReply = chatItems.some(
    (item, idx) =>
      item.sender === 'admin' &&
      (idx === chatItems.length - 1 ||
        (idx < chatItems.length - 1 && chatItems[idx + 1].sender === 'admin'))
  );

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, chatItems.length, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    addMessage(trimmed);
    setInputText('');
    setTimeout(scrollToBottom, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (shouldHide) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
            aria-label="Open chat"
          >
            {/* Pulse ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-30 animate-ping" />
            <MessageCircle className="h-6 w-6 relative z-10" />
            {/* Unread badge */}
            {hasUnreadReply && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive text-[10px] text-white items-center justify-center font-bold">
                  !
                </span>
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl
              w-[calc(100vw-3rem)] sm:w-[350px] h-[70vh] sm:h-[500px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
                <div>
                  <h3 className="text-sm font-semibold text-primary-foreground">
                    Message Us
                  </h3>
                  <p className="text-[11px] text-primary-foreground/70">
                    We typically reply within a few hours
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary/80 shrink-0"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
              {chatItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No messages yet
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">
                    Start a conversation — we&apos;d love to hear from you!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {chatItems.map((item) => (
                    <div key={item.id}>
                      {item.dateLabel && (
                        <div className="flex items-center justify-center my-3">
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {item.dateLabel}
                          </span>
                        </div>
                      )}
                      {item.sender === 'user' ? (
                        // User message - right aligned
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-end mb-1"
                        >
                          <div className="max-w-[80%]">
                            <div className="rounded-2xl rounded-br-md bg-primary text-primary-foreground px-3 py-2 text-sm">
                              {item.text}
                            </div>
                            <p className="text-[10px] text-muted-foreground text-right mt-0.5 mr-1">
                              {formatTime(item.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        // Admin reply - left aligned
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-start mb-1"
                        >
                          <div className="max-w-[80%]">
                            <div className="rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm">
                              {item.adminName && (
                                <p className="text-[10px] font-semibold text-primary mb-0.5">
                                  {item.adminName}
                                </p>
                              )}
                              {item.text}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5 ml-1">
                              {formatTime(item.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t px-3 py-3 shrink-0 bg-background">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 h-9 text-sm rounded-full"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  size="icon"
                  className="h-9 w-9 rounded-full shrink-0"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
