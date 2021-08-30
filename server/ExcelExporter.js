import Bluebird from 'bluebird';
import ExcelJS from 'exceljs';

function styeSheet(ws, header_data, table_data){
    var numberOfHeaders = header_data[0].length;
    if(header_data.length === 2){
        numberOfHeaders = numberOfHeaders + header_data[1].length;
        ws.mergeCells('E1:I1');
        ws.mergeCells('A1:A2');
        ws.mergeCells('B1:B2');
        ws.mergeCells('C1:C2');
        ws.mergeCells('D1:D2');
        ws.mergeCells('J1:J2');
        ws.mergeCells('K1:K2');
        ws.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
        ws.getRow(2).eachCell(function(cell) {
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
    ws.getRow(1).eachCell(function(cell) {
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
        if(rowNumber > header_data.length){
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
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
                };

                if(rowNumber%2 !==0){
                    cell.fill.fgColor = {argb:'FFD68A'};
                }

                if(colNumber === 1){
                    cell.border.left = {style: 'thin'}
    
                }else if (colNumber === numberOfHeaders - 1){
                    cell.border.right =  {style: 'thin'}
                    if(header_data.length === 2){
                        cell.font.bold = true;
                        cell.value = cell.value.toUpperCase();
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

                }

            });

        }
           
    });
    var endPoint = (numberOfHeaders + 9).toString(36).toUpperCase();
    ws.autoFilter = `A1:${endPoint}1`;
    var largest_values = [];
    console.log(1);
    for (var i = 0; i < header_data.length + table_data.length; i++){
        largest_values.push(0);
    }
    console.log(2)

    ws.eachRow(function(row){
        row.eachCell(function(cell, colNumber){
        console.log(3)
            if(cell.value && cell.value.length > largest_values[colNumber - 1]){
                largest_values[colNumber - 1] = cell.value.length + 10;
            }
            console.log(4)
        })
    })

    for(var i = 1; i <= numberOfHeaders; i++){
        ws.getColumn(i).width = largest_values[i - 1];
    }
    
}

function getHeaders(values){
    var header_data = [];
    values[0].map(headers => {
        header_data.push(headers);
    })
    if(values.length === 2){
        var last = header_data[header_data.length - 1];
        var second_header =[];
        values[1].map(headers => {
            second_header.push(headers);
        })
        var size = header_data.length;
        for(var i = 5; i < size + 3; i ++){
            header_data[i] = ""
        };
        var extra_data = [];
        for(var i = 0; i < 5; i++){
            extra_data[i+5] = second_header[i];
        }

        header_data.push(last);
        return ([header_data, extra_data]);
    }
    return header_data;
}

function setTableData(workbook, tableValues){
    const headers = getHeaders(tableValues.headerData);
    const ws = workbook.getWorksheet('Maintenance Requests');
    if(headers.length === 2){
        ws.addRow(headers[0]);
        ws.addRow(headers[1]);
    }else{
        ws.addRow(headers);
    }

    tableValues.tableData.map(values => {
        ws.addRow(values);
    });

    styeSheet(ws, tableValues.headerData, tableValues.tableData);
}

exports.getExcelTable = (headerData, tableData) => {
    return new Bluebird((resolve, reject) => {
        var workbook = new ExcelJS.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Her';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        workbook.addWorksheet('Maintenance Requests');
        var d = new Date();
        d.setHours(0, 0, 0, 0)
        setTableData(workbook, {headerData: headerData, tableData: tableData});
        workbook.xlsx.writeBuffer().then(buffer => {
            resolve(buffer);

        }).catch(err => {
            reject(err);

        });

    });

}      
   

