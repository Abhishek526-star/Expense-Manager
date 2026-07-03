import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = "transactions") => {
    if(!data || data.length === 0) {
        alert("No data available to export.");
        return;
    }
    try{
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        // Save the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`,{
            bookType: 'xlsx',
            type: 'array'
        });
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Error exporting to Excel. Please try again.");
    }
}
   