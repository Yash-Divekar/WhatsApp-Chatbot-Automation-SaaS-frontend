import React, { useCallback } from 'react';
import { useWorkflowStore } from '@/store/WorkflowStore';
import {
  MousePointer, AlertCircle, Trash2, Plus, X,
  MessageSquare, Image, Video, FileText
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PropertiesPanel() {
  // derive selectedNode directly from store (avoid function-wrapping and ensure re-subscription)
  const selectedNode = useWorkflowStore((s) => s.nodes.find(n => n.id === s.selectedNodeId));
  const updateNode = useWorkflowStore((s) => s.updateNode);
  const validationErrors = useWorkflowStore((s) => s.validationErrors);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const errors = selectedNode ? validationErrors[selectedNode.id] : null;

  const handleChange = useCallback((field, value) => {
    if (!selectedNode) return;
    updateNode(selectedNode.id, { [field]: value });
  }, [selectedNode, updateNode]);

  const addButton = useCallback(() => {
    if (!selectedNode) return;
    const buttons = selectedNode.buttons || [];
    const maxButtons = selectedNode.subtype === 'cta' ? 2 : 3;
    if (buttons.length < maxButtons) {
      handleChange('buttons', [
        ...buttons,
        { id: `btn-${Date.now()}`, title: `Option ${buttons.length + 1}`, type: 'reply' }
      ]);
    }
  }, [selectedNode, handleChange]);

  const updateButton = useCallback((btnId, field, value) => {
    if (!selectedNode) return;
    const buttons = (selectedNode.buttons || []).map(btn =>
      btn.id === btnId ? { ...btn, [field]: value } : btn
    );
    handleChange('buttons', buttons);
  }, [selectedNode, handleChange]);

  const removeButton = useCallback((btnId) => {
    if (!selectedNode) return;
    handleChange('buttons', (selectedNode.buttons || []).filter(btn => btn.id !== btnId));
  }, [selectedNode, handleChange]);

  const addListItem = useCallback(() => {
    if (!selectedNode) return;
    const listItems = selectedNode.listItems || [];
    if (listItems.length < 10) {
      handleChange('listItems', [
        ...listItems,
        { id: `item-${Date.now()}`, title: `Item ${listItems.length + 1}`, description: '' }
      ]);
    }
  }, [selectedNode, handleChange]);

  const updateListItem = useCallback((itemId, field, value) => {
    if (!selectedNode) return;
    const listItems = (selectedNode.listItems || []).map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    handleChange('listItems', listItems);
  }, [selectedNode, handleChange]);

  const removeListItem = useCallback((itemId) => {
    if (!selectedNode) return;
    handleChange('listItems', (selectedNode.listItems || []).filter(item => item.id !== itemId));
  }, [selectedNode, handleChange]);

  const handleDelete = useCallback(() => {
    if (!selectedNode) return;
    if (window.confirm(`Delete "${selectedNode.name}"?`)) {
      deleteNode(selectedNode.id);
    }
  }, [selectedNode, deleteNode]);

  const getTypeIcon = useCallback(() => {
    const icons = {
      text: MessageSquare,
      image: Image,
      video: Video,
      document: FileText,
      interactive: MousePointer
    };
    return selectedNode ? icons[selectedNode.type] || MessageSquare : MousePointer;
  }, [selectedNode]);

  const TypeIcon = getTypeIcon();

  if (!selectedNode) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center px-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MousePointer className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">No Node Selected</h3>
          <p className="text-xs text-gray-500">
            Click on a message node in the canvas to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TypeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Edit Message</h3>
              <p className="text-xs text-gray-500 capitalize">{selectedNode.type || ''} Message</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="properties" className="p-4 space-y-4 mt-0">
            {/* Validation Errors */}
            {errors && errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-semibold text-red-800">Validation Errors:</p>
                    {errors.map((err, idx) => (
                      <p key={idx} className="text-xs text-red-700">• {err.message}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">Message Name</Label>
              <Input
                id="name"
                value={selectedNode.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter message name"
                className="text-sm"
              />
            </div>

            {/* Type (Read-only) */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Message Type</Label>
              <Input
                value={selectedNode.type ? selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1) : ''}
                disabled
                className="text-sm bg-gray-50"
              />
            </div>

            {/* Header URL for media types */}
            {selectedNode.header_type && selectedNode.header_type !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="header" className="text-xs font-medium">
                  {selectedNode.header_type ? (selectedNode.header_type.charAt(0).toUpperCase() + selectedNode.header_type.slice(1)) : ''} URL
                </Label>
                <Input
                  id="header"
                  value={selectedNode.header_data || ''}
                  onChange={(e) => handleChange('header_data', e.target.value)}
                  placeholder="https://example.com/media.jpg"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">Public URL to your media file</p>
              </div>
            )}

            {/* Body Text */}
            <div className="space-y-2">
              <Label htmlFor="body" className="text-xs font-medium">
                {selectedNode.type === 'text' ? 'Message Text' : 'Caption Text'}
              </Label>
              <Textarea
                id="body"
                value={selectedNode.body_data || ''}
                onChange={(e) => handleChange('body_data', e.target.value)}
                rows={5}
                placeholder="Enter your message here..."
                className="text-sm resize-none"
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  {selectedNode.body_data?.length || 0} / {selectedNode.type === 'text' ? '4096' : '1024'}
                </span>
                {selectedNode.body_data && selectedNode.body_data.length > 0 && (
                  <span className={`${selectedNode.body_data.length > (selectedNode.type === 'text' ? 4096 : 1024) ? 'text-red-500' : 'text-green-500'}`}>
                    {selectedNode.body_data.length > (selectedNode.type === 'text' ? 4096 : 1024) ? 'Too long' : 'Valid'}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-2">
              <Label htmlFor="footer" className="text-xs font-medium">Footer (Optional)</Label>
              <Input
                id="footer"
                value={selectedNode.footer_data || ''}
                onChange={(e) => handleChange('footer_data', e.target.value)}
                placeholder="Add a footer message"
                maxLength={256}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">{selectedNode.footer_data?.length || 0} / 256</p>
            </div>

            {/* Interactive Type Selector */}
            {selectedNode.type === 'interactive' && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Interactive Type</Label>
                <select
                  value={selectedNode.subtype || ''}
                  onChange={(e) => {
                    handleChange('subtype', e.target.value);
                    if (e.target.value === 'list') {
                      handleChange('buttons', undefined);
                      if (!selectedNode.listItems) {
                        handleChange('listItems', [{ id: 'item-1', title: 'Item 1', description: '' }]);
                      }
                    } else {
                      handleChange('listItems', undefined);
                      if (!selectedNode.buttons) {
                        handleChange('buttons', [{ id: 'btn-1', title: 'Option 1', type: 'reply' }]);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="quick_reply">Quick Reply (max 3 buttons)</option>
                  <option value="list">List Message (max 10 items)</option>
                  <option value="cta">Call to Action (max 2 buttons)</option>
                </select>
              </div>
            )}

            {/* Quick Reply Buttons */}
            {(selectedNode.subtype === 'quick_reply' || selectedNode.subtype === 'cta') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    {selectedNode.subtype === 'cta' ? 'CTA Buttons' : 'Quick Reply Buttons'}
                  </Label>
                  {((!selectedNode.buttons || selectedNode.buttons.length < (selectedNode.subtype === 'cta' ? 2 : 3))) && (
                    <Button onClick={addButton} size="sm" variant="outline" className="h-7 text-xs">
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedNode.buttons?.map((btn, idx) => (
                    <div key={btn.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">Button {idx + 1}</span>
                        <Button onClick={() => removeButton(btn.id)} size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <Input value={btn.title} onChange={(e) => updateButton(btn.id, 'title', e.target.value)} placeholder="Button title" maxLength={20} className="text-sm" />

                      <select value={btn.type} onChange={(e) => updateButton(btn.id, 'type', e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md">
                        <option value="reply">Reply Action</option>
                        <option value="url">URL Action</option>
                        <option value="phone">Phone Call</option>
                      </select>

                      <p className="text-xs text-gray-500">{btn.title.length} / 20 characters</p>
                    </div>
                  ))}

                  {(!selectedNode.buttons || selectedNode.buttons.length === 0) && (
                    <div className="text-center py-4 text-xs text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      No buttons added yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* List Items */}
            {selectedNode.subtype === 'list' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">List Items</Label>
                  {((!selectedNode.listItems || selectedNode.listItems.length < 10)) && (
                    <Button onClick={addListItem} size="sm" variant="outline" className="h-7 text-xs">
                      <Plus className="w-3 h-3 mr-1" /> Add Item
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedNode.listItems?.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">Item {idx + 1}</span>
                        <Button onClick={() => removeListItem(item.id)} size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <Input value={item.title} onChange={(e) => updateListItem(item.id, 'title', e.target.value)} placeholder="Item title" maxLength={24} className="text-sm" />

                      <Input value={item.description || ''} onChange={(e) => updateListItem(item.id, 'description', e.target.value)} placeholder="Description (optional)" maxLength={72} className="text-sm" />

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Title: {item.title.length}/24</span>
                        <span>Desc: {item.description?.length || 0}/72</span>
                      </div>
                    </div>
                  ))}

                  {(!selectedNode.listItems || selectedNode.listItems.length === 0) && (
                    <div className="text-center py-4 text-xs text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      No list items added yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">WhatsApp Preview</h4>
                
                {/* Mock WhatsApp Message */}
                <div className="bg-white rounded-lg shadow-sm p-3 space-y-2">
                  {selectedNode.header_type !== 'none' && (
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                      <TypeIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {selectedNode.body_data && (
                    <p className="text-xs text-gray-800 whitespace-pre-wrap break-words">
                      {selectedNode.body_data}
                    </p>
                  )}
                  
                  {selectedNode.footer_data && (
                    <p className="text-xs text-gray-500 italic">
                      {selectedNode.footer_data}
                    </p>
                  )}
                  
                  {selectedNode.buttons && selectedNode.buttons.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-gray-200">
                      {selectedNode.buttons.map(btn => (
                        <div key={btn.id} className="text-center py-2 bg-blue-50 rounded text-xs font-medium text-blue-600">
                          {btn.title}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedNode.listItems && selectedNode.listItems.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-center py-2 bg-purple-50 rounded text-xs font-medium text-purple-600">
                        📋 View {selectedNode.listItems.length} Options
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Node Info */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Node Info</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{selectedNode.type}</span>
                  </div>
                  {selectedNode.subtype && selectedNode.subtype !== 'none' && (
                    <div className="flex justify-between">
                      <span>Subtype:</span>
                      <span className="font-medium capitalize">{selectedNode.subtype.replace('_', ' ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Node ID:</span>
                    <span className="font-mono text-xs">{(selectedNode.id || '').toString().slice(0, 12)}...</span>
                  </div>
                  {selectedNode.buttons && (
                    <div className="flex justify-between">
                      <span>Buttons:</span>
                      <span className="font-medium">{selectedNode.buttons.length}</span>
                    </div>
                  )}
                  {selectedNode.listItems && (
                    <div className="flex justify-between">
                      <span>List Items:</span>
                      <span className="font-medium">{selectedNode.listItems.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}