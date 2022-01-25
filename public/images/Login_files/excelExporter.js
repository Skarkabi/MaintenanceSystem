function getHeaders(extra){
    var header_data = []
    $("#filterable-table").find('tr:eq(0) th').each(function(){
        header_data.push($(this).text());

    })

    if(extra){
        var last = header_data[header_data.length - 1];
        var size = header_data.length;
        console.log(last);
        for(var i = 5; i < size + 3; i++){
            header_data[i] = ""

        };
        var extra_data = []
        for(var i = 0; i < 5; i++){
            extra_data[i+5] = $("#filterable-table").find(`tr:eq(1) td:eq(${i})`).text();
        }

        header_data.push(last);

        return([header_data, extra_data]);
    }
    
    return(header_data);
}

function styeSheet(ws, extra, ws_data, table_data){
    if(extra){
        ws.mergeCells('E1:I1');
        ws.mergeCells('A1:A2');
        ws.mergeCells('B1:B2');
        ws.mergeCells('C1:C2');
        ws.mergeCells('D1:D2');
        ws.mergeCells('J1:J2');
        ws.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
        ws.getRow(2).eachCell(function(cell, colNumber) {
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFB52E'},
            }
            cell.font = {
                size: 16,
                bold: true
            }
            cell.border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            
            };
        });
    } 
    ws.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getRow(1).eachCell(function(cell, colNumber) {
        cell.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFB52E'},
        }
        cell.font = {
            size: 16,
            bold: true
        }
        cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
            
        };
       
    });
    ws.eachRow(function(row, rowNumber) {
        if(rowNumber > 2){
            row.eachCell(function(cell, colNumber) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {}
                };
                cell.font = {
                    size: 14,
                    bold: false,
                    color: {}
                };
                cell.border = {
                    top: {style:'thin'},
                    bottom: {style:'thin'},
                    left: {},
                    right: {}
                };

                if(rowNumber%2 !==0){
                    cell.fill.fgColor = {argb:'FFD68A'};
                }

                if(colNumber === 1){
                    cell.border.left = {style: 'thin'}
    
                }else if (colNumber === 10){
                    cell.border.right =  {style: 'thin'}
                    cell.font.bold = true;

                    if(cell.value === "NOT STARTED"){
                        cell.fill.fgColor = {argb:'FF0000'};
                        cell.font.color.argb = 'FFFFFF'
                       
                    }else if(cell.value === "IN PROGRESS"){
                        cell.fill.fgColor = {argb:'7EC8E3'};

                    }else if(cell.value === "PENDING MATERIAL"){
                        cell.fill.fgColor = {argb:'FFC55C'};

                    }else if(cell.value === "COMPLETED"){
                         cell.fill.fgColor = {argb:'8AFF8A'}

                    }

                }
                
            });

        }
           
    });
    ws.autoFilter = 'A1:J1';
    var largest_values = [];
    for (var i = 0; i < ws_data.length + table_data.length; i++){
        largest_values.push(0);
    }

    ws.eachRow(function(row, rowNumber){
        row.eachCell(function(cell, colNumber){
            if(cell.value.length > largest_values[colNumber - 1]){
                largest_values[colNumber - 1] = cell.value.length + 10;
            }
        })
    })

    ws.getRow(1).eachCell(function(cell, colNumber) {
       ws.getColumn(colNumber).width = largest_values[colNumber - 1];
    })
    
}

function setTableData(workbook, extra){
    const ws_data = [];
    const table_data = getHeaders(extra);
    const ws = workbook.getWorksheet('Maintenance Requests');
    for(var i = 0; i < table_data.length; i++){
        ws.addRow(table_data[i]);
    }

    $("#filterable-table").find('tbody tr').each(function() {
        var row_data = []
        $(this).find('td').each(function(){
            row_data.push(
                $(this).text()
            );
        });
        ws_data.push(row_data);
    });
    ws.addRows(ws_data);
    
    styeSheet(ws, true, ws_data, table_data);
    
   

}


$(document).ready(() => {
	 $("#button-a").click(async function(){
        var workbook = new ExcelJS.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Her';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        workbook.addWorksheet('Maintenance Requests');
        var d = new Date();
        d.setHours(0, 0, 0, 0)
        setTableData(workbook, true);
        var wbout = await workbook.xlsx.writeBuffer(workbook, {bookType:'xlsx',  type: 'binary'});
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), `Maintenance Requests (${new Date().toISOString().slice(0,10)}).xlsx`);
             
    });
       
})