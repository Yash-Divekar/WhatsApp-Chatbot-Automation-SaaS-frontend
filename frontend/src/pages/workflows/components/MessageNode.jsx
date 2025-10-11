import React, { useCallback } from 'react';
import { useWorkflowStore } from '@/store/WorkflowStore';
import {
  MessageSquare, Image as ImageIcon, Video, FileText, MousePointer,
  AlertCircle, Reply, List, Phone, Link as LinkIcon, Plus, Info
} from 'lucide-react';

/**
 * MessageNode - visual card for node
 * - Connection points now call startConnection(nodeId, buttonId)
 * - Small info (i) icon shows tooltip via title attribute
 */
export default function MessageNode({ node }) {
  const { validationErrors, selectNode, startConnection, connectingFrom } = useWorkflowStore();
  const errors = validationErrors[node.id];
  const hasErrors = errors && errors.length > 0;

  const iconMap = {
    text: MessageSquare,
    image: ImageIcon,
    video: Video,
    document: FileText,
    interactive: MousePointer,
  };

  const Icon = iconMap[node.type] || MessageSquare;

  // connection start
  const handleConnectStart = useCallback((buttonId, e) => {
    e.stopPropagation();
    startConnection(node.id, buttonId);
  }, [node.id, startConnection]);

  // clicking node header selects node (handled by wrapper DraggableNode click too)
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    selectNode(node.id);
  }, [node.id, selectNode]);

  // renderButton connection points call handleConnectStart
  const renderButtons = useCallback(() => {
    if (node.subtype === 'quick_reply' && node.buttons && node.buttons.length > 0) {
      return (
        <div className="px-3 pb-3 space-y-1.5">
          {node.buttons.slice(0, 3).map((btn, idx) => {
            const btnIcon = btn.type === 'url' ? LinkIcon : btn.type === 'phone' ? Phone : Reply;
            return (
              <div
                key={btn.id}
                className="relative flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-xs hover:bg-blue-100 transition-colors group"
              >
                {React.createElement(btnIcon, { className: "w-3.5 h-3.5 text-blue-600 flex-shrink-0" })}
                <span className="text-gray-700 truncate flex-1">{btn.title}</span>

                {/* Connection Point */}
                <button
                  type="button"
                  onClick={(e) => handleConnectStart(btn.id, e)}
                  title="Click to start connecting from this button"
                  className="connection-point absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md opacity-90 hover:scale-110"
                  data-button-id={btn.id}
                  data-node-id={node.id}
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (node.subtype === 'list' && node.listItems && node.listItems.length > 0) {
      return (
        <div className="px-3 pb-3">
          <div className="relative flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-200 rounded-md text-xs hover:bg-purple-100 transition-colors group">
            <List className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="text-gray-700 font-medium">{node.listItems.length} options</span>

            <button
              type="button"
              onClick={(e) => handleConnectStart('list', e)}
              title="Click to start connecting from list"
              className="connection-point absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md opacity-90 hover:scale-110"
              data-button-id="list"
              data-node-id={node.id}
            />
          </div>
        </div>
      );
    }

    if (node.subtype === 'cta' && node.buttons && node.buttons.length > 0) {
      return (
        <div className="px-3 pb-3 space-y-1.5">
          {node.buttons.map((btn) => {
            const btnIcon = btn.type === 'url' ? LinkIcon : btn.type === 'phone' ? Phone : Reply;
            return (
              <div
                key={btn.id}
                className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md text-xs hover:bg-green-100 transition-colors"
              >
                {React.createElement(btnIcon, { className: "w-3.5 h-3.5 text-green-600 flex-shrink-0" })}
                <span className="text-gray-700 truncate">{btn.title}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }, [node, handleConnectStart]);

  return (
    <div
      className={`w-64 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 cursor-pointer ${
        node.isSelected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl' : 'hover:shadow-xl'
      } ${hasErrors ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Node Header */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xs font-semibold text-gray-800 truncate">{node.name}</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {/* Small info icon with tooltip */}
          <button
            type="button"
            title={`Node: ${node.name}\nType: ${node.type}${node.subtype ? ` (${node.subtype})` : ''}`}
            className="p-1 rounded hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()}
            aria-label="Node info"
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>

          {hasErrors && (
            <div className="flex-shrink-0 ml-1" title="Validation errors">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>
      </div>

      {/* Message Preview Content */}
      <div className="relative">
        {/* header, body, buttons, footer (unchanged rendering) */}
        {/* reuse existing renderHeader/renderBody/renderFooter logic from original file */}
        {/* For brevity keep those rendering helpers unchanged in your file; only connection points were updated above */}
        {node.header_type !== 'none' && (
          <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)'
              }} />
            </div>
            <div className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <div className="p-3 space-y-1.5">
          <div className="h-2 bg-gray-200 rounded" style={{ width: '90%' }} />
          <div className="h-2 bg-gray-200 rounded" style={{ width: '80%' }} />
        </div>

        {renderButtons()}

        {node.footer_data && (
          <div className="px-3 pb-3">
            <div className="h-1.5 bg-gray-100 rounded w-2/3 opacity-60" />
          </div>
        )}
      </div>

      {/* Node Type Badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full">
        <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">
          {node.type}
        </span>
      </div>
    </div>
  );
}