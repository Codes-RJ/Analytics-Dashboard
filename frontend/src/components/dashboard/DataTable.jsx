import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { useVirtual } from 'react-virtualizer';
import api from '../../services/api';
import { FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';

export default function DataTable({ dataset }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sortBy, setSortBy] = useState([]);
  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const tableContainerRef = useRef();

  useEffect(() => {
    if (dataset) {
      fetchColumns();
      fetchData(0);
    }
  }, [dataset]);

  useEffect(() => {
    if (dataset) {
      fetchData(0);
    }
  }, [pageSize, sortBy, filters]);

  const fetchColumns = async () => {
    try {
      const { data } = await api.get(`/datasets/${dataset.id}`);
      setColumns(data.columns.map(col => ({
        Header: col.name,
        accessor: col.name,
        Filter: ColumnFilter
      })));
    } catch (error) {
      console.error('Failed to fetch columns', error);
    }
  };

  const fetchData = async (pageIndex) => {
    if (!dataset) return;
    setLoading(true);
    try {
      const params = {
        page: pageIndex + 1,
        limit: pageSize,
        sort: sortBy[0]?.id,
        order: sortBy[0]?.desc ? 'desc' : 'asc',
        filters: JSON.stringify(filters)
      };

      const { data } = await api.get(`/datasets/${dataset.id}/data`, { params });
      setData(data.data);
      setTotalRows(data.total);
      setPageCount(Math.ceil(data.total / pageSize));
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const ColumnFilter = ({ column: { filterValue, setFilter } }) => (
    <input
      value={filterValue || ''}
      onChange={e => setFilter(e.target.value || undefined)}
      placeholder={`Search...`}
      className="mt-1 w-full px-2 py-1 text-xs border rounded"
      onClick={e => e.stopPropagation()}
    />
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: true,
      pageCount,
      manualSortBy: true,
      manualFilters: true,
      disableFilters: !showFilters
    },
    useFilters,
    useSortBy,
    usePagination
  );

  // Virtual rows
  const rowVirtualizer = useVirtual({
    size: page.length,
    parentRef: tableContainerRef,
    estimateSize: useCallback(() => 35, []),
    overscan: 5
  });

  const handleExport = async (format) => {
    try {
      const response = await api.post(`/datasets/${dataset.id}/export`, 
        { format },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  if (!dataset) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Select a dataset to view data
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Table Controls */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Data Preview</h3>
          <span className="text-sm text-gray-500">
            {totalRows.toLocaleString()} rows total
          </span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setTablePageSize(Number(e.target.value));
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[50, 100, 200, 500, 1000].map(size => (
              <option key={size} value={size}>{size} rows</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded hover:bg-gray-50 ${showFilters ? 'bg-primary-50 text-primary-600' : ''}`}
            title="Toggle filters"
          >
            <FiFilter />
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="p-2 border rounded hover:bg-gray-50"
            title="Export CSV"
          >
            <FiDownload />
          </button>
          <button
            onClick={() => fetchData(pageIndex)}
            className="p-2 border rounded hover:bg-gray-50"
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
          </span>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Last
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Showing {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
        </div>
      </div>

      {/* Virtualized Table */}
      <div 
        ref={tableContainerRef} 
        className="overflow-auto" 
        style={{ height: '500px' }}
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
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </div>
                    {showFilters && column.canFilter && column.render('Filter')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                </td>
              </tr>
            ) : (
              rowVirtualizer.virtualItems.map(virtualRow => {
                const row = page[virtualRow.index];
                if (!row) return null;
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="hover:bg-gray-50"
                  >
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}