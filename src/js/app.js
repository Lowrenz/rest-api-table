/*jshint esversion: 6 */
"use strict";

document.onreadystatechange = () => {
    if (document.readyState == "interactive") {
        const requestOptions = {
            method: "GET",
            mode: "cors",
            //mode: "no-cors",
            cache: "no-cache",
            //credentials: "include",
            headers: {
                "Content-Type": "application/json;odata=verbose"
            }
        }

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

        const showData = () => {
            let provincie = document.getElementById('provincie').value;
            let lijn = document.getElementById("lijn").value;

            // Send parameters to fetchData
            if ((typeof provincie !== 'undefined' && provincie !== null) && (typeof lijn !== 'undefined' && lijn !== null && lijn.length > 0)) {
                let url = `https://verstoringendelijn.firebaseio.com/${provincie - 1}/${provincie}.json`;
                document.querySelector(".loader").classList = "loader visible";
                fetchData(url, requestOptions);
            } else {
                //form invalid, temp solution:
                alert("Gelieve een provincie en lijn mee te geven.")
            }
        }

        const initTable = (tableData) => {
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
                    if (data.Rijdt == "Rijdt") {
                        row.getElement().style.backgroundColor = "#d4edda";
                    } else if (data.Rijdt == "Rijdt niet") {
                        row.getElement().style.backgroundColor = "#f8d7da";
                    } else if (data.Rijdt == "Info volgt") {
                        row.getElement().style.backgroundColor = "#FFFFFF";
                    } else {
                        row.getElement().style.backgroundColor = "#fff3cd";
                    }
                },
                data: tableData,
                // groupBy: [(tableData) => {
                //     switch (tableData.Provincie) {
                //         case "1":
                //             return "Antwerpen";
                //             break;
                //         case "2":
                //             return "Oost-Vlaanderen";
                //             break;
                //         case "3":
                //             return "Vlaams-Brabant";
                //             break;
                //         case "4":
                //             return "Limburg";
                //             break;
                //         case "5":
                //             return "West-Vlaanderen";
                //             break;        
                //         default:
                //             return "Andere";
                //             break;
                //     }
                // }, (tableData) => {
                //     return `${tableData.Route} - ${tableData.RouteOmschrijving}`
                // }],
                groupToggleElement: "header",
                initialSort: [{
                        column: "StartR",
                        dir: "asc"
                    },
                    {
                        column: "VertrekPlaats",
                        dir: "asc"
                    }
                ],
                placeholder: "Geen informatie beschikbaar. Verfijn je zoekopdracht of probeer het later eens opnieuw.",
                tooltips: true,
                tooltipGenerationMode: "hover",
                columns: [{
                        title: "Vertrek",
                        field: "StartR",
                        sorter: "time",
                        minWidth: 120,
                        columnVertAlign: "middle",
                        align: "center",
                        //headerFilter:true
                    },
                    {
                        title: "Aankomst",
                        field: "EindR",
                        sorter: "time",
                        minWidth: 140,
                        columnVertAlign: "middle",
                        align: "center",
                        //headerFilter:true
                    },
                    {
                        title: "Beginhalte",
                        field: "VertrekPlaats",
                        sorter: "string",
                        minWidth: 280,
                        columnVertAlign: "middle",
                        variableHeight: true,
                        tooltip: true,
                        //headerFilter:true
                    },
                    {
                        title: "Eindhalte",
                        field: "AankomstPlaats",
                        sorter: "string",
                        minWidth: 280,
                        columnVertAlign: "middle",
                        variableHeight: true,
                        tooltip: true,
                        //headerFilter:true
                    },
                    {
                        title: "Status",
                        field: "Rijdt",
                        align: "center",
                        sorter: "string",
                        minWidth: 80,
                        columnVertAlign: "middle",
                        //headerFilter:true
                    },
                ],
            });

            window.addEventListener('resize', () => {
                table.redraw();
            });

            document.querySelector(".loader").classList = "loader hidden";
        }

        document.getElementById("btn-filter").addEventListener('click', () => {
            showData();
        });
    }
}