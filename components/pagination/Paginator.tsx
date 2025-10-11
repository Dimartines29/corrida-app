//components/pagination/Paginator.tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"

export default function ListPaginator({setCurrentPage, currentPage, totalPages}: {setCurrentPage: (page: number) => void, currentPage: number, totalPages: number}) {
    return (
        <div>
            {totalPages > 1 && (
                <div>
                    <Pagination>
                        <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} transition-colors duration-150`}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink
                            onClick={() => setCurrentPage(1)}
                            isActive={currentPage === 1}
                            className="cursor-pointer hover:bg-muted transition-colors duration-150"
                            >
                            1
                            </PaginationLink>
                        </PaginationItem>

                        {currentPage > 4 && (
                            <PaginationItem>
                            <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                            return page !== 1 && page !== totalPages && page >= currentPage - 2 && page <= currentPage + 2
                            })
                            .map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer hover:bg-muted transition-colors duration-150"
                                >
                                {page}
                                </PaginationLink>
                            </PaginationItem>
                            ))}

                        {currentPage < totalPages - 3 && (
                            <PaginationItem>
                            <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {totalPages > 1 && (
                            <PaginationItem>
                            <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                isActive={currentPage === totalPages}
                                className="cursor-pointer hover:bg-muted transition-colors duration-150"
                            >
                                {totalPages}
                            </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} transition-colors duration-150`}
                            />
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
      </div>
    )
}
