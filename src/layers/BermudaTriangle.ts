import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpeLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import Color from "@arcgis/core/Color";
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

const BermudaTriangle = (props: any) => {

    const [graphic, setGraphic] = useState({});
    useEffect(() => {

        // Create a polygon geometry
        const polygon = {
            type: "polygon", // autocasts as new Polygon()
            rings: [
                [-64.78, 32.3],
                [-66.07, 18.45],
                [-80.21, 25.78],
                [-64.78, 32.3]
            ]
        };
        const polygon2 = new Polygon({
            rings: [[
                [-64.78, 32.3],
                [-66.07, 18.45],
                [-80.21, 25.78],
                [-64.78, 32.3]
            ]]                
        });

        // Create a symbol for rendering the graphic
        const fillSymbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [227, 139, 79, 0.2],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 1
            }
        };
        let color = new Color([227, 139, 79, 0.2]);
        let lineSymbol = new SimpleLineSymbol({
            color: [255, 255, 255],
            width: 1
        });
        const fillSymbol2 = new SimpleFillSymbol({
            color: color,
            outline: lineSymbol
        });

        // Add the geometry and symbol to a new graphic
        const graphic = new Graphic({
            geometry: polygon2,
            symbol: fillSymbol2
        });
        setGraphic(graphic);
        props.view.graphics.add(graphic);

        return function cleanup() {
            props.view.graphics.remove(graphic);
        };
    }, []);

    return null;

}

export default BermudaTriangle;