import { useEffect } from "react";
import { loadModules } from "esri-loader";

const BaseModuleMap = () => {
    useEffect(() => {
        loadModules([
            "esri/config",
            "esri/Map",
            "esri/portal/Portal",
            "esri/views/MapView",
            "esri/widgets/BasemapGallery",
            "esri/widgets/Search",
            "esri/widgets/Expand",
        ])
        .then(([
            esriConfig,
            Map,
            Portal,
            MapView,
            BasemapGallery,
            Search,
            Expand,
        ]) => {
            // console.log("props -> ", props);

            // If you define the Portal URL in esriConfig, the
            // basemapGallery widget can determine which basemaps
            // to use.
            esriConfig.portalUrl = "https://jsapi.maps.arcgis.com";
            
            /************ Works  */
            // esriConfig.portalUrl = "https://jsapi.maps.arcgis.com";
            
            /************ Doesn't Work ************/
            // esriConfig.portalUrl = "https://portal.geo.nga.mil/"
            // esriConfig.portalUrl = 'https://maps.gvs.nga.mil' 
            // esriConfig.portalUrl = "https://maps.gvs.nga.mil/arcgis/rest/services/Basemap";
            // esriConfig.portalUrl = "https://maps.gvs.nga.mil/arcgis";
            // esriConfig.portalUrl = "https://home.gvs.nga.mil/home";
            // esriConfig.portalUrl = "https://map.nga.mil";
            // esriConfig.portalUrl = "https://portal.geo.nga.mil/portal/apps/Minimalist/index.html?webmap=5fc50384a3b842ecb5b8275ca36c867c";
            // esriConfig.apiKey = '5fc50384a3b842ecb5b8275ca36c867c';
            
            /************ Gives a Cert Error because of a login page */
            // esriConfig.portalUrl = "http://map.nga.ic.gov/";
            
            // Intialize a portal instance and load it
            const portal = new Portal();
            portal
                .load()
                .then(() => {
                    // A portal can be configured to use Vector Basemaps
                    // by default or not.
                    const basemap = portal.useVectorBasemaps
                        ? portal.defaultVectorBasemap
                        : portal.defaultBasemap;

                    console.log("portal -> ", portal);
                    console.log("basemap -> ", basemap);

                    const map = new Map({
                        basemap: basemap
                    });
                    const view = new MapView({
                        container: "viewDiv",
                        map: map,
                        center: [-89.924450, 38.578690],
                        scale: 10000
                    });
                    // The BasemapGallery will use the basemaps
                    // configured by the Portal URL defined in esriConfig.portalUrl
                    const basemapGallery = new BasemapGallery({
                        view: view
                    });
                    const bgExpand = new Expand({
                        view: view,
                        content: basemapGallery
                    });
                    view.ui.add(bgExpand, "bottom-left");

                    // The Search widget will also use the locators
                    // configured by the Portal URL defined in esriConfig.portalUrl
                    const search = new Search({ view: view });
                    view.ui.add(search, "top-right");
                })
                .catch((error: any) => {
                    console.error(`Error loading the Portal ${esriConfig.portalUrl} -> `, error);
                });

        })
        .catch((error: any) => {
            console.error("Error loading the Modules -> ", error);
        });

        return function cleanup() {}

    }, []);

    return null;
};

export default BaseModuleMap;

