import { useState,useMemo } from 'react'
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import * as XLSX from 'xlsx';
import './App.css'

function App() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(false);

  const handleDataProcessed = (rawData) => {
    const headers = rawData[0];
    const dataRows = rawData.slice(1);
    
    const columns = headers.map((col) => ({ Header: col, accessor: col }));
    const data = dataRows.map((row) => row.reduce((obj, val, i) => ({
      ...obj, [headers[i]]: val
    }), {}));

    setColumns(columns);
    setData(data);
  };

  const filteredData = useMemo(() => {
    if (filter) {
      return data.filter((row) => row.Contact === 12222);
    }
    return data;
  }, [data, filter]);

  const handleDownload = (filtered = false) => {
    const exportData = filtered ? filteredData : data;
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Write the workbook (Excel file)
    XLSX.writeFile(workbook, `export_${filtered ? 'filtered' : 'all'}.xlsx`);
  };
  return (
    <div className="App">
      <h1>Upload and Display Data</h1>
      <FileUpload onDataProcessed={handleDataProcessed} />
      <label>
        <input type="checkbox" checked={filter} onChange={(e) => setFilter(e.target.checked)} />
        Show only contacts with 1222
      </label>
      <DataTable columns={columns} data={filteredData} />
      <button onClick={() => handleDownload(false)}>Download All Data</button>
      <button onClick={() => handleDownload(true)}>Download Filtered Data</button>
    </div>
  );
}


export default App
