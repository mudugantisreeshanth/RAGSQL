import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, Sparkles, AlertCircle } from 'lucide-react';
import { SpeechService } from '../../services/speechService';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenFileUploadModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onOpenFileUploadModal
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      SpeechService.stopListening();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      setIsRecording(true);

      SpeechService.startListening(
        (transcript) => {
          setInputText(transcript);
        },
        (err) => {
          setSpeechError(typeof err === 'string' ? err : 'Voice input failed.');
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  return (
    <div className="p-3 bg-white/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800/80 shrink-0 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Voice recording alert badge */}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Listening to your voice query... Speak now</span>
          </div>
        )}

        {speechError && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500 font-bold" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Input Bar Container */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 focus-within:border-cyan-500 dark:focus-within:border-cyan-500/60 rounded-2xl p-2 shadow-md dark:shadow-xl transition-all">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={onOpenFileUploadModal}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Upload CSV / JSON Dataset"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your database in plain English... (e.g. 'Which region had highest sales?')"
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none max-h-36 py-1.5 px-1 leading-relaxed"
            disabled={isLoading}
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2 rounded-xl transition-all shrink-0 ${
              isRecording 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Voice Recognition"
          >
            {isRecording ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all shrink-0"
            title="Send Query (Enter)"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1">
          <span>RAGSQL v2.0 • Sentence-Transformer fine-tuned on BIRD benchmark</span>
          <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded font-mono text-slate-600 dark:text-slate-400">Shift + Enter</kbd> for line break</span>
        </div>
      </div>
    </div>
  );
};
