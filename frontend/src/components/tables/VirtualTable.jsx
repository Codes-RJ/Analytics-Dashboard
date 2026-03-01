import { useMemo, useRef, useCallback } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { useVirtual } from 'react-virtual';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function VirtualTable({ 
  columns, 
  data, 
  onRowClick,
  height = 500,
  rowHeight = 35 
}) {
  const tableContainerRef = useRef();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  const rowVirtualizer = useVirtual({
    size: rows.length,
    parentRef: tableContainerRef,
    estimateSize: useCallback(() => rowHeight, [rowHeight]),
    overscan: 10
  });

  return (
    <div 
      ref={tableContainerRef} 
      className="overflow-auto border rounded-lg"
      style={{ height }}
    >
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? <FiArrowDown /> : <FiArrowUp />
                      ) : ''}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rowVirtualizer.virtualItems.map(virtualRow => {
            const row = rows[virtualRow.index];
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() => onRowClick?.(row.original)}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}