var wb = XLSX.utils.book_new();
wb.Props = 
    {
        Title: "SheetJS Tutorial",
        Subject: "Test",
        Author: "Red Stapler",
        CreatedDate: new Date(2017,12,19)
    };
        
wb.SheetNames.push("Test Sheet");
	
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
                
}

function tesst(){
    return $("#filterable-table").find('tbody tr').length;
}

function formatData(){
    var ws_data = [];
    ws_data.push([
        $("#filterable-table").find('tr:eq(0) th:eq(0)').text(),
        $("#filterable-table").find('tr:eq(0) th:eq(1)').text(),
        $("#filterable-table").find('tr:eq(0) th:eq(2)').text(),
        $("#filterable-table").find('tr:eq(0) th:eq(3)').text(),
        $("#filterable-table").find('tr:eq(0) th:eq(4)').text(),
        "","","","",
        $("#filterable-table").find('tr:eq(0) th:eq(5)').text()
    ]);
    ws_data.push([
        "","","","",
        $("#filterable-table").find('tr:eq(1) td:eq(0)').text(),
        $("#filterable-table").find('tr:eq(1) td:eq(1)').text(),
        $("#filterable-table").find('tr:eq(1) td:eq(2)').text(),
        $("#filterable-table").find('tr:eq(1) td:eq(3)').text(),
        $("#filterable-table").find('tr:eq(1) td:eq(4)').text(),
    ]);


    $("#filterable-table").find('tbody tr').each(function() {
        ws_data.push([
            $(this).find('td:eq(0)').text(),
            $(this).find('td:eq(1)').text(),
            $(this).find('td:eq(2)').text(),
            $(this).find('td:eq(3)').text(),
            $(this).find('td:eq(4)').text(),
            $(this).find('td:eq(5)').text(),
            $(this).find('td:eq(6)').text(),
            $(this).find('td:eq(7)').text(),
            $(this).find('td:eq(8)').text(),
            $(this).find('td:eq(9)').text()
        ]);
      });
      //console.log($("#filterable-table").find('tbody tr').length);
    return ws_data;
}
$(document).ready(() => {
	 $("#button-a").click(function(){
        var ws = XLSX.utils.aoa_to_sheet(formatData());
        const merge = [
             {s: { r: 0, c: 4 }, e: { r: 0, c: 8 }},
             {s: { r: 0, c: 0 }, e: { r: 1 ,c: 0 }},
             {s: { r: 0, c: 1 }, e: { r: 1 ,c: 1 }},
             {s: { r: 0, c: 2 }, e: { r: 1 ,c: 2 }},
             {s: { r: 0, c: 3 }, e: { r: 1 ,c: 3 }},
             {s: { r: 0, c: 9 }, e: { r: 1 ,c: 9 }},
        ];
        ws["!merges"] = merge;
        wb.Sheets["Test Sheet"] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
        });
})