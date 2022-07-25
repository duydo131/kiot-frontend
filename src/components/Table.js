import { DataGrid } from '@mui/x-data-grid';



export default function DataTable({ rows, columns }) {
  return (
    <div style={{ height: 640, width: '100%', marginTop: '3%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoHeight
        // checkboxSelection
      />
    </div>
  );
}
