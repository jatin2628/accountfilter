    import React, { useMemo } from 'react';
    import { useTable, usePagination } from 'react-table';
    import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';


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

    // const highlightRow = (row) => {
    //     const hasTaxValue = ["INTEGRATED TAX(₹)", "CENTRAL TAX(₹)", "STATE/UT TAX(₹)"].some(tax => {console.log("calling highlioghtsd",row.values);parseFloat(row.values[tax]) > 0});
    //     console.log("data",highlight,hasTaxValue)
    //     console.log(["INTEGRATED TAX(₹) "]); // Notice the use of bracket notation

    //     return highlight && hasTaxValue ? 'bg-yellow-200' : '';
    // };

    const highlightRow = (row) => {
        const taxNames = ["Central Tax(₹)", "Integrated Tax(₹)", "State/UT Tax(₹)"];
        
        const hasTaxValue = taxNames.some(taxName => {
            const taxValue = parseFloat(row.values[taxName]);
            return !isNaN(taxValue) && taxValue > 0;
        });
    
        return highlight && hasTaxValue ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-100';
    };
    

    return (
        <div className="mt-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500 text-white">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{column.render('Header')}</th>
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
                        <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cell.render('Cell')}</td>
                        ))}
                    </tr>
                    );
                })}
                </tbody>
            </table>
            <div className="pagination flex justify-between m-4">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="text-blue-500 hover:text-blue-700 disabled:opacity-50"><FaAngleDoubleLeft /></button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="text-blue-500 hover:text-blue-700 disabled:opacity-50"><FaAngleLeft /></button>
                <span>
                    Page{' '}
                    <strong>
                    {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage} className="text-blue-500 hover:text-blue-700 disabled:opacity-50"><FaAngleRight /></button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="text-blue-500 hover:text-blue-700 disabled:opacity-50"><FaAngleDoubleRight /></button>
                
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default DataTable;
