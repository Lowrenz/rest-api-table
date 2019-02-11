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
                    initTable(tableData.entry)
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
                responsiveLayoutCollapseUseFormatters: false,
                groupStartOpen: false,
                rowFormatter: (row) => {
                    let data = row.getData();
                    if(data.content.properties.Rijdt == "Rijdt"){
                        row.getElement().style.backgroundColor = "#d4edda";
                    }else if(data.content.properties.Rijdt == "Rijdt niet"){
                        row.getElement().style.backgroundColor = "#f8d7da";
                    }else if(data.content.properties.Rijdt == "Info volgt"){
                        row.getElement().style.backgroundColor = "#FFFFFF";
                    }else{
                        row.getElement().style.backgroundColor = "#fff3cd";
                    }
                },
                data: tableData,
                // groupBy: ["content.properties.Provincie", (tableData) => {
                //     return `${tableData.content.properties.Route} - ${tableData.content.properties.RouteOmschrijving}`
                // }],
                groupBy: (tableData) => {
                    return `${tableData.content.properties.Route} - ${tableData.content.properties.RouteOmschrijving}`
                },
                groupToggleElement: "header",
                initialSort: [{
                        column: "content.properties.StartRit",
                        dir: "asc"
                    },
                    {
                        column: "content.properties.VertrekPlaats",
                        dir: "asc"
                    }
                ],
                placeholder: "Geen informatie beschikbaar. Verfijn je zoekopdracht of probeer het later eens opnieuw.",
                tooltips: true,
                tooltipGenerationMode: "hover",
                columns: [{
                        title: "Vertrek",
                        field: "content.properties.StartRit",
                        sorter: "time",
                        minWidth: 120,
                        columnVertAlign: "middle",
                        align: "center",
                        headerFilter:true
                    },
                    {
                        title: "Aankomst",
                        field: "content.properties.EindeRit",
                        sorter: "time",
                        minWidth: 140,
                        columnVertAlign: "middle",
                        align: "center",
                        headerFilter:true
                    },
                    {
                        title: "Beginhalte",
                        field: "content.properties.VertrekPlaats",
                        sorter: "string",
                        minWidth: 280,
                        columnVertAlign: "middle",
                        variableHeight: true,
                        tooltip: true,
                        headerFilter:true
                    },
                    {
                        title: "Eindhalte",
                        field: "content.properties.AankomstPlaats",
                        sorter: "string",
                        minWidth: 280,
                        columnVertAlign: "middle",
                        variableHeight: true,
                        tooltip: true,
                        headerFilter:true
                    },
                    {
                        title: "Status",
                        field: "content.properties.Rijdt",
                        align: "center",
                        sorter: "string",
                        minWidth: 80,
                        columnVertAlign: "middle",
                        headerFilter:true
                    },
                ],
            });

            window.addEventListener('resize', () => {
                table.redraw();
            });
        }

        let requestOptions = {
            method: "GET",
            mode: "cors",
            //mode: "no-cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;odata=verbose"
            }
        }

        // URL
        // http://samenwerken/afd/ex01/_api/web/lists/getbytitle('StakingsComm')/items

        fetchData("https://lowrenz.github.io/data.json", requestOptions);
        //fetchData("dummy.json", requestOptions);
    }
}