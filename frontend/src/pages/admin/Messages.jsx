import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { Mail, Trash2, CheckCircle2, User, Phone } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get('/messages');
      setMessages(res.data.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/messages/${id}/read`);
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'Read' } : msg));
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axiosInstance.delete(`/messages/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-text tracking-tight">
          Inbox
        </h1>
        <p className="font-body text-text-muted">
          Manage your customer inquiries and messages.
        </p>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Mail className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="font-heading font-bold text-xl text-text mb-2">No messages yet</h3>
            <p className="font-body text-text-muted">When customers contact you, their messages will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`p-6 transition-colors hover:bg-gray-50/50 flex flex-col md:flex-row gap-6 ${msg.status === 'Unread' ? 'bg-primary/5' : ''}`}
              >
                {/* Left: Message details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {msg.status === 'Unread' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" title="Unread"></span>
                      )}
                      <h3 className={`font-heading text-lg ${msg.status === 'Unread' ? 'font-bold' : 'font-semibold text-text/90'}`}>
                        {msg.name}
                      </h3>
                      <span className="text-xs font-body text-text-muted px-2 py-1 bg-gray-100 rounded-md">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm font-body text-text-muted">
                    {msg.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">{msg.email}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${msg.phone}`} className="hover:text-primary transition-colors">{msg.phone}</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                    <p className="font-body text-text text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col gap-3 shrink-0 justify-end md:justify-start">
                  {msg.status === 'Unread' && (
                    <button 
                      onClick={() => markAsRead(msg._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-primary hover:text-primary transition-colors text-sm font-semibold text-text shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-xl hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold text-red-500 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
