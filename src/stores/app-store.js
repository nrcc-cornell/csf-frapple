///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming Apple Stage / Freeze Damage Probability Tool
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { observable, computed, action, toJS } from 'mobx';
import jsonp from 'jsonp';
import jQuery from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/button.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/button';
import moment from 'moment';

export class AppStore {
    // -----------------------------------------------------------------------------------------
    // Display status of 30-Day Trend ----------------------------------------------------------
    // For Components: TrendButton, DisplayTrend -----------------------------------------------
    // -----------------------------------------------------------------------------------------
    @observable trend_status=true;
    @action updateTrendStatus = (b) => { this.trend_status = b };
    @computed get trendStatus() { return this.trend_status };

    // -----------------------------------------------------------------------------------------
    // Display status for Full Season ----------------------------------------------------------
    // For Components: SeasonButton, DisplaySeason - -------------------------------------------
    // -----------------------------------------------------------------------------------------
    @observable season_status=false;
    @action updateSeasonStatus = (b) => { this.season_status = b };
    @computed get seasonStatus() { return this.season_status };

    // -----------------------------------------------------------------------------------------
    // Display status for climate change results -----------------------------------------------
    // For Components: ClimateChangeButton -----------------------------------------------------
    // -----------------------------------------------------------------------------------------
    @observable climate_change_status=false;
    @action updateClimateChangeStatus = (b) => {
        this.climate_change_status = b
    };
    @computed get climateChangeStatus() { return this.climate_change_status };
    cc_placeholder_content=
        <div>
        <b>Coming Soon:</b> Over the next several months, our programming team will be incorporating data from downscaled climate change projections into each tool, covering the Northeastern United States. The climate change projections are determined from the <a href="http://cmip-pcmdi.llnl.gov/cmip5/" target="_blank" rel="noopener noreferrer">CMIP5 climate models</a>, maintained by the Northeast Regional Climate Center (<a href="http://www.nrcc.cornell.edu" target="_blank" rel="noopener noreferrer">NRCC</a>) at Cornell. This data will provide the long-term context for the data shown in each Climate Smart Farming Tool – for example, in this tool, the climate projections data will provide context for how climate change will affect potential damage to apple crops in the future. This type of information will help farmers and decision makers understand how climate change will likely affect them over the coming decades. For more information, please contact us at <a href="mailto:cicss@cornell.edu?subject=CSF water deficit tool info">cicss@cornell.edu</a>.
        </div>;

    // -----------------------------------------------------------------------------------------
    // Display status for Data Sources and References ------------------------------------------
    // For Components: InfoButton & InfoWindow -------------------------------------------------
    // -----------------------------------------------------------------------------------------
    @observable info_status=false;
    @action updatePopupStatus = () => { this.info_status = !this.info_status };
    @computed get popupStatus() { return this.info_status };
    info_content = 
        <div>
               <h2>Data sources and methods</h2>
               <h4><br/>&bull; PHENOLOGICAL STAGES OF APPLE GROWTH</h4>
               <p>
               Apple phenology is computed based on the accumulation of base 43°F growing degree days using <a href="http://blogs.cornell.edu/jentsch/tree-phenology-dates-and-degree-day-events/" target="_blank" rel="noopener noreferrer">phenological data collected in NY state</a>. GDD accumulation commences on the date that winter chilling is satisfied (1000-1200 chill units depending on variety) .  Chill accumulation is based on the the North Carolina Chilling Unit Model (Shaultout and Unrath, 1983).
               </p>
               <p>
               Shaultout, D. and Unrath, R. (1983). Rest completion prediction model for Starkrimson Delicious apples. Journal of American Society of Horticultural Sciences 108: 957–961.
               </p>
               <h4>&bull; LETHAL DAMAGE TEMPERATURES</h4>
               <p>
               Lethal damage temperatures (T10%, T50%, T90%) correspond to the different phenological development stages based on data from Proebsting and Mills (1978).  These temperatures represent the  average temperatures at which 10%, 50%, and 90% of the blossoms are killed.
               </p>
               <p>
               Proebsting, E.L. Jr. and H.H. Mills. 1978. Low temperature resistance [frost hardiness] of developing flower buds of six deciduous fruit species. Journal American Society for Horticultural Science. 103(2):192-198.
               </p>
               <h4>&bull; TEMPERATURE DATA</h4>
               <p>
               The 2.5 x 2.5 mile gridded dataset of minimum temperatures is produced daily for the Northeast United States by the <a href="http://www.nrcc.cornell.edu" target="_blank" rel="noopener noreferrer">Northeast Regional Climate Center</a>, using methods described in Degaetano and Belcher (2007). These data are available for use through the Applied Climate Information System (<a href="http://www.rcc-acis.org" target="_blank" rel="noopener noreferrer">ACIS</a>) web service.
               </p>
               <p>
               Degaetano, A.T. and B.N. Belcher. (2007). Spatial Interpolation of Daily Maximum and Minimum Air Temperature Based on Meteorological Model Analyses and Independent Observations. Journal of Applied Meteorology and Climatology. 46.
               </p>
        </div>;

