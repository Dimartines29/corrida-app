// src/components/cases/IndicatorCard.tsx
import { BadgeAlert } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function IndicatorCard({ title, description, value, activeCardFilter, filter, handleCardFilter }: { title: string, description: string, value: number, activeCardFilter: string, filter:string, handleCardFilter: (filter: string) => void }) {
    return (
        <Card className={`border hover:shadow-md transition-all duration-200 cursor-pointer ${activeCardFilter === filter ? 'bg-primary/10 border-primary/20 shadow-md' : 'bg-muted/50 hover:bg-muted/70'}`} onClick={() => handleCardFilter(filter)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm md:text-lg font-medium text-muted-foreground">{title}</CardTitle>
                <BadgeAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl md:text-5xl font-bold text-foreground">{value}</div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {description}
                </div>
            </CardFooter>
        </Card>
    )
}
