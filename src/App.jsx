import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import DataTable from './components/DataTable';

function App() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [filterContact, setFilterContact] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [taxValuesGreaterThanZero, setTaxValuesGreaterThanZero] = useState(false);
  const [taxValuesEqualToZero, setTaxValuesEqualToZero] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data[0];
      const dataRows = data.slice(1);

      setColumns(headers.map((col) => ({ Header: col, accessor: col })));
      setData(dataRows.map((row) => row.reduce((obj, val, i) => ({
        ...obj, [headers[i]]: val
      }), {})));
    };
    reader.readAsBinaryString(file);
  };

  const filteredData = useMemo(() => {
    let result = data;

    if (filterContact) {
      result = result.filter((row) => row.contact === 1222);
    }

    if (taxValuesGreaterThanZero) {
      result = result.filter((row) => parseFloat(row["Integrated Tax"]) > 0 || parseFloat(row["Central Tax"]) > 0 || parseFloat(row["State Tax"]) > 0);
    }

    if (taxValuesEqualToZero) {
      result = result.filter((row) => {
        const integratedTax = parseFloat(row["Integrated Tax"]);
        const centralTax = parseFloat(row["Central Tax"]);
        const stateTax = parseFloat(row["State Tax"]);
        return (isNaN(integratedTax) || integratedTax === 0) && (isNaN(centralTax) || centralTax === 0) && (isNaN(stateTax) || stateTax === 0);
      });
    }

    return result;
  }, [data, filterContact, taxValuesGreaterThanZero, taxValuesEqualToZero]);

  const handleDownload = (filtered = false) => {
    const exportData = filtered ? filteredData : data;
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `export_${filtered ? 'filtered' : 'all'}.xlsx`);
  };

  return (
    <div cclassName="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-4">Upload and Display Data</h1>
        <div className="flex justify-center">
            <input
              type="file"
              className="file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-700
              "
              onChange={handleFileUpload}
            />
        </div>
        <div className="flex gap-4 my-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" checked={filterContact} onChange={(e) => setFilterContact(e.target.checked)} />
            <span>Show only contacts with 1222</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
            <span>Highlight rows with tax values</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" checked={taxValuesGreaterThanZero} onChange={(e) => setTaxValuesGreaterThanZero(e.target.checked)} />
            <span>Filter: Tax Values gr 0</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" checked={taxValuesEqualToZero} onChange={(e) => setTaxValuesEqualToZero(e.target.checked)} />
            <span>Filter: Tax Values = 0 or Empty</span>
          </label>
        </div>
        <DataTable columns={columns} data={filteredData} highlight={highlight} />
        <div className="flex gap-4 my-4">
          <button onClick={() => handleDownload(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Download All Data</button>
          <button onClick={() => handleDownload(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Download Filtered Data</button>
        </div>
      </div>
    </div>
  );
}

export default App;
