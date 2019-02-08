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

                    if(data.Rijdt == "Rijdt"){
                        row.getElement().css({
                            "background-color": "#d4edda"
                        });
                    }else if(data.Rijdt == "Rijdt niet"){
                        row.getElement().css({
                            "background-color": "#f8d7da"
                        });
                    }else if(data.Rijdt != "Info volgt"){
                        row.getElement().css({"opacity": 0});
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
                placeholder: "We zijn bezig met het verwerken van de data. Binnen een ogenblikje krijg je de status van de bussen te zien.",
                tooltips: true,
                tooltipGenerationMode: "hover",
                columns: [{
                        title: "Vertrek",
                        field: "content.properties.StartRit",
                        sorter: "time",
                        minWidth: 120,
                        columnVertAlign: "middle",
                        align: "center"
                    },
                    {
                        title: "Aankomst",
                        field: "content.properties.EindeRit",
                        sorter: "time",
                        minWidth: 140,
                        columnVertAlign: "middle",
                        align: "center"
                    },
                    {
                        title: "Beginhalte",
                        field: "content.properties.VertrekPlaats",
                        sorter: "string",
                        minWidth: 280,
                        columnVertAlign: "middle",
                        variableHeight: true,
                        tooltip: true
                        // headerFilter:true
                    },
                    {
                        title: "Eindhalte",
                        field: "content.properties.AankomstPlaats",
                        sorter: "string",
                        minWidth: 280,
                        columnVertAlign: "middle",
                        variableHeight: true,
                        tooltip: true
                        // headerFilter:true
                    },
                    {
                        title: "Status",
                        field: "content.properties.Rijdt",
                        align: "center",
                        sorter: "string",
                        minWidth: 80,
                        columnVertAlign: "middle"
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
        fetchData("https://lowrenz.github.io/data.json", requestOptions);
    }
}