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

import '../../styles/AppleRadioSelect.css';

@inject("store") @observer
class AppleRadioSelect extends Component {

  labelEmpire = () => {
      return this.props.store.app.empireIsAvailable ? "Empire" : "Empire *"
  }

  labelMcIntosh = () => {
      return this.props.store.app.mcintoshIsAvailable ? "McIntosh" : "McIntosh *"
  }

  labelRedDelicious = () => {
      return this.props.store.app.reddeliciousIsAvailable ? "Red Delicious" : "Red Delicious *"
  }

  radioMessageClass = () => {
      if (this.props.store.app.getChartData === null) { return "radio-disabled-message" }
      return Object.keys(this.props.store.app.getChartData).length < 3 ? "radio-disabled-message" : "radio-disabled-message-display-none"
  }

  render() {
        return (
            <div className='radio-input-div'>
            <div className='radio-input-label'>
                <label><b>Apple Variety</b></label>
            </div>
            <div className='radio-div'>
                <form>
                  <div className="radio">
                    <input type="radio" value="empire" id="empire"
                          disabled={!this.props.store.app.empireIsAvailable}
                          checked={this.props.store.app.getAppleVariety === 'empire'} 
                          onChange={this.props.store.app.updateAppleVariety} />
                    <label for="empire">
                      {this.labelEmpire()}
                    </label>
                  </div>
                  <div className="radio">
                    <input type="radio" value="mac_geneva" id="mac_geneva"
                          disabled={!this.props.store.app.mcintoshIsAvailable}
                          checked={this.props.store.app.getAppleVariety === 'mac_geneva'} 
                          onChange={this.props.store.app.updateAppleVariety} />
                    <label for="mac_geneva">
                      {this.labelMcIntosh()}
                    </label>
                  </div>
                  <div className="radio">
                    <input type="radio" value="red_delicious" id="red_delicious"
                          disabled={!this.props.store.app.reddeliciousIsAvailable}
                          checked={this.props.store.app.getAppleVariety === 'red_delicious'} 
                          onChange={this.props.store.app.updateAppleVariety} />
                    <label for="red_delicious">
                      {this.labelRedDelicious()}
                    </label>
                  </div>
                  <div className={this.radioMessageClass()}>
                    * variety currently unavailable
                  </div>
                </form>
            </div>
            </div>
        )
  }

};

export default AppleRadioSelect;
