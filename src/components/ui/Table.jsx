import React from 'react';

const Table = ({
  columns = [],
  data = [],
  emptyText = 'No data available',
  className = '',
}) => {
  return (
    <div className={`hrms-table-container ${className}`}>
      <table className="hrms-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} style={col.width ? { width: col.width } : {}}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={row.id || rIdx}>
                {columns.map((col, cIdx) => (
                  <td key={col.key || cIdx}>
                    {col.render ? col.render(row[col.key], row, rIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
