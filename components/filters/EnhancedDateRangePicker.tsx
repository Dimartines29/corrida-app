// src/components/filters/EnhancedDateRangePicker.tsx
"use client"

import * as React from "react"
import {addDays, format, startOfMonth, endOfMonth} from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DateRangePickerProps, DateRange } from "@/types/types"
import { cn } from "@/lib/utils"

// Add 1 day to include all records from the target date
const includeFullDay = (date: Date) => addDays(date, 1)

const presets = [
  {
    label: "Hoje",
    value: "today",
    range: () => ({
      from: new Date(),
      to: new Date()
    }),
  },
  {
    label: "Ontem",
    value: "yesterday",
    range: () => {
      return {
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      }
    },
  },
  {
    label: "Últimos 7 dias",
    value: "last7days",
    range: () => ({
      from: addDays(new Date(), -6),
      to: new Date()
    }),
  },
  {
    label: "Últimos 14 dias",
    value: "last14days",
    range: () => ({
      from: addDays(new Date(), -13),
      to: new Date()
    }),
  },
  {
    label: "Últimos 30 dias",
    value: "last30days",
    range: () => ({
      from: addDays(new Date(), -29),
      to: new Date()
    }),
  },
  {
    label: "Este mês",
    value: "thismonth",
    range: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
]

export function EnhancedDateRangePicker({
  value,
  onChange,
  isLoading = false,
  showPresets = true,
  numberOfMonths = 1
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const getSelectedPreset = () => {
    if (!value?.from || !value?.to) return null

    return presets.find(preset => {
      const presetRange = preset.range()
      return presetRange.from.getTime() === value.from.getTime() &&
             presetRange.to.getTime() === value.to.getTime()
    })?.value || null
  }

  const handlePresetSelect = (presetValue: string) => {
    const preset = presets.find((p) => p.value === presetValue)
    if (preset) {
      const newRange = preset.range()
      onChange(newRange)
      setOpen(false)
    }
  }

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return ''
    }

    if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
      return `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`
    }

    return format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
  }

  const selectedPreset = getSelectedPreset()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[220px] justify-start text-left font-normal transition-all duration-200",
            !value && "text-muted-foreground",
            isLoading && "opacity-50",
          )}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarIcon className="mr-2 h-4 w-4" />}
          <span className="truncate">{formatDateRange(value) || "Selecionar período"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-w-[95vw]" align="start">
        <div className="flex flex-col md:flex-row">
          {showPresets && (
            <div className="flex flex-col gap-1 p-4 md:border-r border-b md:border-b-0 min-w-full md:min-w-[200px]">
              <div className="text-sm font-medium mb-2">Períodos</div>

              <div className="grid grid-cols-2 gap-1 md:flex md:flex-col md:gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={selectedPreset === preset.value ? "default" : "ghost"}
                    className="justify-start text-xs md:text-sm w-full h-8 md:h-auto"
                    onClick={() => handlePresetSelect(preset.value)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{preset.label}</span>
                      {selectedPreset === preset.value && (
                        <Check className="h-3 w-3 ml-1 hidden md:inline" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="text-sm font-medium mb-4 hidden md:block">Período selecionado</div>
            <Calendar
              mode="range"
              selected={value}
              onSelect={(selectedRange) => {
                if (selectedRange?.from && selectedRange?.to) {
                  onChange(selectedRange as DateRange)

                  if (window.innerWidth < 768) {
                    setTimeout(() => setOpen(false), 300)
                  }
                }
              }}
              numberOfMonths={window.innerWidth < 768 ? 1 : numberOfMonths}
              locale={ptBR}
              className="rounded-md border-0 md:border"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
