import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';

const DataTable = ({ columns, data, highlight }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 30 },
  },
  usePagination);

  const highlightRow = (row) => {
    const hasTaxValue = ['Integrated Tax', 'Central Tax', 'State Tax'].some(tax => parseFloat(row.values[tax]) > 0);
    return highlight && hasTaxValue ? 'bg-yellow-200' : '';
  };

  return (
    <div className="mt-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className={highlightRow(row)}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
