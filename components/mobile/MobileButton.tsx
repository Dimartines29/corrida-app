//components/cases/MobileButton.tsx
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function MobileButton({onButtonClick, show, title}: {onButtonClick: (show: boolean) => void, show: boolean, title: string}) {
    return (
        <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => onButtonClick(!show)}
          className="w-full flex items-center justify-between"
        >
          <span>{title}</span>
          <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${show ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    )
}
