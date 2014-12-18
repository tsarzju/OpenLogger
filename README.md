OpenLogger
----------
## Introduction

OpenLogger is a tool that aim to help user to check large size of log file. This tool is built on `node-webkit`, which support building desktop applications using HTML and JavaScript.

## Install

1. Clone repo
```git clone https://github.com/tsarzju/OpenLogger.git```
2. Change directory to OpenLogger
```cd OpenLogger```
3. Run
```npm install```
4. Run the application(in Windows)
```nw .```

## Features
* Provide preview of large log file
* Highly configurable filter function on large log file
* Export filter result
* Easy to switch between different log styles

## How to use
1. The config.ini file define the meta-data used in the tool, including
 * previewSize : decide the least lines to show in preview function
 * blockSize : decide the block size that reading a file when performing filter function
 * styles : indicate the log format
    * name : style name
    * encoding : log encoding
    * dateFormat : the format of date
    * timeFormat : the format of time
    * lastFormat : the remaining format of time
    * adjustSize : in case there are other string in date/time value, like zone, this value provide adjustment
    * starter : indicate the line starter
    * separator : how to separat values in one log
    * filters : design the filter for the log
        * name : filter name, will be use in view
        * id : filter id, will be use in view
        * type : there are 3 types of filter: time, normal and message, they have different views
        * regex : regular expression for match this value

2. Prepare at least one style to use this tool, there are 2 default styles already in this config.ini, which are used in my company.
3. Use File->Import to load log file, the preview will show automatically
4. the filters are generated automatically based on the config.ini file, the filter function can be slow in the case that the fitlered result is large, so use the filter wisely because large result means nothing.
5. Use File->Export to export filtered result. The encoding of the export file will remain the same with the imported log file.

Here is a example of config.ini file
```json
{
    "previewSize":3000,
    "blockSize":300,
    "styles":[
        {
            "name":"CIM Log",
            "encoding":"SHIFT_JIS",
            "dateFormat":"y/mm/dd",
            "timeFormat":"HH:mm:ss",
            "lastFormat":":SSS",
            "adjustSize":-4,
            "starter":"^\\[([^\\[\\]]*)\\]",
            "separator":"\\s*",
            "filters":[
                {
                    "name":"Time",
                    "id":"time",
                    "type":"time",
                    "regex":"\\[([^\\[\\]]*)\\]"
                },
                {
                    "name":"Thread ID",
                    "id":"threadId",
                    "type":"normal",
                    "regex":"(\\S*)"
                },
                {
                    "name":"Producer",
                    "id":"producer",
                    "type":"normal",
                    "regex":"(\\S*)"
                },
                {
                    "name":"Type",
                    "id":"type",
                    "type":"normal",
                    "regex":"(\\S*)"
                },
                {
                    "name":"Message",
                    "id":"message",
                    "type":"message",
                    "regex":"([\\s\\S]*)"
                }
            ]
        },
        {
            "name":"Provisioning Log",
            "encoding":"SHIFT_JIS",
            "dateFormat":"yy-mm-dd",
            "timeFormat":"HH:mm:ss",
            "lastFormat":",SSS",
            "adjustSize":0,
            "starter":"^\\d\\d\\d\\d-\\d\\d-\\d\\d",
            "separator":"\\s*",
            "filters":[
                {
                    "name":"Time",
                    "id":"time",
                    "type":"time",
                    "regex":"(\\S*\\s\\S*)"
                },
                {
                    "name":"Type",
                    "id":"type",
                    "type":"normal",
                    "regex":"(\\S*)"
                },
                {
                    "name":"Message",
                    "id":"message",
                    "type":"message",
                    "regex":"([\\s\\S]*)"
                }
            ]
        }
    ]
}
```
