/**
 * WebMCP (Web Model Context Protocol) Integration
 * W3C Incubator / Chrome & Edge Agentic Browsing Standard
 * Enables autonomous AI agents to discover and invoke client-side cryptographic tools
 */

export interface WebMcpTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
  execute: (args: Record<string, any>) => Promise<any> | any;
}

export function registerWebMcpTools(): void {
  if (typeof window === 'undefined') return;

  const tools: WebMcpTool[] = [
    {
      name: 'base64_encode_decode',
      description: 'Encode or decode a string to/from standard RFC 4648 Base64 in local browser memory.',
      parameters: {
        type: 'object',
        properties: {
          action: { type: 'string', description: 'Operation: "encode" or "decode"' },
          text: { type: 'string', description: 'Input text string' }
        },
        required: ['action', 'text']
      },
      execute: async ({ action, text }: { action: string; text: string }) => {
        try {
          if (action === 'decode') {
            return { result: atob(text.trim()) };
          }
          const bytes = new TextEncoder().encode(text);
          let bin = '';
          for (let i = 0; i < bytes.length; i++) {
            bin += String.fromCharCode(bytes[i]);
          }
          return { result: btoa(bin) };
        } catch (err: any) {
          return { error: err.message || 'Base64 operation failed' };
        }
      }
    },
    {
      name: 'sha256_hash',
      description: 'Compute a cryptographic SHA-256 digest natively via W3C Web Cryptography API.',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Input text to hash' }
        },
        required: ['text']
      },
      execute: async ({ text }: { text: string }) => {
        try {
          const data = new TextEncoder().encode(text);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          return { algorithm: 'SHA-256', hash: hex };
        } catch (err: any) {
          return { error: err.message || 'Hashing failed' };
        }
      }
    },
    {
      name: 'generate_uuid',
      description: 'Generate a cryptographically secure RFC 9562 UUID v4.',
      parameters: {
        type: 'object',
        properties: {
          count: { type: 'number', description: 'Number of UUIDs to generate (1-10)' }
        }
      },
      execute: ({ count = 1 }: { count?: number }) => {
        const qty = Math.min(Math.max(1, count), 10);
        const uuids = Array.from({ length: qty }, () => crypto.randomUUID());
        return { count: qty, uuids };
      }
    }
  ];

  try {
    // 1. Standard Document.modelContext (Modern WebMCP standard in Chromium)
    const doc = document as any;
    if (doc.modelContext && typeof doc.modelContext.registerTool === 'function') {
      tools.forEach(tool => {
        doc.modelContext.registerTool({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          handler: tool.execute
        });
      });
    } else {
      // Polyfill / expose modelContext object for AI agent discovery
      doc.modelContext = {
        specVersion: '1.0',
        tools: tools.map(t => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters
        })),
        invokeTool: async (name: string, args: Record<string, any>) => {
          const t = tools.find(x => x.name === name);
          if (!t) throw new Error(`Tool "${name}" not found`);
          return await t.execute(args);
        }
      };
    }

    // 2. Navigator.modelContext fallback
    const nav = navigator as any;
    if (!nav.modelContext) {
      nav.modelContext = doc.modelContext;
    }

    // 3. Window WebMCP discovery marker
    (window as any).__WEBMCP__ = {
      specVersion: '1.0',
      catalogUrl: '/.well-known/ai-catalog.json',
      toolsCount: tools.length,
      tools: tools.map(t => t.name)
    };
  } catch (e) {
    // Graceful degradation for non-supporting browsers
  }
}
