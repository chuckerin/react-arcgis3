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
        console.log('portalUrl -> ', portalUrl);
        
        esriConfig.portalUrl = portalUrl;

        /************************** Works ***********************************/
        // esriConfig.portalUrl = "https://jsapi.maps.arcgis.com";
        // esriConfig.portalUrl = 'https://nga.maps.arcgis.com';
        // esriConfig.portalUrl = '';
        
        /************ Doesn't Work ************/
        // esriConfig.portalUrl = "https://portal.geo.nga.mil/"
        // esriConfig.portalUrl = "https://portal.geo.nga.mil/portal/home/";
        // esriConfig.portalUrl = 'https://portal.geo.nga.mil/portal/home/index.html';
        // esriConfig.portalUrl = "https://portal.geo.nga.mil/portal/apps/Minimalist/index.html?webmap=5fc50384a3b842ecb5b8275ca36c867c";

        // esriConfig.portalUrl = 'https://maps.gvs.nga.mil' 
        // esriConfig.portalUrl = "https://maps.gvs.nga.mil/arcgis/rest/services/Basemap";
        // esriConfig.portalUrl = "https://maps.gvs.nga.mil/arcgis";
        // esriConfig.portalUrl = 'https://maps.gvs.nga.mil/arcgis/rest/services/Basemap/NGA_World_Imagery_2D/MapServer'; 

        // esriConfig.portalUrl = "https://home.gvs.nga.mil/home";
        // esriConfig.portalUrl = 'https://home.gvs.nga.mil/jsapi/arcgis';

        // esriConfig.portalUrl = "https://map.nga.mil";
        
        /************ Gives a Cert Error because of a login page */
        // esriConfig.portalUrl = "http://map.nga.ic.gov/";
        
        // const portal = new Portal({ url: "https://jsapi.maps.arcgis.com" });  // alternate way of setting the portal url
        // portal.authMode = "auto"; // prompts for user id/password
        
        // Intialize a portal instance and load it
        const portal = new Portal();
        portal
            .load()
            .then(() => {
                const basemap = portal.useVectorBasemaps
                    ? portal.defaultVectorBasemap
                    : portal.defaultBasemap;

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