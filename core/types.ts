
export interface FileBlob {
  name: string;
  url: string;
  type: string;
  size: number;
  raw: Blob;
  textContent?: string;
}

export interface LiaState {
  ecm: number; asm: number; wp: number; dp: number; xi: number;
  ic: number; pi: number; rim: number;
  cmp_echo: string; psi_echo: string; t_level: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LogEntry {
  event: string;
  narrative: string;
  timestamp: string;
}
