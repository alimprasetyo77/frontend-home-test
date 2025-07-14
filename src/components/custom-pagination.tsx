"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  totalPages: number;
  page: number;
  onPageChange: (newPage: number) => void;
}

const CustomPagination = ({ totalPages, page, onPageChange }: CustomPaginationProps) => {
  if (!totalPages || isNaN(totalPages) || !page || isNaN(page)) return null;

  const visiblePages = (): number[] => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page === 1) return [1, 2, 3];
    if (page === totalPages) return [totalPages - 2, totalPages - 1, totalPages];

    return [page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages);
  };
  const pages = visiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((p, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === p}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(p);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
