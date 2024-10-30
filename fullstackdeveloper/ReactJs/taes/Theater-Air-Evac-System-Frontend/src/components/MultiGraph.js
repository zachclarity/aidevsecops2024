import React from 'react'

import Plot from 'react-plotly.js'


function MultiGraph(props) {
    const {data} = props

    return (
        <Plot
            data={data.map(datum => {
                return {
                    ...datum,
                    y: datum.y.map(n => Number(n)),
                    type: "scatter",
                    mode: "lines"
                }
            })}
            layout={{
                title: {
                    text: "Mega Plot",
                    font: {
                        color: "white"
                    }
                },
                font: {
                    color: "white"
                },
                autosize: true,
                paper_bgcolor: '#121212',
                plot_bgcolor: '#121212',
                yaxis: {
                    range: props.upperLimit ? [0, props.upperLimit] : undefined
                }
            }}
            style={{
                width: props.width || "100%",
                height: 350
            }}
        />
    )
}

export default MultiGraph