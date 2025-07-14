import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  filtersArticle?: { title: string; category: string };
  filterCategory?: { name: string };
  tableType: "category" | "article";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  filtersArticle,
  filterCategory,
  tableType,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  useEffect(() => {
    if (tableType === "article" && filtersArticle) {
      table.getColumn("categoryId")?.setFilterValue(filtersArticle.category);
      table.getColumn("title")?.setFilterValue(filtersArticle.title);
      return;
    }
    if (tableType === "category" && filterCategory) {
      table.getColumn("name")?.setFilterValue(filterCategory.name);
    }
  }, [filterCategory, filtersArticle, table]);

  return (
    <>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-muted/50 z-50 flex items-center justify-center">
            <Loader2 className="animate-spin duration-300 size-5" />
          </div>
        )}
        <Table className="table-fixed ">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      aria-label={`header-${header.id}`}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                      className="text-sm text-slate-900 py-3 px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-5 ">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
