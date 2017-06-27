import ol from 'openlayers';

import ajax from './ajax';

const styleFactory = function(feature) {
    const styleFunction = {
        Point (feature) {
            const style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(170, 170, 170, 0.5)',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.5)'
                })
            });
            return style;
        },

        Polygon (feature) {
            const style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(170, 170, 170, 0.5)',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.5)'
                })
            });
            return style;
        }
    }
    return styleFunction[feature.type](feature)
}

const onMapClick = function(ev) {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    });
}
const map = new ol.Map({
    target: 'map',
    renderer: 'canvas',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        new ol.layer.Vector()
    ],
    controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
    view: new ol.View({
        center: ol.proj.transform([139.7800, 35.6800], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12,
        maxzoom: 20,
        minzoom: 8
    })
});
map.addControl(new ol.control.ZoomSlider());
map.on('click', onMapClick);
function sourceHandler(ev) {
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = function(ev) {
        const vectorSource = new ol.source.Vector({
            features: [],
            loader: function(extent, resolution, projection) {
                const url = window.location.href + 'data';
                ajax.post(url, reader.result, function(response) {
                    const features = (new ol.format.GeoJSON()).readFeatures(response, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                    vectorSource.addFeatures(features);
                });
            },
            strategy: ol.loadingstrategy.all
        });
        const vectorLayer = map.getLayers().getArray()[1]
        vectorLayer.setSource(vectorSource);
        vectorLayer.setStyle(styleFactory);
    };
    reader.readAsText(file, 'UTF-8');
    ev.target.value = '';
}

const bundle = function(elm) {
    elm.onchange = sourceHandler;
}

export default bundle;
