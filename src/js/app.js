/*jshint esversion: 6 */
"use strict";

document.onreadystatechange = () => {
    if (document.readyState == "interactive") {
        const fetchData = (url, requestOptions) => {
            fetch(url, requestOptions).then(
                (res) => {
                    return res.json()
                },
                (err) => {
                    console.log(err)
                }
            ).then(
                (tableData) => {
                    initTable(tableData)
                }
            )
        }

        const initTable = (tableData) => {
            console.log(tableData)
            //Build Tabulator
            let table = new Tabulator("#table-search", {
                height: "100%",
                layout: "fitColumns",
                virtualDom: true,
                //locale:true,
                responsiveLayout: "collapse",
                responsiveLayoutCollapseUseFormatters:false,
                data: tableData,
                // ajaxURL: "https://jsonplaceholder.typicode.com/todos",
                // ajaxProgressiveLoad: "scroll",
                // groupBy: (tableData) => {
                //     return data.lineNumber + " - " + tableData.name;
                // },
                groupBy: ["completed", "userId"],
                groupToggleElement:"header",
                // initialSort:[
                //     {column:"age", dir:"asc"}, //sort by this first
                //     {column:"height", dir:"desc"}, //then sort by this second
                // ],
                // paginationSize: 30,
                placeholder: "We zijn bezig met het verwerken van de data. Binnen een ogenblikje krijg je de status van de bussen te zien.",
                tooltips:true,
                tooltipGenerationMode:"hover",
                columns: [{
                        title: "User ID",
                        field: "userId",
                        sorter: "number",
                        minWidth: 40,
                        columnVertAlign: "middle",
                        align: "center"
                    },
                    {
                        title: "ID",
                        field: "id",
                        sorter: "number",
                        minWidth: 40,
                        columnVertAlign: "middle",
                        align: "center"
                    },
                    {
                        title: "Title",
                        field: "title",
                        sorter: "string",
                        minWidth: 320,
                        columnVertAlign: "middle",
                        variableHeight:true,
                        tooltip:true
                        // headerFilter:true
                    },
                    {
                        title: "Completed",
                        field: "completed",
                        align: "center",
                        formatter: "tickCross",
                        sorter: "boolean",
                        minWidth: 40,
                        columnVertAlign: "middle"
                    },
                ],
            });

            // table.setFilter([
            //     {field:"age", type:">", value:52}
            //     {field:"height", type:"<", value:142}
            //     {field:"name", type:"in", value:["steve", "bob", "jim"]}
            // ]);

            window.addEventListener('resize', () => {
                table.redraw();
            });
        }

        let requestOptions = {
            method: "GET",
            //mode: "cors",
            mode: "no-cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;odata=verbose"
            }
        }

        //fetchData("https://jsonplaceholder.typicode.com/todos", requestOptions);
        fetchData("http://samenwerken/afd/ex01/_api/web/lists/getbytitle('StakingsComm')/items", requestOptions);
        //fetchData("https://drive.google.com/file/d/18cLm0V1RSEskQDIzICaS3o1eDj-vMo_D/view?usp=sharing", requestOptions);
    }
}