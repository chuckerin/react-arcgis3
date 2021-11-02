import { useEffect } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search"
import esriConfig from "@arcgis/core/config";
import Portal from "@arcgis/core/portal/Portal";

const BaseCoreMap = (props: any) => {
    
    useEffect(() => {
        const pathName = window.location.pathname;
        const portalUrl = `http:/${pathName}`;
        
        esriConfig.portalUrl = portalUrl;
        if (esriConfig.request && esriConfig.request.trustedServers) {
            esriConfig.request.trustedServers.push("https://portal.geo.nga.mil");
        }

        // Intialize a portal instance and load it
        const portal = new Portal();
        portal
            .load()
            .then(() => {
                const basemap = portal.useVectorBasemaps
                    ? portal.defaultVectorBasemap   // Topo
                    : portal.defaultBasemap;        // World Street View

                const map = new Map({ basemap });

                const view = new MapView({
                    container: "viewDiv",
                    map,
                    center: [-89.924450, 38.578690],
                    scale: 10000
                });

                // The BasemapGallery will use the basemaps
                // configured by the Portal URL defined in esriConfig.portalUrl
                const basemapGallery = new BasemapGallery({ view });
                const bgExpand = new Expand({
                    view,
                    content: basemapGallery
                });
                view.ui.add(bgExpand, "bottom-left");

                // The Search widget will also use the locators
                // configured by the Portal URL defined in esriConfig.portalUrl
                const search = new Search({ view });
                view.ui.add(search, "top-right");
            })
            .catch((error: any) => {
                console.error(`Error loading the Portal ${esriConfig.portalUrl} -> `, error);
            });
    }, []);

    return null;
}

export default BaseCoreMap;