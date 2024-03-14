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
      let headers ;
      let dataRows ;

      const headerRowIndex = data.findIndex(row => row.includes("Central Tax(₹)"));
        if (headerRowIndex === -1) {
          console.error("Undefined row")
          return
        }
       headers = data[headerRowIndex];
       dataRows = data.slice(headerRowIndex + 1);

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
      const taxNames = ["Central Tax(₹)", "Integrated Tax(₹)", "State/UT Tax(₹)"];
      
      result = result.filter((row) => {
        // console.log(parseFloat(row[taxNames[0]]))
        return parseFloat(row[taxNames[0]]) > 0 ||
               parseFloat(row[taxNames[1]]) > 0 ||
               parseFloat(row[taxNames[2]]) > 0;
      });
    }
    
    if (taxValuesEqualToZero) {
      const taxNames = ["Central Tax(₹)", "Integrated Tax(₹)", "State/UT Tax(₹)"];

      result = result.filter((row) => {
        const integratedTax = parseFloat(row[taxNames[0]]);
        const centralTax = parseFloat(row[taxNames[1]]);
        const stateTax = parseFloat(row[taxNames[2]]);
        return (isNaN(integratedTax) || integratedTax == 0 || integratedTax == undefined) && 
               (isNaN(centralTax) || centralTax == 0 || centralTax==undefined) && 
               (isNaN(stateTax) || stateTax == 0 || stateTax==undefined );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      <div className="container  mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-6">3B2 BILL VERIFIER</h1>
        <div className="flex justify-center my-6">
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
        <div className="flex gap-4 my-4 justify-center">
        <button
          className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-full transition-colors ${
            highlight ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"
          }`}
          onClick={() => setHighlight(!highlight)}
        >
          <span>Checker</span>
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-full transition-colors ${
            taxValuesGreaterThanZero ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"
          }`}
          onClick={() => setTaxValuesGreaterThanZero(!taxValuesGreaterThanZero)}
        >
          <span>Claimed</span>
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-full transition-colors ${
            taxValuesEqualToZero ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"
          }`}
          onClick={() => setTaxValuesEqualToZero(!taxValuesEqualToZero)}
        >
          <span>UnClaimed</span>
        </button>
        </div>
        <DataTable columns={columns} data={filteredData} highlight={highlight} />
        <div className="flex gap-4 my-4 justify-center">
          <button onClick={() => handleDownload(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Download All Data</button>
          <button onClick={() => handleDownload(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Download Filtered Data</button>
        </div>
      </div>
    </div>
  );
}

export default App;
