import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export default function Pagination({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  gotoPage,
  previousPage,
  nextPage,
  pageSize,
  setPageSize,
  totalRows
}) {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-white sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min((pageIndex + 1) * pageSize, totalRows)}
            </span>{' '}
            of <span className="font-medium">{totalRows}</span> results
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {pageIndex + 1} of {pageCount}
            </span>
            
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}