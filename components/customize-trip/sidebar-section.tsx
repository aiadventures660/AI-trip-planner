import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, GripVertical, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarSectionProps {
  id: string
  title: string
  icon: React.ReactNode
  options: Record<string, any>
  collapsed: boolean
  onToggle: () => void
  onDragStart: (e: React.DragEvent, type: string, id: string) => void
  onQuickAdd?: (type: string, id: string) => void
}

export default function SidebarSection({
  id,
  title,
  icon,
  options,
  collapsed,
  onToggle,
  onDragStart,
  onQuickAdd,
}: SidebarSectionProps) {
  return (
    <TooltipProvider>
      <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader
          className="pb-3 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
          onClick={onToggle}
          tabIndex={0}
          role="button"
          aria-expanded={!collapsed}
          aria-controls={`sidebar-${id}`}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                {icon}
              </div>
              <span className="font-semibold text-gray-900">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium bg-white/80 backdrop-blur-sm">
                {Object.keys(options).length} options
              </Badge>
              <div className={`transition-transform duration-300 ease-out ${collapsed ? 'rotate-0' : 'rotate-180'}`}>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <div
          id={`sidebar-${id}`}
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            collapsed ? 'max-h-0 opacity-0' : id === 'attractions' ? 'max-h-[800px] opacity-100' : 'max-h-[600px] opacity-100'
          }`}
        >
          <CardContent className="space-y-4 pt-0 max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {Object.entries(options).map(([key, option]) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, id, key)}
                    className="group relative p-5 border border-gray-200 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:scale-[1.02] bg-white overflow-hidden sidebar-item-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-200 border border-gray-200">
                          <GripVertical className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      {option.image && (
                        <div className="flex-shrink-0">
                          <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" id={`loading-${key}`}></div>
                            <img
                              src={option.image}
                              alt={option.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                              loading="lazy"
                              onError={(e) => {
                                console.log('Image failed to load:', option.image)
                                e.currentTarget.style.display = 'none'
                                // Show fallback icon
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon')
                                if (fallback) {
                                  fallback.classList.remove('hidden')
                                }
                                // Hide loading skeleton
                                const loading = e.currentTarget.parentElement?.querySelector(`#loading-${key}`) as HTMLElement
                                if (loading) {
                                  loading.style.display = 'none'
                                }
                              }}
                              onLoad={(e) => {
                                console.log('Image loaded successfully:', option.image)
                                // Hide loading skeleton
                                const loading = e.currentTarget.parentElement?.querySelector(`#loading-${key}`) as HTMLElement
                                if (loading) {
                                  loading.style.display = 'none'
                                }
                              }}
                            />
                            <div className="fallback-icon hidden text-3xl w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 absolute inset-0 z-20">
                              {option.icon || '🏨'}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          {option.icon && <span className="text-2xl">{option.icon}</span>}
                          <h4 className="font-semibold text-base text-gray-900 truncate">{option.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-sm font-medium bg-blue-50 text-blue-700 border-blue-200">
                            AED {option.price}
                            {id === "hotels" ? "/night" : id === "attractions" ? "/person" : "/day"}
                          </Badge>
                          {option.stars && (
                            <div className="flex items-center gap-1">
                              {[...Array(Math.min(option.stars, 3))].map((_, i) => (
                                <span key={i} className="text-yellow-400 text-sm">★</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {option.location && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            {option.location}
                          </p>
                        )}
                        {option.duration && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                            {option.duration}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (onQuickAdd) {
                                  onQuickAdd(id, key)
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-gray-900 text-white">
                            <p>Quick add to first available day</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-600">{option.description || option.features?.join(", ")}</p>
                    <p className="text-sm font-medium text-blue-600">
                      AED {option.price}
                      {id === "hotels" ? "/night" : id === "attractions" ? "/person" : "/day"}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
            {id === 'attractions' && !collapsed && Object.keys(options).length > 8 && (
              <div className="text-center py-4 border-t border-gray-200 mt-4 bg-gradient-to-r from-transparent via-gray-50 to-transparent">
                <p className="text-xs text-gray-600 font-medium mb-2">Scroll for more attractions</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-blue-200 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </TooltipProvider>
  )
} 