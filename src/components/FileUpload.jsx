import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onDataProcessed }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      onDataProcessed(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="file-upload-wrapper"> 
    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileUpload} style={{ display: 'none' }} />
    <label htmlFor="file-upload" className="file-upload-label">
        <span className="file-upload-btn">Choose File</span>
        <span className="file-upload-text">{fileName || 'No file chosen...'}</span>
      </label>
    </div>
  );
};

export default FileUpload;
