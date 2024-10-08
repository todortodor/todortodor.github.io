window.addEventListener('DOMContentLoaded', async () => {
    const { nodes, edges } = await (await fetch('graph.json')).json();
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
                'background-color': "mapData(AllWorldUS10totalHatColor, 0, 1, red, green)",
                'color': 'white',
                'label': 'data(id)',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-background-opacity': 0,
                'text-background-padding': 4,
                "width": "mapData(AllWorldUS10totalValueSize, 0, 1, 20, 200)",
                "height": "mapData(AllWorldUS10totalValueSize, 0, 1, 20, 200)",
                'opacity': 0.9,
                'font-size': "mapData(AllWorldUS10totalValueSize, 0, 1, 10, 50)",
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
                'line-color': "mapData(AllWorldUS10totalHatColor, 0, 1, red, green)",
                'width': "mapData(AllWorldUS10totalValueSize, 0, 1, 0, 20)",
                'curve-style': 'unbundled-bezier',
                'opacity': "mapData(AllWorldUS10totalValueSize, 0, 1, 0.5, 1)",
                'target-arrow-shape': 'triangle-backcurve',
                'source-arrow-shape': 'circle',
                'target-arrow-color': "mapData(AllWorldUS10totalHatColor, 0, 1, red, green)",
                'source-arrow-color': "mapData(AllWorldUS10totalHatColor, 0, 1, red, green)",
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
        // autoungrabify: true,
        // autounselectify: true,
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
            return (0.5 / Math.max(edge.data().AllWorldUS10totalShareOutputSource, edge.data().AllWorldUS10totalShareInputTarget)) ** 4
        },
        nodeOverlap: 1e9,
        animationThreshold: 400,
        refresh: 50,
    })

    cyMap = cy.mapboxgl({
        accessToken: 'pk.eyJ1IjoidG9kb3J0b2RvciIsImEiOiJja3pyNjY3aXcwN2N4MnJ0OWV0dTJ6eHliIn0.SczAOEiQ1VlazE-oYGOFLQ', // cytoscape-mapbox-gl token
        // style: 'mapbox://styles/mapbox/streets-v11'
        style: {
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
        }
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
        if (basemap === 'raster') {
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
        } else if (basemap === 'vector') {
            cyMap.map.setStyle('mapbox://styles/mapbox/streets-v11', { diff: false });
        }
    }
    document.getElementById('basemap').addEventListener('change', updateBasemap);

    cy.nodes().qtip({
        content: function(){
//	        let sector = document.getElementById('sector').value;
//	        let scenario = document.getElementById('Scenario').value;
//	        let typeOfTrade = document.getElementById('TradeOf').value;
         return `${this.id()} : Gross output = ${this.data()[document.getElementById('TradeOf').value + document.getElementById('Scenario').value + document.getElementById('sector').value + 'Value']}Mio.\$ <br> Gross output change = ${this.data()[document.getElementById('TradeOf').value + document.getElementById('Scenario').value + document.getElementById('sector').value + 'Hat']}%`
         },
        position: {
            my: 'top center',
            at: 'bottom center'
        },
        style: {
            classes: 'qtip-bootstrap',
            tip: {
                width: 10,
                height: 8
            }
        }
    });

    const switchMapOrNetwork = () => {
        const mapOrNetwork = document.getElementById('mapOrNetwork').value;
        console.log(mapOrNetwork)
        if (mapOrNetwork === 'map') {
            cyMap = cy.mapboxgl({
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
            cy.style().fromJson(initial_style).update()
            const changeSelected = () => {
                const $select = document.querySelector('#sector');
                $select.value = 'total'
            };
            changeSelected();
            newLayout.run();
            cy.fit();
        }
    }
    document.getElementById('mapOrNetwork').addEventListener('change', switchMapOrNetwork);

    const changeSectorStyle = () => {
        const sector = document.getElementById('sector').value;
        const scenario = document.getElementById('Scenario').value;
        const typeOfTrade = document.getElementById('TradeOf').value;
        cy.style().fromJson([
            {
                selector: 'node',
                style: {
                    'border-color': '#ffffff',
                    'border-width': 2,
                    'background-color': "mapData(" + typeOfTrade+scenario+sector + "HatColor, 0, 1, red, green)",
                    'color': 'white',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-background-opacity': 0,
                    'text-background-padding': 4,
                    "width": "mapData(" + typeOfTrade+scenario+sector + "ValueSize, 0, 1, 20, 200)",
                    "height": "mapData(" + typeOfTrade+scenario+sector + "ValueSize, 0, 1, 20, 200)",
                    // 'opacity': 0.8,
                    'font-size': "mapData(" + typeOfTrade+scenario+sector + "ValueSize, 0, 1, 10, 50)",
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
                    'line-color': "mapData(" + typeOfTrade+scenario+sector + "HatColor, 0, 1, red, green)",
                    'width': "mapData(" + typeOfTrade+scenario+sector + "ValueSize, 0, 1, 0, 20)",
                    'curve-style': 'unbundled-bezier',
                    'opacity': "mapData(" + typeOfTrade+scenario+sector + "ValueSize, 0, 1, 0.5, 1)",
                    'target-arrow-shape': 'triangle-backcurve',
                    'source-arrow-shape': 'circle',
                    'target-arrow-color': "mapData(" + typeOfTrade+scenario+sector + "HatColor, 0, 1, red, green)",
                    'source-arrow-color': "mapData(" + typeOfTrade+scenario+sector + "HatColor, 0, 1, red, green)",
                    'overlay-opacity': 0,
                }
            },
        ]).update();
    }
    document.getElementById('sector').addEventListener('change', changeSectorStyle);
    document.getElementById('Scenario').addEventListener('change', changeSectorStyle);
    document.getElementById('TradeOf').addEventListener('change', changeSectorStyle);

    const resetView = () => {
        let state = document.getElementById('mapOrNetwork').value
          if (state === 'network') {
            cy.fit();
          } else {
            cyMap.fit(undefined, { padding: 50 });
          }
        };
    document.getElementById('resetview').addEventListener('click', resetView);

    const exportImage = () => {
        const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];
          
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              const slice = byteCharacters.slice(offset, offset + sliceSize);
          
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
          
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
          
            const blob = new Blob(byteArrays, {type: contentType});
            return blob;
          }
        let state = document.getElementById('mapOrNetwork').value
        let sector = document.getElementById('sector').value
        let scenario = document.getElementById('Scenario').value;
        let typeOfTrade = document.getElementById('TradeOf').value;
        var b64key = 'base64,';
        var b64 = cy.png({bg: true}).substring( cy.png().indexOf(b64key) + b64key.length );
        var imgBlob = b64toBlob( b64, 'image/png' );
        
        saveAs( imgBlob, `${state}_${typeOfTrade}_${scenario}_${sector}.png` );
        // var png64 = cy.png();

        // // put the png data in an img tag
        // document.querySelector('#png-eg').setAttribute('src', png64);
    }
    document.getElementById('exportimage').addEventListener('click', exportImage);
})