    // -----------------------------------------------------------------------------------
    // Interest Date Picker --------------------------------------------------------------
    // For Components: InterestDatePicker ------------------------------------------------
    // -----------------------------------------------------------------------------------
    @observable interest_date = moment();
    //@action initInterestDate = () => {
    //    this.updateInterestDate( moment('03/15/2017','MM/DD/YYYY') );
    //};
    @action initInterestDate = () => {
        let validMonths = [1,2,3,4,5,6,9,10,11,12];
        let currentMonth = moment().month() + 1;
        if (validMonths.includes(currentMonth)) {
            //this.updateInterestDate( moment().format("MM/DD/YYYY") )
            this.interest_date = moment()
            //this.updateInterestDate( moment() )
        } else {
            this.interest_date = moment('03/15/'+moment().year().toString(),'MM/DD/YYYY')
            //this.updateInterestDate( moment('03/15/'+moment().year().toString(),'MM/DD/YYYY') );
        }
        this.initSeason(this.getInterestDate)
    };
    @action updateInterestDate = (v) => {
      this.interest_date = v
      this.updateSeason(v)
    };
    @computed get getInterestDate() {
      return this.interest_date
    };

    @observable season = [];
    @action initSeason = (d) => {
        let validMonthsEarlySeason = [9,10,11,12];
        let validMonthsLateSeason = [1,2,3,4,5,6];
        let month = moment(d).month() + 1;
        let year = moment(d).year();
        let seasonArray = [];
        if (validMonthsEarlySeason.includes(month)) {
            seasonArray = [year,year+1]
        } else if (validMonthsLateSeason.includes(month)) {
            seasonArray = [year-1,year]
        } else {
            seasonArray = [year-1,year]
        }
        this.season = seasonArray
    }
    @action updateSeason = (d) => {
        let validMonthsEarlySeason = [9,10,11,12];
        let validMonthsLateSeason = [1,2,3,4,5,6];
        let month = moment(d).month() + 1;
        let year = moment(d).year();
        let seasonArray = [];
        if (validMonthsEarlySeason.includes(month)) {
            seasonArray = [year,year+1]
        } else if (validMonthsLateSeason.includes(month)) {
            seasonArray = [year-1,year]
        } else {
        }
        if (this.getSeason[1] !== seasonArray[1]) {
            this.season = seasonArray
            this.downloadData()
        }
    }
    @computed get getSeason() {
      return this.season
    };

    // -----------------------------------------------------------------------------------
    // Apple variety selection -----------------------------------------------------------
    // For Components: AppleRadioSelect --------------------------------------------------
    // -----------------------------------------------------------------------------------
    @observable apple_variety='empire';
    @action updateAppleVariety = (changeEvent) => {
            //console.log(changeEvent.target.value);
            this.apple_variety = changeEvent.target.value
        }
    @action updateAppleVarietyFromText = (v) => {
            this.apple_variety = v
        }
    @computed get getAppleVariety() {
        return this.apple_variety
    }

    // -----------------------------------------------------------------------------------
    // Location Picker -------------------------------------------------------------------
    // For Components: LocationPicker ----------------------------------------------------
    // -----------------------------------------------------------------------------------
    map_dialog=null;
    manage_local_storage=null;

    // Location ID -------------------------------------------
    @observable location_id='default';
    @action updateLocationId = (i) => {
            this.location_id = i;
        }
    @computed get getLocationId() {
            return this.location_id
        }

    // Location coordinates ----------------------------------
    @observable lat='42.50';
    @observable lon='-76.50';
    @action updateLocation = (lt,ln) => {
            if ((this.getLat !== lt) || (this.getLon!==ln)) {
                this.lat = lt;
                this.lon = ln;
                this.downloadData()
            }
        }
    @computed get getLat() {
            return this.lat
        }
    @computed get getLon() {
            return this.lon
        }

    // Location address --------------------------------------
    @observable address='Cornell University, Ithaca, NY';
    @action updateAddress = (a) => {
            this.address = a;
        }
    @computed get getAddress() {
            return this.address
        }


    // Location default --------------------------------------
    @observable default_location;
    @action updateDefaultLocation = () => {
            this.default_location = {address:this.getAddress, lat:parseFloat(this.getLat), lng:parseFloat(this.getLon), id:this.getLocationId};
        }
    @computed get getDefaultLocation() {
            return this.default_location
        }


    // Initialize the local storage manager
    @action initStorageManager = (namespace) => {
        //console.log('initStorageManager');
        let storage_options = {
            namespace: namespace,
            expireDays: 3650
        }
        jQuery().CsfToolManageLocalStorage(storage_options);
        this.manage_local_storage = jQuery().CsfToolManageLocalStorage();
        this.manage_local_storage("init");
    }

