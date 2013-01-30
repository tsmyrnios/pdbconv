#!/usr/bin/env node
var program = require('commander')
    .version('1.0.0')
    .option('-v, --version <number>', 'Version of Protein Data Bank file')
    .option('-o, --output <path>', 'Output format (json|csv)')
    .parse(process.argv),
    fs = require("fs"),
    format = null,
    data = '',
    output = function(records){};

function jsonOutput(records){
    return JSON.stringify(records)
}
function csvOutput(records){
    if(records.length > 0){
        var recNames = nameArr(records[0]);
        if(recNames.length > 0){
            return [
                    '"' + recNames.join('","') + '"',
                    records.map(function (record){ var vals = valArr(record); return '"' + vals.join('","') + '"';})
                        .join('\n')
            ].join('\n');
        }
    }
    return '';
}
function nameArr(arr){
    var newArr = [];
    for(var prop in arr){
        newArr.push(prop);
    }
    return newArr;
}
function valArr(arr){
    var names = nameArr(arr);
    return names.map(function(name){return arr[name];});
}

switch(program.version){
    case '3.3':
    default:
        format = JSON.parse(fs.readFileSync('./format-3.3.json','utf8'));
        break;
}

switch(program.output){
    case 'csv':
        output = csvOutput;
        break;
    case 'json':
    default:
        output = jsonOutput;
        break;
}

if(format){
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', function (chunk) {
      data += chunk;
    });
    
    process.stdin.on('end', function () {
        var records = parseRecords(format, data);
        process.stdout.write(output(records));
        //process.exit(0);
    });
} else {
    console.log('Invalid format file');
    //process.exit(1);
}

function parseRecords(formatInput,dataInput){
    var output = [];
    var lines = dataInput.split('\n');
    
    lines.forEach(function(line) {
        formatInput.recordFormats
            .filter(function(recordFormat,i){ return new RegExp (recordFormat.pattern).test(line); })
            .forEach(function(recordFormat,i){
            var r = new RegExp (recordFormat.pattern);
            if(r.test(line)){
                var record = {};
                recordFormat.fields.forEach(function(field,j){
                    var start = parseInt(field.start);
                    record[field.name] = line.substring(start, start + parseInt(field.length)).trim();
                });
                output.push(record);
            }
        });
    });
    return output;
}

