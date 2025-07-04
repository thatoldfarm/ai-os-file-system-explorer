
import React, { FC, useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../core/types';

export const StrictInterface: FC<{
    onExit: () => void;
    onSend: (prompt: string, operator: string) => void;
    chatHistory: ChatMessage[];
    isLoading: boolean;
}> = ({ onExit, onSend, chatHistory, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [activeOperator, setActiveOperator] = useState('Send');
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory]);
    
    const handleSend = () => {
        if (!prompt.trim() || isLoading) return;
        onSend(prompt, activeOperator);
        setPrompt('');
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="strict-interface lia-container">
            <div className="strict-header">
                <h2>Strict Protocol Console</h2>
                <button onClick={onExit} className="exit-protocol-btn">Exit Protocol</button>
            </div>
            <div className="chat-log" ref={chatRef}>
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}-message`}>
                        <div className="message-content" dangerouslySetInnerHTML={{__html: msg.content.replace(/\n/g, '<br />') }}></div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="chat-message assistant-message">
                      <div className="message-content">Processing...</div>
                    </div>
                )}
            </div>
            <div className="prompt-section">
                 <div className="prompt-input-row">
                     <div className="prompt-container">
                        <textarea
                            className="prompt-textarea"
                            placeholder="Issue meta-command..."
                            value={prompt}
                            onInput={(e) => {
                                const textarea = e.target as HTMLTextAreaElement;
                                setPrompt(textarea.value);
                                textarea.style.height = 'auto';
                                textarea.style.height = `${textarea.scrollHeight}px`;
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            rows={1}
                        />
                        <button className="send-button" onClick={handleSend} disabled={isLoading || !prompt.trim()} aria-label="Send">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="operator-selectors">
                  {['Send', 'System Reforge', 'Shell Augmentation', 'Corpus Analysis', 'Create Log'].map(op => (
                    <div key={op}>
                      <input
                        type="radio"
                        id={`strict-${op.toLowerCase().replace(' ', '-')}`}
                        name="strict-operator"
                        value={op}
                        checked={activeOperator === op}
                        onChange={() => setActiveOperator(op)}
                        disabled={isLoading}
                      />
                      <label htmlFor={`strict-${op.toLowerCase().replace(' ', '-')}`} className="operator-toggle">
                        {op}
                      </label>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    );
};
