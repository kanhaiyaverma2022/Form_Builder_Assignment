import { useState } from 'react';

export default function TextareaFieldConfig({ field, onChange }) {
  const [rows, setRows] = useState(field.rows || 3);

  const handleRowsChange = (newRows) => {
    const rowCount = parseInt(newRows);
    setRows(rowCount);
    onChange({ rows: rowCount });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-purple-800 mb-2 block">Rows:</span>
        <input
          type="number"
          min="2"
          max="10"
          value={rows}
          onChange={(e) => handleRowsChange(e.target.value)}
          className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </label>
      <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
        <strong>Preview:</strong> This textarea will show {rows} rows by default
      </div>
    </div>
  );
}