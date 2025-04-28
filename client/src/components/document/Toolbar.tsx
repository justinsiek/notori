'use client'

import { 
  Bold, Italic, Underline, ChevronDown, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, 
  ListOrdered, Link, Image, Table, Quote, 
  Palette, Highlighter, Indent, Outdent, Type, X, MoreHorizontal
} from "lucide-react"

export function Toolbar() {
  return (
    <div className="px-6 py-2 border-t border-gray-100 bg-gray-50 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        {/* Font dropdown */}
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-300 transition-colors">
          <span>Arial</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        
        {/* Size dropdown */}
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-300 transition-colors">
          <span>12</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Text style buttons */}
        <div className="flex bg-white border border-gray-200 rounded-md">
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <Bold className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <Italic className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors">
            <Underline className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Headings dropdown */}
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-300 transition-colors">
          <Type className="w-4 h-4" />
          <span>Normal</span>
          <ChevronDown className="w-3 h-3" />
        </div>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Text color and highlight */}
        <button className="p-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
          <Palette className="w-4 h-4 text-gray-700" />
        </button>
        <button className="p-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
          <Highlighter className="w-4 h-4 text-gray-700" />
        </button>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Text alignment */}
        <div className="flex bg-white border border-gray-200 rounded-md">
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <AlignLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <AlignCenter className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <AlignRight className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors">
            <AlignJustify className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Lists */}
        <div className="flex bg-white border border-gray-200 rounded-md">
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <List className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors">
            <ListOrdered className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        {/* Indentation */}
        <div className="flex bg-white border border-gray-200 rounded-md">
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <Outdent className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors">
            <Indent className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Insert elements */}
        <div className="flex bg-white border border-gray-200 rounded-md">
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <Link className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <Image className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200">
            <Table className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 transition-colors">
            <Quote className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        <div className="h-5 w-px bg-gray-300 mx-1"></div>
        
        {/* Clear formatting */}
        <button className="p-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  )
}

export default Toolbar; 