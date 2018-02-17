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

import '../../styles/PastYearMessage.css';

@inject("store") @observer
class PastYearMessage extends Component {

  render() {
        const pastYearMessageClassName = this.props.store.app.getSeason[1]===2018 ? 'past-year-message-hide' : 'past-year-message-show';
        return (
            <div className={pastYearMessageClassName}>
              <div className="past-year-message-content">
                Viewing {this.props.store.app.getSeason[0]}-{this.props.store.app.getSeason[1]} results.
              </div>
            </div>
        )
  }

};

export default PastYearMessage;
