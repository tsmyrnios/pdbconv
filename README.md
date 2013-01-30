#pdbconv

Protein Data Bank file conversion utility.

###Overview

This utility provides the ability to convert a Protein Data Bank file to JSON or CSV.

###Usage
    >pdbconv --help
    
    Usage: pdbconv [options]
    
    Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -v, --version <number>  Version of Protein Data Bank file
    -o, --output <path>     Output format (json|csv)

###Goodies

Included in the source is an HTML5 file *sample-csv.html* which utilizes the [D3 JavaScript Library](http://d3js.org/ "D3") for data visualization.

###PDB Support

At this time, only the "ATOM" records are supported. However, it is trivial to modify the format JSON file to include the other record types and will be updated in the future.