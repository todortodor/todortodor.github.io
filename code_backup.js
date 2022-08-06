// document.getElementById('reset-view')
// import coseBilkent from 'cytoscape-cose-bilkent';
window.addEventListener('DOMContentLoaded', async () => {
    const { nodes, edges } = await (await fetch('data/graph.json')).json();
    const elements = [
        ...nodes.map(node => ({ group: 'nodes', data: node })),
        ...edges.map(edge => ({ group: 'edges', data: edge })),
        //   { group: 'nodes', data: { id: 'dummy' } },
        //   { group: 'edges', data: { source: 'dummy', target: 'Makov' } },
    ];

    const cy = cytoscape({
        container: document.getElementById('graph'),
        elements,
        //   layout: {
        //     name: 'cose',
        //     animate: 'end',
        //     // nodeRepulsion: 1e6,
        //     // nestingFactor: 0.4,
        //     // randomize: true,
        //     numIter: 1000000,
        //     coolingFactor: 0.99,
        //     gravity: 1,
        //     initialTemp: 1000,
        //     // edgeElasticity:1,
        //     // minTemp: 1e-2,
        //     idealEdgeLength: function (edge) {
        //         // Default is: 10
        //         return 50/Math.exp(Math.max(edge.data().shareOutputSource,edge.data().shareInputTarget))
        //         // return edge.data().value/(edge.data().shareOutputSource*edge.data().shareInputTarget)
        //       },
        //     edgeElasticity: function (edge) {
        //     // Default is: 100
        //     // return 1/(edge.data().shareOutputSource+edge.data().shareInputTarget)
        //     return (10/Math.max(edge.data().shareOutputSource,edge.data().shareInputTarget))**4
        //     // return (edge.data().value)**2
        //     },
        //     // nodeOverlap: 1e9,
        //     // componentSpacing: 80,
        //     // nodeRepulsion: function (node) {
        //     //     // return ((edge.data().shareOutputSource+edge.data().shareInputTarget))*10
        //     //     // return (1000/node.data().value)**2
        //     //     // return (node.data().value)**2
        //     //     },
        //   },
        layout: { name: 'grid' },
        style: [
            {
                selector: 'node',
                style: {
                    'border-color': '#ffffff',
                    'border-width': 2,
                    'background-color': '#1f77b4',
                    // 'background-image': 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1216 0q185 0 316.5 93.5t131.5 226.5v896q0 130-125.5 222t-305.5 97l213 202q16 15 8 35t-30 20h-1056q-22 0-30-20t8-35l213-202q-180-5-305.5-97t-125.5-222v-896q0-133 131.5-226.5t316.5-93.5h640zm-320 1344q80 0 136-56t56-136-56-136-136-56-136 56-56 136 56 136 136 56zm576-576v-512h-1152v512h1152z" fill="#fff"/></svg>`),
                    // 'background-width': '100%',
                    // 'background-height': '60%',
                    'color': '#333333',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    // 'text-margin-y': 6,
                    // 'text-background-color': '#ffffff',
                    'text-background-opacity': 0,
                    'text-background-padding': 4,
                    "width": "mapData(value, 0, 35896388, 20, 200)",
                    "height": "mapData(value, 0, 35896388, 20, 200)",
                    'opacity': 0.8,
                    'font-size': "mapData(value, 0, 35896388, 10, 50)",
                }
            },
            {
                selector: 'node.hover',
                style: {
                    'border-color': '#000000',
                    'text-background-color': '#eeeeee',
                    'text-background-opacity': 1
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'border-color': '#ff0000',
                    'border-width': 6,
                    'border-opacity': 0.5
                }
            },
            {
                selector: 'edge',
                style: {
                    'line-color': "mapData(hat, 0.74, 1.136, red, green)",
                    'width': "mapData(value, 0, 229424, 0, 20)",
                    'curve-style': 'unbundled-bezier',
                    // 'line-fill':'linear-gradient',
                    'opacity': "mapData(value, 0, 229424, 0.2, 1)",
                    'target-arrow-shape': 'triangle-backcurve',
                    'source-arrow-shape': 'circle',
                    'target-arrow-color': "mapData(hat, 0.74, 1.136, red, green)",
                    'source-arrow-color': "mapData(hat, 0.74, 1.136, red, green)",
                    // 'mid-target-arrow-shape': 'triangle',
                    // 'mid-target-arrow-color': "mapData(hat, 0.74, 1.136, red, green)",
                    // 'target-arrow-fill': 'filled',
                }
            },
            {
                selector: 'edge.hover',
                style: {
                    'line-color': '#999999'
                }
            },
            // edgehandles
            {
                selector: '.eh-handle',
                style: {
                    'background-color': 'red',
                    'background-image': [],
                    'width': 12,
                    'height': 12,
                    'shape': 'ellipse',
                    'overlay-opacity': 0,
                    'border-width': 12,
                    'border-opacity': 0,
                    'label': ''
                }
            },
            {
                selector: '.eh-hover',
                style: {
                    'background-color': 'red'
                }
            },
            {
                selector: '.eh-source',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },
            {
                selector: '.eh-target',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },
            {
                selector: '.eh-preview, .eh-ghost-edge',
                style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                }
            },
            {
                selector: '.eh-ghost-edge.eh-preview-active',
                style: {
                    'opacity': 0
                }
            }
        ]
    });
    cy.panzoom();
    // cy.edgehandles();
    // cy.lassoSelectionEnabled(true);

    cy.on('mouseover', '*', e => {
        e.target.addClass('hover');
        e.cy.container().style.cursor = 'pointer';
    });
    cy.on('mouseout', '*', e => {
        e.target.removeClass('hover');
        e.cy.container().style.cursor = 'default';
    });

    let cyMap;
    const toggleMap = () => {
        if (!cyMap) {
            cy.panzoom('destroy');

            cyMap = cy.mapboxgl({
                //   accessToken: 'pk.eyJ1IjoiemFramFuIiwiYSI6ImNrZjVjeXVmYjBseDQyem1kcHU3d3FxdHQifQ.NxZLZbjHrnz8v1rNUwW3YA', // cytoscape-mapbox-gl token
                accessToken: 'pk.eyJ1IjoidG9kb3J0b2RvciIsImEiOiJja3pyNjY3aXcwN2N4MnJ0OWV0dTJ6eHliIn0.SczAOEiQ1VlazE-oYGOFLQ', // cytoscape-mapbox-gl token
                style: 'mapbox://styles/mapbox/streets-v11'
            }, {
                getPosition: (node) => {
                    return [node.data('lng'), node.data('lat')];
                },
                setPosition: (node, lngLat) => {
                    node.data('lng', lngLat.lng);
                    node.data('lat', lngLat.lat);
                    console.log(node.id(), lngLat);
                },
                animate: true,
                animationDuration: 1,
            });
            cyMap.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

            document.getElementById('basemap').classList.remove('hide');
        } else {
            cyMap.destroy();
            cyMap = undefined;
            cy.panzoom();
            var layout = cy.layout({
                name: 'cose',
                animate: true,
                // nodeRepulsion: 1e6,
                // nestingFactor: 0.4,
                // randomize: true,
                numIter: 1000000,
                coolingFactor: 0.999,
                gravity: 1,
                initialTemp: 100,
                // edgeElasticity:1,
                minTemp: 1e-2,
                idealEdgeLength: function (edge) {
                    // Default is: 10
                    return 50 / Math.exp(Math.max(edge.data().shareOutputSource, edge.data().shareInputTarget))
                    // return edge.data().value/(edge.data().shareOutputSource*edge.data().shareInputTarget)
                },
                edgeElasticity: function (edge) {
                    // Default is: 100
                    // return 1/(edge.data().shareOutputSource+edge.data().shareInputTarget)
                    return (10 / Math.max(edge.data().shareOutputSource, edge.data().shareInputTarget)) ** 4
                    // return (edge.data().value)**2
                },
                // nodeOverlap: 1e9,
                // componentSpacing: 80,
                // nodeRepulsion: function (node) {
                //     // return ((edge.data().shareOutputSource+edge.data().shareInputTarget))*10
                //     // return (1000/node.data().value)**2
                //     // return (node.data().value)**2
                //     },
            },
            );
            layout.run();
            document.getElementById('basemap').classList.add('hide');
        }
    };
    document.getElementById('mode').addEventListener('click', toggleMap);
    cy.ready(() => toggleMap());

    const updateBasemap = () => {
        const basemap = document.getElementById('basemap').value;
        if (basemap === 'vector') {
            cyMap.map.setStyle('mapbox://styles/mapbox/streets-v11', { diff: false });
        } else if (basemap === 'raster') {
            cyMap.map.setStyle({
                'version': 8,
                'sources': {
                    'raster-tiles': {
                        'type': 'raster',
                        'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        'tileSize': 256,
                        //   'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                'layers': [
                    {
                        'id': 'raster-tiles',
                        'type': 'raster',
                        'source': 'raster-tiles',
                        'minzoom': 0,
                        'maxzoom': 19
                    }
                ]
            }, { diff: false });
        }
    }
    document.getElementById('basemap').addEventListener('change', updateBasemap);

    const minLng = cy.nodes().reduce((acc, node) => Math.min(acc, node.data('lng') || acc), Infinity);
    const maxLng = cy.nodes().reduce((acc, node) => Math.max(acc, node.data('lng') || acc), -Infinity);
    const minLat = cy.nodes().reduce((acc, node) => Math.min(acc, node.data('lat') || acc), Infinity);
    const maxLat = cy.nodes().reduce((acc, node) => Math.max(acc, node.data('lat') || acc), -Infinity);
    const minX = cy.nodes().reduce((acc, node) => Math.min(acc, node.position('x')), Infinity);
    const maxX = cy.nodes().reduce((acc, node) => Math.max(acc, node.position('x')), -Infinity);
    const minY = cy.nodes().reduce((acc, node) => Math.min(acc, node.position('y')), Infinity);
    const maxY = cy.nodes().reduce((acc, node) => Math.max(acc, node.position('y')), -Infinity);
    //     const addNode = () => {
    //       const randomId = Math.floor(Math.random() * 10e12).toString(36);
    //       const randomLng = minLng + Math.random() * (maxLng - minLng);
    //       const randomLat = minLat + Math.random() * (maxLat - minLat);
    //       const randomX = minX + Math.random() * (maxX - minX);
    //       const randomY = minY + Math.random() * (maxY - minY);

    //       cy.add({
    //         group: 'nodes',
    //         data: { id: randomId, lng: randomLng, lat: randomLat },
    //         position: { x: randomX, y: randomY }
    //       });
    //     //   cy.add({
    //     //     group: 'edges',
    //     //     data: { source: randomId, target: 'Makov' }
    //     //   });
    //     };
    //     // document.getElementById('add-node').addEventListener('click', addNode);

    //     // const resetView = () => {
    //     //   if (!cyMap) {
    //     //     cy.fit(undefined, 50);
    //     //   } else {
    //     //     cyMap.fit(undefined, { padding: 50 });
    //     //   }
    //     // };
    //     // document.getElementById('reset-view').addEventListener('click', resetView);
})

