import { create } from 'zustand';
import { WhatsAppMessageSchema } from '@/types/MessageTypes';

export const useWorkflowStore = create((set, get) => ({
  // State
  nodes: [],
  connections: [],
  selectedNodeId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  validationErrors: {},

  // Connection helper state (for click-to-connect UX)
  connectingFrom: null, // { nodeId, buttonId } when user started a connection

  // Selectors (Memoized)
  selectedNode: () => get().nodes.find(n => n.id === get().selectedNodeId),
  getNodeById: (id) => get().nodes.find(n => n.id === id),

  // Actions
  addNode: (type) => {
    // Spread nodes into a grid to avoid stacking (add a little jitter)
    const index = get().nodes.length;
    const cols = 6;
    const spacingX = 280;
    const spacingY = 180;
    const posX = 120 + (index % cols) * spacingX + (index % 3) * 8; // jitter
    const posY = 120 + Math.floor(index / cols) * spacingY + Math.floor(index % 4) * 6;

    const newNode = {
      id: `node-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Message`,
      type,
      subtype: type === 'interactive' ? 'quick_reply' : 'none',
      header_type: type === 'text' ? 'none' : type,
      header_data: type !== 'text' ? 'https://example.com/media.jpg' : undefined,
      body_data: type === 'text' ? 'Your message here...' : 'Caption text',
      footer_data: '',
      language: 'en',
      position: {
        x: posX,
        y: posY
      },
      buttons: type === 'interactive' ? [
        { id: `btn-${Date.now()}`, title: 'Option 1', type: 'reply' }
      ] : undefined,
      listItems: undefined,
    };
    set(state => ({ nodes: [...state.nodes, newNode] }));
    get().validateNode(newNode.id);
  },

  // start a connection (click on src node/button)
  startConnection: (nodeId, buttonId = null) => {
    set({ connectingFrom: { nodeId, buttonId } });
  },

  // finish connection by clicking target node
  finishConnection: (toNodeId) => {
    const from = get().connectingFrom;
    if (!from || !toNodeId) {
      set({ connectingFrom: null });
      return;
    }
    // avoid self connections
    if (from.nodeId === toNodeId) {
      set({ connectingFrom: null });
      return;
    }
    get().addConnection(from.nodeId, toNodeId, from.buttonId ?? null);
    set({ connectingFrom: null });
  },

  cancelConnection: () => set({ connectingFrom: null }),

  updateNode: (id, updates) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, ...updates } : node
      )
    }));
    get().validateNode(id);
  },

  deleteNode: (id) => {
    set(state => ({
      nodes: state.nodes.filter(node => node.id !== id),
      connections: state.connections.filter(c => c.from !== id && c.to !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
    }));
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodePosition: (id, position) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, position } : node
      )
    }));
  },

  addConnection: (from, to, buttonId = null) => {
    const exists = get().connections.some(c =>
      c.from === from && c.to === to && c.buttonId === buttonId
    );
    if (!exists) {
      set(state => ({
        connections: [...state.connections, {
          id: `conn-${Date.now()}`,
          from,
          to,
          buttonId
        }]
      }));
    }
  },

  removeConnection: (id) => {
    set(state => ({
      connections: state.connections.filter(c => c.id !== id)
    }));
  },

  // accept number or updater function (so CanvasToolbar can call setZoom(prev => ...))
  setZoom: (z) => set(state => {
    const value = typeof z === 'function' ? z(state.zoom) : z;
    return { zoom: Math.max(0.25, Math.min(2, value)) };
  }),

  setPan: (pan) => set({ pan }),

  validateNode: async (id) => {
    const node = get().getNodeById(id);
    if (!node) return;

    try {
      await WhatsAppMessageSchema.parseAsync(node);
      set(state => ({
        validationErrors: {
          ...state.validationErrors,
          [id]: null
        }
      }));
    } catch (error) {
      if (error.name === 'ZodError') {
        set(state => ({
          validationErrors: {
            ...state.validationErrors,
            [id]: error.errors
          }
        }));
      }
    }
  },

  exportWorkflow: () => {
    return JSON.stringify({
      nodes: get().nodes,
      connections: get().connections,
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString()
      }
    }, null, 2);
  },

  importWorkflow: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      const normalizedNodes = (data.nodes || []).map((n, idx) => {
        const id = (typeof n.id === 'number') ? String(n.id) : (n.id || `node-import-${Date.now()}-${idx}`);
        return {
          // keep existing fields but ensure required defaults
          id,
          name: n.name || `${(n.type || 'text').charAt(0).toUpperCase() + (n.type || 'text').slice(1)} Message`,
          type: n.type || 'text',
          subtype: n.subtype ?? (n.type === 'interactive' ? 'quick_reply' : 'none'),
          header_type: n.header_type ?? (n.type === 'text' ? 'none' : n.type),
          header_data: n.header_data,
          body_data: n.body_data ?? (n.type === 'text' ? '' : ''),
          footer_data: n.footer_data ?? '',
          language: n.language || 'en',
          position: n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number'
            ? n.position
            : { x: 100 + idx * 20, y: 100 + idx * 20 },
          buttons: n.buttons,
          listItems: n.listItems,
          created_at: n.created_at,
          updated_at: n.updated_at,
        };
      });

      set({
        nodes: normalizedNodes,
        connections: (data.connections || []).map(c => ({
          ...c,
          id: c.id ? String(c.id) : `conn-import-${Date.now()}`,
          from: String(c.from),
          to: String(c.to),
          buttonId: c.buttonId ?? null,
        })),
        selectedNodeId: null,
      });

      // validate all nodes after import
      normalizedNodes.forEach(node => get().validateNode(node.id));
    } catch (error) {
      console.error('Failed to import workflow:', error);
    }
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      connections: [],
      selectedNodeId: null,
      validationErrors: {}
    });
  }
}));



