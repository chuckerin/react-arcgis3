/*
 * File: mow.js
 * Description: A script for downloading all the MoW dependencies and loading Map of the World.
 *
 * Classification: UNCLASSIFIED
 *
 * This software was developed by Lockheed Martin under the GVS Contract (number HM0476-16-C-0041) .
 *
 * This source module is not mobile specific code.
 */

/* global MoW, XMLHttpRequest */

/**
 * mow.js
 *
 * A script for downloading all the MoW dependencies and loading Map of
 * the World. The idea is that an API developer only needs to load one script
 * in their web page to satisfy all the requirements. The MoW application
 * is now:
 *
 *   <script type="text/javacript" src="mow.js"></script>
 *   <script type="text/javascript">
 *     MoW.ready(function() {
 *       var map = new MoW.Map({target: 'map-div'});
 *     })
 *   </script>
 */
 (function() {
    "use strict";
  
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }
  
    function assignValue(object, key, value) {
      var objVal = object[key];
      if (
        !(object.hasOwnProperty(key) && eq(objVal, value)) ||
        (value === undefined && !(key in object))
      ) {
        object[key] = value;
      }
    }
  
    function assignObj(obj, source) {
      if (!(obj && source)) {
        return;
      }
  
      // eslint-disable-next-line guard-for-in
      for (var key in source) {
        assignValue(obj, key, source[key]);
      }
    }
  
    function extend() {
      var args = arguments,
        i = 1;
      var obj = arguments[0] || {},
        source;
  
      while (i < args.length) {
        source = args[i];
        assignObj(obj, source);
        i++;
      }
      return obj;
    }
  
    function loadCss(cssUrl) {
      // Get HTML head element
      var head = document.getElementsByTagName("HEAD")[0];
  
      // Create new link Element
      var link = document.createElement("link");
  
      // set the attributes for link element
      link.rel = "stylesheet";
  
      link.type = "text/css";
  
      link.href = cssUrl;
  
      // Append link element to HTML head
      head.appendChild(link);
    }
  
    function appendJSScript(script) {
      var s = document.createElement("script");
      s.type = "text/javascript";
      try {
        s.appendChild(document.createTextNode(script));
        document.head.appendChild(s);
      } catch (e) {
        s.text = script;
        document.head.appendChild(s);
      }
      //after add we want to remove to avoid polluting page
      s.remove();
    }
  
    function ajax(config, successCB, failCB, alwaysCB) {
      var xhr = new XMLHttpRequest();
  
      //we always want to send our requests with credentials
      xhr.withCredentials = true;
  
      var url = config.url,
        params = config.data || config.params || {},
        paramKeys = Object.keys(params),
        dataString = "",
        method = config.method || "GET",
        i,
        pKey,
        pValue;
  
      if (config.cache === false) {
        params._ = Date.now();
      }
  
      //set all the url parameters
      for (i = 0; i < paramKeys.length; i++) {
        pKey = paramKeys[i];
        pValue = params[pKey];
        if (i !== 0) {
          //since we are gonna append to the url
          dataString += "&";
        }
        dataString += encodeURIComponent(pKey) + "=";
        dataString += encodeURIComponent(pValue);
      }
  
      //for GET request, need to add initial separator for params to the url
      if (method === "GET") {
        if (dataString && url.indexOf("?") === -1) {
          //since we are gonna append to the url
          url += "?" + dataString;
        } else {
          url += "&" + dataString;
        }
      }
  
      xhr.open(method, url, true);
  
      xhr.onreadystatechange = function() {
        // In local files, status is 0 upon success in Mozilla Firefox
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var status = xhr.status;
  
          setTimeout(
            function() {
              if (status === 0 || (status >= 200 && status < 400)) {
                // The request has been completed successfully
                if (config.dataType === "script") {
                  try {
                    appendJSScript(xhr.responseText);
                  } catch (e) {
                    failCB(xhr, config);
                  }
                }
  
                successCB(xhr.responseText, xhr, config);
              } else {
                // Oh no! There has been an error with the request!
                failCB(xhr, config);
              }
  
              alwaysCB(xhr, config);
            }.bind(this)
          );
        }
      };
  
      if (method === "POST" && dataString) {
        xhr.send(dataString);
      } else {
        xhr.send();
      }
    }
  
    var loadingDone = false;
    var cbQueue = [];
  
    window.MoW = extend(window.MoW || {}, {
      ready: function(cb) {
        if (loadingDone) {
          cb();
        } else {
          cbQueue.push(cb);
        }
      }
    });
  
    /*
     * returns true if "Microsoft Internet Explorer" version 9 false otherwise.
     */
    var isIE9 = function() {
      var userAgent = window.navigator.userAgent;
      var browserName = window.navigator.appName;
      var browserVersion;
  
      // If opera, we dont support, return undefined
      if (
        userAgent.indexOf("Opera") !== -1 ||
        userAgent.indexOf(" OPR/") !== -1 ||
        userAgent.indexOf("Firefox") !== -1 ||
        userAgent.indexOf("Chrome") !== -1
      ) {
        return false;
      }
  
      if (browserName === "Microsoft Internet Explorer" || userAgent.indexOf("MSIE") !== -1) {
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(userAgent) !== null) {
          browserVersion = parseFloat(RegExp.$1);
        }
      }
  
      return browserVersion === 9;
    };
  
    var loadMow = function(href) {
      // The URL script will probably be absolute, but we might as well handle the
      // relative case.
      var parser = document.createElement("a");
      parser.href = href;
  
      var pathname = parser.pathname[0] === "/" ? parser.pathname : "/" + parser.pathname;
      var launcherURL = parser.protocol + "//" + parser.host + pathname;
  
      // If the script is at http://some-host:8081/mow/api/util/mow-launcher.js
      // then replace that last part so we just get http://some-host:8081/mow
      var mowServer = launcherURL.replace(/api\/mow.js/, "");
      // IE doesn't leave a trailing slash
      if (mowServer[mowServer.length - 1] !== "/") {
        mowServer = mowServer + "/";
      }
  
      // Get the query parameters
      var queryParams = {};
      var scriptQueryString = parser.href.replace(/^[^\?]+\??/, "");
      scriptQueryString.split("&").forEach(function(keyValue) {
        if (keyValue) {
          var param = keyValue.split("=");
          queryParams[param[0]] = param[1];
        }
      });
      document.location.search
        .slice(1)
        .split("&")
        .forEach(function(keyValue) {
          if (keyValue) {
            var param = keyValue.split("=");
            queryParams[param[0]] = param[1];
          }
        });
  
      window.mow = window.mow || {};
  
      window.mow.skipLoadingLibs = (queryParams.skipLoadingLibs || "").split(",");
  
      var config = extend(
        {
          mow_server: mowServer, // The server that hosts the MoW application code
          debug: false // Lots of extra logging if this is true
        },
        MoW.config,
        queryParams
      );
  
      window.MoW.MOW_SERVER = mowServer;
  
      // this constant will be replaced by build script with the current GVS version as defined in
      // the GVS version.txt.  This is done in the grunt replace task.
      window.MoW.MOW_VERSION = "3.49.1";
  
      window.MoW.NO_VENDOR = "true";
  
      var initialRendererIs3D =
        queryParams.initialRenderer === "3d" || queryParams.initialRenderer === "3D";
  
      /*
       * The list of resources to load
       * This has the following structure...
       * 'name-of-the-dependency': {
       *   js: [... array of javascript files to load ... ],
       *   jsMin: [... array of minified js files; these will be used if available ... ],
       *   css: [... array of CSS files to load ... ],
       *   checkFunction: a function that returns true if the library has already
       *                   been loaded on the page and won't be loaded again.
       * }
       */
      var jQueryLib = [
        {
          id: "jQuery",
          js: [config.mow_server + "lib/jquery/1.9.1/jquery.js"],
          jsMin: [config.mow_server + "lib/jquery/1.9.1/jquery.min.js"],
          checkFunction: function() {
            if (window.jQuery) {
              return true;
            } else {
              return false;
            }
          }
        }
      ];
  
      //determine if we need to add the xdr-xhr addapter
      //should be loaded along with jquery since it should be loaded first
      if (isIE9()) {
        jQueryLib.xhrXdrAdapter = {
          js: [config.mow_server + "lib/xhr-xdr-adapter/xhr-xdr-adapter.js"]
        };
      }
  
      var vendorLibraries = [
        {
          id: "vendor1",
          js: [config.mow_server + "lib/vendor1.min.js"],
          jsMin: [config.mow_server + "lib/vendor1.min.js"],
          css: [config.mow_server + "styles/vendor.css"]
        },
        {
          id: "vendor2",
          js: [config.mow_server + "lib/vendor2.min.js"]
        },
        //requireJS seems to conflict with some other libraries, so let's load it last  needed for embedded plugins.
        {
          id: "requireJS",
          jsMin: [config.mow_server + "api/lib/requireJS/require.min.js"]
        }
      ];
  
      //NOTE: All lib styles need to be added here in a css array
      var libraries = [
        {
          id: "jQueryUI",
          js: [config.mow_server + "lib/jqueryui/1.12.1/jquery-ui.js"],
          jsMin: [config.mow_server + "lib/jqueryui/1.12.1/jquery-ui.min.js"],
          css: [config.mow_server + "lib/jqueryui/1.12.1/jquery-ui.structure.css"],
          checkFunction: function() {
            return window.jQuery && window.jQuery.fn.draggable;
          }
        },
        {
          id: "CSS Reset",
          js: [],
          css: [config.mow_server + "api/styles/reset.css"],
          checkFunction: function() {
            return false;
          }
        },
        {
          id: "OpenLayers 2",
          js: [config.mow_server + "lib/openlayers/2.13.1/OpenLayers-lightweight.debug.js"],
          jsMin: [config.mow_server + "lib/openlayers/2.13.1/OpenLayers-lightweight.min.js"],
          checkFunction: function() {
            if (window.OpenLayers) {
              return true;
            }
            return false;
          }
        },
        {
          id: "Custom Scrollbar",
          js: [config.mow_server + "lib/simplebar/simplebar.js"],
          jsMin: [config.mow_server + "lib/simplebar/simplebar.js"]
        },
        { id: "JSTree", js: [config.mow_server + "lib/jstree_3.0/jstree.js"] },
        {
          id: "Twitter Bootstrap 3.2",
          js: [config.mow_server + "lib/bootstrap/3.3.2/js/bootstrap.min.js"],
          checkFunction: function() {
            // If a bootstrap function has been added to jquery, we can expect
            // bootstrap to have already been loaded.
            /* eslint-disable no-undef */
            if (window.jQuery) {
              // If it is loaded AND the version is 3.3.2, do not load again.
              return window.jQuery().modal && window.jQuery().modal.Constructor.VERSION === "3.3.2";
            }
            /* eslint-enable no-undef */
          }
        },
        {
          id: "Handlebars",
          js: [config.mow_server + "lib/handlebars/3.0.8/handlebars.js"],
          checkFunction: function() {
            if (window.handlebars) {
              return true;
            }
            return false;
          }
        },
        {
          id: "usng.js",
          js: [config.mow_server + "lib/usng/usng.js"],
          jsMin: [config.mow_server + "lib/usng/usng.min.js"]
        },
        { id: "zipJs", js: [config.mow_server + "lib/zipJs/zip.js"] },
        {
          id: "geographiclib",
          js: [config.mow_server + "lib/geographiclib/geographiclib.js"],
          jsMin: [config.mow_server + "lib/geographiclib/geographiclib.min.js"]
        },
        { id: "lodash", js: [config.mow_server + "lib/lodash/4.14.0/lodash.min.js"] },
        { id: "vendorCSS", css: [config.mow_server + "styles/vendor.css"] }
        // As new dependencies arise, we can add them here...
      ];
  
      /*
       * These are additional AngularJS modules. We can't load them until after
       * AngularJS has been loaded, so they can't go with the rest of the libs.
       */
      var additionalModules = [
        { id: "protobuf", js: [config.mow_server + "lib/Cesium/ThirdParty/protobuf-minimal.js"] },
        { id: "summernote", js: [config.mow_server + "lib/summernote/summernote.min.js"] },
        {
          id: "Terraformer",
          js: [config.mow_server + "lib/terraformer/terraformer.js"],
          css: []
        },
        {
          id: "Turf",
          js: [config.mow_server + "lib/turf/turf.js"],
          jsMin: [config.mow_server + "lib/turf/turf.min.js"]
        },
        {
          id: "lie",
          js: [config.mow_server + "lib/lie/3.1.1/lie.js"],
          jsMin: [config.mow_server + "lib/lie/3.1.1/lie.min.js"]
        },
        {
          id: "liePolyfill",
          js: [config.mow_server + "lib/lie/3.1.1/lie.polyfill.js"],
          jsMin: [config.mow_server + "lib/lie/3.1.1/lie.polyfill.min.js"]
        },
        {
          id: "proj4",
          js: [config.mow_server + "lib/proj4/2.1.4/proj4.js"]
        },
        {
          id: "parsedbf",
          js: [config.mow_server + "lib/parsedbf/0.1.2/parsedbf.js"]
        },
        {
          id: "shp",
          js: [config.mow_server + "lib/shpjs/3.3.2/shp.js"]
        },
        {
          id: "shpwrite",
          js: [config.mow_server + "lib/shp-write/shp-write.js"]
        },
        {
          id: "zipJsInflate",
          js: [config.mow_server + "lib/zipJs/inflate.js"]
        },
        {
          id: "zipJsDeflate",
          js: [config.mow_server + "lib/zipJs/deflate.js"]
        },
        {
          id: "lodashWrapper",
          js: [config.mow_server + "scripts/lodashWrapper/lodashWrapper.js"]
        }
      ];
  
      // Loaded after vendor libs, but before renderer
      var mowScripts = [
        {
          id: "mowScriptBundle",
          js: [config.mow_server + "scripts/mow.script.js"],
          jsMin: [config.mow_server + "scripts/mow.script.min.js"]
        }
      ];
  
      var rendererModules = [];
  
      rendererModules.push({
        id: "mapapi",
        js: [config.mow_server + "scripts/mapapi/mapapi_olx.js"],
        jsMin: [config.mow_server + "scripts/mapapi/mapapi_olx.min.js"],
        checkFunction: function() {
          return false;
        }
      });
  
      if (initialRendererIs3D) {
        rendererModules.push({
          id: "cesium",
          js: [config.mow_server + "scripts/mapapi/mapapi_cesium.js"],
          jsMin: [config.mow_server + "scripts/mapapi/mapapi_cesium.min.js"],
          checkFunction: function() {
            return false;
          }
        });
      }
  
      //Load these modules last. These scripts are not included in the vendor libraries
      var moreAdditionalModules = [
        {
          id: "Terraformer ArcGIS Parser",
          js: [config.mow_server + "lib/terraformer/terraformer-arcgis-parser.js"],
          css: []
        },
        //requireJS seems to conflict with some other libraries, so let's load it last
        {
          id: "requireJS",
          js: [config.mow_server + "api/lib/requireJS/require.js"],
          jsMin: [config.mow_server + "api/lib/requireJS/require.min.js"]
        }
      ];
  
      /*
       * The actual MoW client files.
       */
      var mowFiles = [
        {
          id: "Map of the World client",
          js: [config.mow_server + "scripts/mow.js"],
          jsMin: [config.mow_server + "scripts/mow.min.js"],
          css: [config.mow_server + "styles/mow.css", config.mow_server + "motw_splash.css"]
        }
      ];
  
      /*
       * Loads the JavaScript and CSS dependencies of MoW.
       * Params:
       *   dependencies - The files to load. See the dependencies object for the
       *                  format of this.
       * Returns:
       *   A promise that resolves once all the dependencies have been satisifed.
       */
      var loadDependencies = function(dependencies, doneCB) {
        var dependenciesCounter = 0;
  
        //when each depdencency is completed
        var depDoneCB = function() {
          dependenciesCounter++;
  
          if (dependenciesCounter >= dependencies.length) {
            doneCB && doneCB();
          }
        };
  
        //handle the case of no dependencies
        if (dependencies.length === 0) {
          depDoneCB();
        }
  
        dependencies.forEach(function(dependency) {
          dependency = dependency || {};
          var dependencyName = dependency.id;
  
          debugMsg("Checking for " + dependencyName);
          if (typeof dependency.checkFunction === "undefined" || !dependency.checkFunction()) {
            debugMsg("Loading " + dependencyName + "...");
  
            // Get the js files
            var jsFiles = dependency.js;
            if (!config.debug && dependency.jsMin) {
              jsFiles = dependency.jsMin;
            }
  
            //this counter will be sued to track completed requests
            var requestCompleteCounter = 0;
  
            (jsFiles || []).forEach(function(url) {
              debugMsg("Downloading JavaScript file " + url);
  
              ajax(
                {
                  url: url,
                  dataType: "script",
                  cache: true,
                  data: {
                    "mow_version": window.MoW.MOW_VERSION
                  }
                },
                function() {},
                function(xhr, config) {
                  var status = xhr.status;
                  debugMsg(
                    "Failed with error code [" +
                      status +
                      "]. " +
                      xhr.responseText +
                      " | URL: " +
                      config.url
                  );
                },
                //always invoke this regardless of outcome
                function() {
                  if (++requestCompleteCounter === jsFiles.length) {
                    //it completed all requests hence it is safe to complete loading
                    depDoneCB();
                  }
                }
              );
            });
  
            // Get the CSS files
            (dependency.css || []).forEach(function(url) {
              debugMsg("Downloading CSS file " + url);
              loadCss(url);
            });
  
            if ((jsFiles || []).length === 0) {
              depDoneCB();
            }
          } else {
            debugMsg(dependencyName + " found!");
            depDoneCB();
          }
        });
      }; // loadDependencies
  
      /**
       * @description Iterates through the callback queue and calls each method.
       */
      var releaseCallbacks = function() {
        loadingDone = true;
        cbQueue.forEach(function(cb) {
          cb();
        });
      };
  
      // Check if we're localhost or not... cause in localhost we don't load vendor libs by default in embedded maps
      var isNotLocal = mowServer.indexOf("localhost") === -1;
      //though e2e testing is ran on localhost we want to load resouces like we would in ops
      if (window.jasmine && window.jasmine.e2e) {
        isNotLocal = true;
      }
  
      // If we're using the vendorN.min.js version, then cancel loading all the other libraries
      if (!config.debug && (window.MoW.NO_VENDOR === "false" || isNotLocal)) {
        var vendorLibsLookup = {};
        vendorLibraries.forEach(function(dep) {
          if (!dep) {
            return;
          }
  
          var id = dep.id;
  
          vendorLibsLookup[id] = dep;
        });
  
        //when not in debug, move the css files over to the vendor so it'll get picked up
        libraries = [vendorLibsLookup.vendor1];
        additionalModules = [vendorLibsLookup.vendor2];
        moreAdditionalModules = [vendorLibsLookup.requireJS];
      }
  
      /*
       * @description If config.debug is true, then this writes to console.log
       */
      var debugMsg = function(message) {
        if (config.debug) {
          console.log(message);
        }
      };
      window.CESIUM_BASE_URL = config.mow_server + "/lib/Cesium/";
  
      debugMsg("Embedded Map of the World");
  
      loadDependencies(jQueryLib, function() {
        loadDependencies(libraries, function() {
          loadDependencies(additionalModules, function() {
            loadDependencies(mowScripts, function() {
              loadDependencies(rendererModules, function() {
                loadDependencies(moreAdditionalModules, function() {
                  loadDependencies(mowFiles, function() {
                    releaseCallbacks();
                  });
                });
              });
            });
          });
        });
      });
    };
  
    // We need to "phone home" to get all the MoW libs and styles.  But where
    // is "home"? We can use the location of this launcher script to find out.
    var scripts = document.getElementsByTagName("script");
  
    var i, myScript, script;
  
    for (i = 0; i < scripts.length; i++) {
      script = scripts[i];
      if (script.src.indexOf("mow.js") > -1) {
        myScript = script;
        break;
      }
    }
  
    //in some cases we can access the currentScript (not in IE)
    myScript = myScript || document.currentScript;
  
    //If we can find the script by iterating through the script tags, use that. Otherwise we're loading
    // it via ajax. wait for it to complete then find that javascript file.
    if (myScript && myScript.src) {
      loadMow(myScript.src);
    } else if (window.jQuery) {
      console.warn(
        "mow.js could not be found in the document script elements. Waiting on an AjaxComplete event in case the script was loaded via jQuery ajax."
      );
      //Note that this will ONLY work if they're using jQuery to launch the reqest. If they're using
      // another library or raw Javascript then this will not find the script.
      //THIS IS SIMPLY WAITING FOR THIS LOADING TO END
      window.jQuery(document).ajaxComplete(function(event, xhr, data) {
        if (data.url.indexOf("mow.js") > -1) {
          loadMow(data.url);
        }
      });
    }
  })();