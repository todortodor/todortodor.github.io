window.addEventListener('DOMContentLoaded', async () => {
    const { nodes, edges } = await (await fetch('data/graph.json')).json();
    const elements = [
        ...nodes.map(node => ({ group: 'nodes', data: node, position: { x: node.lng, y: -node.lat } })),
        ...edges.map(edge => ({ group: 'edges', data: edge })),
    ];
    let initial_style = [
        {
            selector: 'node',
            style: {
                'border-color': '#ffffff',
                'border-width': 2,
                'background-color': "mapData(totalHatColor, 0, 1, red, green)",
                'color': '#333333',
                'label': 'data(id)',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-background-opacity': 0,
                'text-background-padding': 4,
                "width": "mapData(totalValue, 0, 1, 20, 200)",
                "height": "mapData(totalValue, 0, 1, 20, 200)",
                // 'opacity': 0.8,
                'font-size': "mapData(totalValue, 0, 1, 10, 50)",
                'overlay-opacity': 0,
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
                'line-color': "mapData(totalHatColor, 0, 1, red, green)",
                'width': "mapData(totalValue, 0, 1, 0, 20)",
                'curve-style': 'unbundled-bezier',
                'opacity': "mapData(totalValue, 0, 1, 0.5, 1)",
                'target-arrow-shape': 'triangle-backcurve',
                'source-arrow-shape': 'circle',
                'target-arrow-color': "mapData(totalHatColor, 0, 1, red, green)",
                'source-arrow-color': "mapData(totalHatColor, 0, 1, red, green)",
                'overlay-opacity': 0,
            }
        },
    ]

    const cy = cytoscape({
        container: document.getElementById('graph'),
        elements,
        layout: {
            name: 'preset',
            zoom: 0,
        },
        style: initial_style,
        autoungrabify: true,
        autounselectify: true,
        // motionBlur: true,
    });

    let newLayout = cy.layout({
        name: 'cose',
        animate: true,
        randomize: false,
        numIter: 1000,
        coolingFactor: 0.99,
        gravity: 10,
        initialTemp: 1000,
        minTemp: 1,
        edgeElasticity: function (edge) {
            return (0.5/Math.max(edge.data().totalShareOutputSource, edge.data().totalShareInputTarget)) ** 4
        },
        nodeOverlap: 1e9,
        animationThreshold: 400,
        refresh: 50,
        boundingBox: { x1:0, y1:0, w:1000, h:1000 },
    })

    cyMap  = cy.mapboxgl({
        accessToken: 'pk.eyJ1IjoidG9kb3J0b2RvciIsImEiOiJja3pyNjY3aXcwN2N4MnJ0OWV0dTJ6eHliIn0.SczAOEiQ1VlazE-oYGOFLQ', // cytoscape-mapbox-gl token
        style: 'mapbox://styles/mapbox/streets-v11'
    },
        {
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
    
    const switchMapOrNetwork = () => {
        const mapOrNetwork = document.getElementById('mapOrNetwork').value;
        console.log(mapOrNetwork)
        if (mapOrNetwork === 'map') {
            cyMap  = cy.mapboxgl({
        accessToken: 'pk.eyJ1IjoidG9kb3J0b2RvciIsImEiOiJja3pyNjY3aXcwN2N4MnJ0OWV0dTJ6eHliIn0.SczAOEiQ1VlazE-oYGOFLQ', // cytoscape-mapbox-gl token
        style: 'mapbox://styles/mapbox/streets-v11'
    },
        {
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

        } else if (mapOrNetwork === 'network') {
            cyMap.destroy();
            cy.fit();
            cy.style().fromJson(initial_style).update()
            const changeSelected = () => {
                const $select = document.querySelector('#sector');
                $select.value = 'total'
              };
            changeSelected()
            newLayout.run()
        }
    }
    document.getElementById('mapOrNetwork').addEventListener('change', switchMapOrNetwork);

    const changeSectorStyle = () => {
        const sector = document.getElementById('sector').value;
        cy.style().fromJson([
            {
                selector: 'node',
                style: {
                    'border-color': '#ffffff',
                    'border-width': 2,
                    'background-color': "mapData(" + sector + "HatColor, 0, 1, red, green)",
                    'color': '#333333',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-background-opacity': 0,
                    'text-background-padding': 4,
                    "width": "mapData(" + sector + "Value, 0, 1, 20, 200)",
                    "height": "mapData(" + sector + "Value, 0, 1, 20, 200)",
                    // 'opacity': 0.8,
                    'font-size': "mapData(" + sector + "Value, 0, 1, 10, 50)",
                    'overlay-opacity': 0,
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
                    'line-color': "mapData(" + sector + "HatColor, 0, 1, red, green)",
                    'width': "mapData(" + sector + "Value, 0, 1, 0, 20)",
                    'curve-style': 'unbundled-bezier',
                    'opacity': "mapData(" + sector + "Value, 0, 1, 0.5, 1)",
                    'target-arrow-shape': 'triangle-backcurve',
                    'source-arrow-shape': 'circle',
                    'target-arrow-color': "mapData(" + sector + "HatColor, 0, 1, red, green)",
                    'source-arrow-color': "mapData(" + sector + "HatColor, 0, 1, red, green)",
                    'overlay-opacity': 0,
                }
            },
        ]).update();
    }
    document.getElementById('sector').addEventListener('change', changeSectorStyle);

    const resetView = () => {
        cy.fit();
    };
    document.getElementById('reset-view').addEventListener('click', resetView);
})

