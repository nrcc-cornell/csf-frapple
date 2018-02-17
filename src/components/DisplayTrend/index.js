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

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Loader from 'react-loader-advanced';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';

import '../../styles/DisplayTrend.css';
import '../../styles/loader.css';

const spinner = <div className="loader"></div>

@inject("store") @observer
class DisplayTrend extends Component {

  render() {

        if ( (this.props.store.app.trendStatus) && (this.props.store.app.getChartData) ) {

            var data = this.props.store.app.getChartData
            var variety = this.props.store.app.getAppleVariety

            // assign important dates that we will refer to frequently
            let firstYearOfSeason = this.props.store.app.getSeason[0]
            let firstDayOfSeason = moment.utc(firstYearOfSeason+'-09-01', 'YYYY-MM-DD')
            let secondYearOfSeason = this.props.store.app.getSeason[1]
            let lastDayOfSeason = moment.utc(secondYearOfSeason+'-06-30', 'YYYY-MM-DD')
            let idxFirstFcst = data[variety]['mint'].length
            let firstFcstDate = null
            //let lastObsDate = null
            if (data[variety]['firstFcstDate']==="") {
                idxFirstFcst = data[variety]['mint'].length
                firstFcstDate = null
                //lastObsDate = null
            } else {
                firstFcstDate = moment.utc(data[variety]['firstFcstDate'],'YYYY-MM-DD')
                //lastObsDate = moment.utc(data[variety]['firstFcstDate'],'YYYY-MM-DD').subtract(1,'days')
                idxFirstFcst = firstFcstDate.diff(firstDayOfSeason,'days')
            }

            let apple_labels = {
                'empire': 'Empire',
                'mac_geneva': 'McIntosh',
                'red_delicious': 'Red Delicious',
            }

            //function addDays(date, days) {
            //    var result = new Date(date);
            //    result.setDate(result.getDate() + days);
            //    return result;
            //}

            function daysUntilToday(d) {
                let today = moment()
                return today.diff(d, 'days')
            }

            const getXaxisMin = () => {
                // xMin will be set to 30 days prior to xMax - the viewable time period on chart will be 30 days
                let xMin = getXaxisMax();
                xMin = xMin.subtract(30,'days');
                // if xMin is set prior to first day of season, reset it to the first day of season
                if (xMin < firstDayOfSeason) {
                    xMin = moment.utc().set({'year': firstDayOfSeason.year(), 'month': firstDayOfSeason.month(), 'date': firstDayOfSeason.date()})
                }
                return xMin
            }

            const getXaxisMax = () => {
                let dateActive = this.props.store.app.getInterestDate;
                let xMax = null;
                let daysBack = daysUntilToday(dateActive);
                if (daysBack < 15) {
                    // set xMax to the last forecast day
                    xMax = moment.utc(firstYearOfSeason+'-09-01', 'YYYY-MM-DD').add(data[variety]['mint'].length,'days')
                } else {
                    // set xMax to 15 days after the selected date
                    xMax = moment.utc().set({'year': dateActive.year(), 'month': dateActive.month(), 'date': dateActive.date()}).add(15,'days')
                }
                if (xMax > lastDayOfSeason) {
                    // if xMax is set to after the last day of the season, reset it to the last day of season
                    xMax = moment.utc().set({'year': lastDayOfSeason.year(), 'month': lastDayOfSeason.month(), 'date': lastDayOfSeason.date()})
                }
                return xMax
            }

            // determine if the forecasts are viewable in the currently displayed chart
            const fcstInView = () => {
                if (firstFcstDate === null) { return false }
                if (firstFcstDate > lastDayOfSeason) { return false }
                if (firstFcstDate > getXaxisMax()) { return false }
                return true
            }

            //function tooltipFormatter() {
            //    var i, item;
            //    var stage_labels = ['Dormant','Silver Tip','Green Tip','1/2" Green','Tight Cluster','Pink Bud','undefined','Petal Fall']
            //    var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %d, %Y', this.x) + '</span>';
            //    var tips = "";
            //    for (i=0; i<this.points.length; i++) {
            //        item = this.points[i];
            //        if (item.series.type === "line") {
            //            if (item.series.name === "Stage") {
            //                tips += '<br/><span style="color:#000000;font-size:12px;font-weight:bold">Stage           : ' + stage_labels[ item.y ] + '</span>';
            //            }
            //            if (item.series.name === "Min Temperature") {
            //                tips += '<br/>' + item.y + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "Min Temp Forecast") {
            //                tips += '<br/>' + item.y + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "10% Damage Temp") {
            //                tips += '<br/>' + item.y.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "10% Damage Fcst") {
            //                tips += '<br/>' + item.y.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "50% Damage Temp") {
            //                tips += '<br/>' + item.y.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "50% Damage Fcst") {
            //                tips += '<br/>' + item.y.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "90% Damage Temp") {
            //                tips += '<br/>' + item.y.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //            if (item.series.name === "90% Damage Fcst") {
            //                tips += '<br/>' + item.y.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            //            }
            //        }
            //    }
            //    return header + tips;
            //}

            function tooltipFormatter() {
                var i, idx, item;
                //var stage_labels = ['dormant','stip','gtip','ghalf','cluster','pink','bloom','petalfall']
                var stage_labels = ['Dormant','Silver Tip','Green Tip','1/2" Green','Tight Cluster','Pink Bud','Bloom','Petal Fall']
                //var stage_labels = ['Dormant','Silver Tip','Green Tip','1/2" Green','Tight Cluster','Pink Bud','undefined','Petal Fall']
                var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %d, %Y', this.x) + '</span>';
                var tips = "";
                for (i=0; i<this.points.length; i++) {
                    item = this.points[i];
                    if (item.series.name === 'Min Temperature') {
                        idx = item.point.index;
                        //console.log(idx, idxFirstFcst);
                        tips += '<br/><span style="color:#000000;font-size:12px;font-weight:bold">Stage           : ' + stage_labels[ data[variety]['stage'][idx] ] + '</span>';
                        tips += '<br/><span style="color:#0000FF;font-size:12px;font-weight:bold">Min Temperature : ' + parseInt(data[variety]['mint'][idx],10) + '</span>';
                        tips += '<br/><span style="color:#1E90FF;font-size:12px;font-weight:bold">10% Damage Temp : ' + parseInt(data[variety]['T10'][idx],10) + '</span>';
                        tips += '<br/><span style="color:#FFD700;font-size:12px;font-weight:bold">50% Damage Temp : ' + parseInt(data[variety]['T50'][idx],10) + '</span>';
                        tips += '<br/><span style="color:#FF0000;font-size:12px;font-weight:bold">90% Damage Temp : ' + parseInt(data[variety]['T90'][idx],10) + '</span>';
                    }
                    if (item.series.name === 'Min Temp Forecast') {
                        idx = item.point.index + idxFirstFcst;
                        //console.log(idx, idxFirstFcst);
                        tips += '<br/><span style="color:#000000;font-size:12px;font-weight:bold">Stage           : ' + stage_labels[ data[variety]['stage'][idx] ] + '</span>';
                        tips += '<br/><span style="color:#0000FF;font-size:12px;font-weight:bold">Min Temp Fcst : ' + parseInt(data[variety]['mint'][idx],10) + '</span>';
                        tips += '<br/><span style="color:#1E90FF;font-size:12px;font-weight:bold">10% Damage Fcst : ' + parseInt(data[variety]['T10'][idx],10) + '</span>';
                        tips += '<br/><span style="color:#FFD700;font-size:12px;font-weight:bold">50% Damage Fcst : ' + parseInt(data[variety]['T50'][idx],10) + '</span>';
                        tips += '<br/><span style="color:#FF0000;font-size:12px;font-weight:bold">90% Damage Fcst : ' + parseInt(data[variety]['T90'][idx],10) + '</span>';
                    }
                }
                return header + tips;
            }

            const afterRender = (chart) => { chart.renderer.text('30-Day Results', 325, 85).css({ color:"#000000", fontSize:"16px"}).add() };

            var chartConfig = {
                 plotOptions: {
                     line: {
                         animation: true,
                     },
                     series: {
                         type: 'line',
                         step: true,
                         pointStart: Date.UTC(firstYearOfSeason,8,1),
                         pointInterval: 24*3600*1000,
                         animation: { duration: 800 },
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                         },
                     }
                 },
                 chart: { height: 460, width: 700, marginTop: 60, marginRight: 14, backgroundColor: null },
                 title: {
                     text: apple_labels[this.props.store.app.getAppleVariety] + ' Apple Freeze Damage Potential'
                 },
                 subtitle: {
                     text: '@ ' + this.props.store.app.getAddress,
                     style:{"font-size":"14px",color:"#000000"},
                 },
                 exporting: {
                   chartOptions: {
                     chart: {
                       backgroundColor: '#ffffff'
                     }
                   }
                 },
                 tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
                   style:{width:165,}, xDateFormat:"%b %d, %Y", positioner:function(){return {x:80, y:60}}, shape: 'rect',
                   crosshairs: { width:1, color:"#ff0000", snap:true, zIndex:10 }, formatter:tooltipFormatter },
                 credits: { text:"Powered by NRCC", href:"http://www.nrcc.cornell.edu/", color:"#000000" },
                 legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 60, y: 50 },
                 xAxis: { type: 'datetime', startOnTick: true, endOnTick: false, min: getXaxisMin(), max: getXaxisMax(), labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
                 yAxis: { title:{ text:'Temperature (°F)', style:{"font-size":"14px", color:"#000000"}}, gridZIndex:4, labels:{style:{color:"#000000"}}},
                 series: [{
                     name: 'Stage',           data: data[variety]['stage'], color: '#1E90FF', showInLegend: false, visible: false },{
                     name: 'Min Temperature', data: data[variety]['mint'].slice(0,idxFirstFcst),  color: '#0000FF', step: false, lineWidth: 2, marker: { enabled: false } },{
                     name: 'Min Temp Forecast', pointStart: firstFcstDate, data: data[variety]['mint'].slice(idxFirstFcst),  dashStyle: 'dot', color: '#0000FF', step: false, lineWidth: 2, marker: { enabled: true }, showInLegend: fcstInView() },{
                     name: '10% Damage Temp', data: data[variety]['T10'].slice(0,idxFirstFcst),   color: '#1E90FF', showInLegend: false, visible: false },{
                     name: '10% Damage Fcst', pointStart: firstFcstDate, data: data[variety]['T10'].slice(idxFirstFcst), dashStyle: 'dot', color: '#1E90FF', lineWidth: 2, marker: { enabled: true }, showInLegend: false, visible: false },{
                     name: '50% Damage Temp', data: data[variety]['T50'].slice(0,idxFirstFcst),   color: '#FFD700', lineWidth: 2 },{
                     name: '50% Damage Fcst', pointStart: firstFcstDate, data: data[variety]['T50'].slice(idxFirstFcst), dashStyle: 'dot', color: '#FFD700', lineWidth: 2, marker: { enabled: true }, showInLegend: fcstInView() },{
                     name: '90% Damage Temp', data: data[variety]['T90'].slice(0,idxFirstFcst),   color: '#FF0000', showInLegend: false, visible: false },{
                     name: '90% Damage Fcst', pointStart: firstFcstDate, data: data[variety]['T90'].slice(idxFirstFcst), dashStyle: 'dot', color: '#FF0000', lineWidth: 2, marker: { enabled: true }, showInLegend: false, visible: false }
                 ]
            };

            return (
                <div className='trend-display-active'>
                  <Loader message={spinner} show={this.props.store.app.getLoaderData} priority={10} backgroundStyle={{backgroundColor: null}} hideContentOnLoad={true}>
                    <div className="trend-display-content">
                      <ReactHighcharts config={ chartConfig } callback={afterRender} isPureConfig />
                    </div>
                  </Loader>
                </div>
            )

        } else {
            return(false)
        }
  }

};

export default DisplayTrend;