    // Initialize the location state
    @action initLocationState = () => {
        //console.log('initLocationState');
        let selected_id = this.manage_local_storage("read","selected");
        let locations = this.manage_local_storage("read","locations");
        let loc_obj = null;
        if (locations !== undefined) {
            loc_obj = locations[selected_id]
        } else {
            loc_obj = null
        }
        this.updateDefaultLocation();
        if (loc_obj) {
            this.updateLocationId(loc_obj.id);
            this.updateAddress(loc_obj.address);
            this.updateLocation(loc_obj.lat.toString(),loc_obj.lng.toString());
        } else {
            this.updateLocationId(this.default_location.id);
            this.updateAddress(this.default_location.address);
            this.updateLocation(this.default_location.lat.toString(),this.default_location.lng.toString());
            // WRITE DEFAULT LOCATION IF NO LOCATIONS EXIST
            this.manage_local_storage("write","locations",{default: this.default_location});
            this.manage_local_storage("write","selected",this.default_location.id);
        }
    }

    // Initialize the map dialog
    @action initMapDialog = () => {
            //console.log('initMapDialog');
            //var default_location = this.getDefaultLocation
            var default_location = {address:this.getAddress, lat:parseFloat(this.getLat), lng:parseFloat(this.getLon), id:"default"};
            //var options = { width:600, height:500, google:google, default:default_location };
            var options = { width:600, height:500, google:window.google, default:default_location };
            jQuery(".csftool-location-dialog").CsfToolLocationDialog(options);
            this.map_dialog = jQuery(".csftool-location-dialog").CsfToolLocationDialog();
            this.map_dialog("bind", "close", (ev, context) => {
                let loc_obj = context.selected_location;
                this.updateLocationId(loc_obj.id);
                this.updateAddress(loc_obj.address);
                this.updateLocation(loc_obj.lat.toString(),loc_obj.lng.toString());

                // WRITE LOCATIONS THE USER HAS SAVED
                this.manage_local_storage("write","locations",context.all_locations);
                this.manage_local_storage("write","selected",this.getLocationId);

                // REMOVE LOCATIONS THE USER HAS DELETED
                var idsToDelete = this.manage_local_storage("getExtraKeys", "locations", context.all_locations);
                this.manage_local_storage("delete", "locations", idsToDelete);
            });
        }

    // Open map with all saved locations
    @action openMap = () => {
            let locations = this.manage_local_storage("read","locations");
            let selected_id = this.manage_local_storage("read","selected");
            this.map_dialog("locations", locations);
            this.map_dialog("open", selected_id);
        }


    // -----------------------------------------------------------------------------------
    // Control Loaders (Spinners) --------------------------------------------------------
    // -----------------------------------------------------------------------------------
    // Logic for displaying spinner
    @observable loader_data=false;
    @action updateLoaderData = (l) => {
            this.loader_data = l;
        }
    @computed get getLoaderData() {
            return this.loader_data
        }


    // -----------------------------------------------------------------------------------
    // API -------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------

    // store downloaded data
    @observable chart_data = null;
    @action updateChartData = (d) => {
            if (this.getChartData) { this.chart_data = null }
            this.chart_data = d;
        }
    @computed get getChartData() {
            return this.chart_data
        }

    // check variety availability
    @computed get empireIsAvailable() {
            if (this.getChartData !== null) {
                return 'empire' in toJS(this.getChartData);
            } else {
                return false
            }
        }
    @computed get mcintoshIsAvailable() {
            if (this.getChartData !== null) {
                return 'mac_geneva' in toJS(this.getChartData);
            } else {
                return false;
            }
        }
    @computed get reddeliciousIsAvailable() {
            if (this.getChartData !== null) {
                return 'red_delicious' in toJS(this.getChartData);
            } else {
                return false
            }
        }

    @action downloadData = () => {
            if (this.getLoaderData === false) { this.updateLoaderData(true); }
            //const url = 'http://tools.climatesmartfarming.org/irrigationtool/tsta/?lat='+this.getLat+'&lon='+this.getLon+'&year='+this.getSeason[1]
            const url = 'http://tools.climatesmartfarming.org/tstatool/data/?lat='+this.getLat+'&lon='+this.getLon+'&year='+this.getSeason[1]
            //const url = 'http://tools.climatesmartfarming.org/tstatool/datatest/?lat='+this.getLat+'&lon='+this.getLon+'&year='+this.getSeason[1]
            jsonp(url, null, (err,data) => {
                if (err) {
                    console.error(err.message);
                    return
                } else {
                    //console.log('DOWNLOADED DATA COMPLETE');
                    // test missing key
                    //if (this.getSeason[1]===2018) {delete data['empire']}
                    //if (this.getSeason[1]===2018) {delete data['mac_geneva']}
                    //if (this.getSeason[1]===2018) {delete data['red_delicious']}
                    if (Object.keys(data).length > 0) {
                        // update apple variety if currently selected is missing
                        if (!(this.getAppleVariety in data)) { this.updateAppleVarietyFromText(Object.keys(data)[0]) };
                        // update chart data
                        this.updateChartData(data);
                    } else {
                        this.updateChartData(null);
                    }
                    if (this.getLoaderData === true) { this.updateLoaderData(false); }
                    return
                }
            });
        }

}

