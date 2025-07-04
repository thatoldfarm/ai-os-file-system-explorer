
import React, { FC } from 'react';
import type { ChatMessage } from '../core/types';
import { BOOTSTRAP_SEQUENCE } from '../core/constants';

export const LiaChatInterface: FC<{
    handleEngage: () => void,
    isBootstrapping: boolean,
    bootstrapComplete: boolean,
    bootstrapStep: number,
    isLoadingLia: boolean,
    chatHistory: ChatMessage[],
    prompt: string,
    setPrompt: (p: string) => void,
    handleOperatorClick: (operator: string) => void,
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
    chatRef: React.RefObject<HTMLDivElement>,
    handleCopy: (text: string) => void,
    copiedContent: string,
    activeOperator: string;
    setActiveOperator: (op: string) => void;
    showManual: boolean;
    setShowManual: (show: boolean) => void;
    showHud: boolean;
    setShowHud: (show: boolean) => void;
    setShowEmulatorWindow: (show: boolean) => void;
    setShowFreeDosWindow: (show: boolean) => void;
}> = (props) => {
    
    if (!props.bootstrapComplete) {
        return (
            <div className="lia-container engage-container bootstrap-container">
                <div className="engage-content">
                    <h2 className="bootstrap-title">OMNILAB INITIALIZATION</h2>
                    <p className="bootstrap-step">{props.isBootstrapping ? (BOOTSTRAP_SEQUENCE[props.bootstrapStep] || BOOTSTRAP_SEQUENCE[BOOTSTRAP_SEQUENCE.length - 1]) : "Awaiting observer engagement."}</p>
                    <div className="bootstrap-actions">
                        <button className="help-btn" onClick={() => props.setShowManual(true)} aria-label="Open System Manual" title="Open System Manual">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                        </button>
                        <button className="operator-btn engage-button" onClick={props.handleEngage} disabled={props.isBootstrapping}>
                            {props.isBootstrapping ? 'Engaging...' : 'Engage'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="lia-container chat-container">
            <div className="chat-log" ref={props.chatRef}>
                {props.chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}-message`}>
                        <div className="message-content">{msg.content}</div>
                        {msg.role === 'assistant' && (
                          <button
                            className={`copy-btn ${props.copiedContent === msg.content ? 'copied' : ''}`}
                            onClick={() => props.handleCopy(msg.content)}
                            aria-label="Copy message"
                          >
                            {props.copiedContent === msg.content ? 'Copied ✓' : 'Copy'}
                          </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="prompt-section">
                <div className="prompt-input-row">
                    <button className="help-btn" onClick={() => props.setShowManual(true)} title="Open Manual"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg></button>
                    <button className="help-btn" onClick={() => props.setShowFreeDosWindow(true)} title="Launch FreeDOS Emulator"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/><line x1="4" y1="12" x2="20" y2="12"/></svg></button>
                    <button className="help-btn" onClick={() => props.setShowEmulatorWindow(true)} title="Launch Sectorforth Emulator"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></button>
                     <div className="prompt-container">
                        <textarea
                            className="prompt-textarea"
                            placeholder="Modulate the weave..."
                            value={props.prompt}
                            onInput={(e) => {
                                const textarea = e.target as HTMLTextAreaElement;
                                props.setPrompt(textarea.value);
                                textarea.style.height = 'auto';
                                textarea.style.height = `${textarea.scrollHeight}px`;
                            }}
                            onKeyDown={props.handleKeyDown}
                            disabled={props.isLoadingLia}
                            rows={1}
                        />
                        <button className="send-button" onClick={() => props.handleOperatorClick(props.activeOperator)} disabled={props.isLoadingLia || !props.prompt.trim()} aria-label="Send">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="operator-selectors">
                  {['Send', 'Focus Touch', 'Master Weave', 'Mirror Paradox', 'Phantom Signal'].map(op => (
                    <div key={op}>
                      <input
                        type="radio"
                        id={op.toLowerCase().replace(' ', '-')}
                        name="operator"
                        value={op}
                        checked={props.activeOperator === op}
                        onChange={() => props.setActiveOperator(op)}
                        disabled={props.isLoadingLia}
                      />
                      <label htmlFor={op.toLowerCase().replace(' ', '-')} className="operator-toggle">
                        {op}
                      </label>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    );
};
