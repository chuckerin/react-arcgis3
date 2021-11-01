import React from 'react';
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';
import BaseCoreMap from './base-core-map';

const Maps = () => {
    return (
        <BrowserRouter>
            <Switch>
                <div id="viewDiv" style={{ height: '100vh', width: '100vw' }}>
                    <Route path='/:id' children={<BaseCoreMap/>} />
                    <Route exact path='/'>
                        <h1>The page is to test ArcGIS Maps using the following Portals</h1>
                        <h3>(All Links will open a new tab)</h3>
                        <ul>No Credentials Needed<br/>(Both Work)
                            <li><Link to="/jsapi.maps.arcgis.com" target="_blank">jsapi.maps.arcgis.com</Link></li>
                            <li><Link to="/nga.maps.arcgis.com" target="_blank">nga.maps.arcgis.com</Link></li>
                        </ul>
                        <ul>Credentials Needed<br/>(Only First Works)
                            <li><Link to="/map.html" target="_blank">Map of the World</Link></li>
                            <li><Link to="/portal.geo.nga.mil/portal" target="_blank">portal.geo.nga.mil/portal</Link></li>
                            <li><Link to="/portal.geo.nga.mil" target="_blank">portal.geo.nga.mil</Link></li>
                            <li><Link to="/portal.geo.nga.mil/portal/home" target="_blank">portal.geo.nga.mil/portal/home</Link></li>
                            <li><Link to="/maps.gvs.nga.mil" target="_blank">maps.gvs.nga.mil</Link></li>
                            <li><Link to="/home.gvs.nga.mil/home" target="_blank">home.gvs.nga.mil/home</Link></li>
                            <li><Link to="/map.nga.mil" target="_blank">map.nga.mil</Link></li>
                            <li><Link to="/map.nga.ic.gov" target="_blank">map.nga.ic.gov</Link></li>
                        </ul>
                    </Route>
                </div>
            </Switch>
        </BrowserRouter>
    );
}

export default Maps;


// esriConfig.portalUrl = "https://portal.geo.nga.mil/"
// esriConfig.portalUrl = "https://portal.geo.nga.mil/portal"
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
