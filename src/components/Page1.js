import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectBook } from "../actions/book";
import uuid from "uuid";
import { uniqueId } from "lodash";
class Page1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view1: {
        metrics: 'ga:sessions',
        dimensions: 'ga:browser',
        startDate: '30daysAgo',
        endDate: 'yesterday',
        pieHole: 0.3
      },
      view2: {
        metrics: 'ga:sessions',
        dimensions: 'ga:country',
        startDate: '30daysAgo',
        endDate: 'yesterday',
        pieHole: 0.5
      }
    };
  }

  // 更新state 時候重新render
  componentDidUpdate()
  {
    this.renderView();
  }

  componentDidMount()
  {
    this.renderView();
  }

  renderView()
  {
    const _this = this;
    gapi.analytics.ready(function() {
      /**
       * Create a new ViewSelector instance to be rendered inside of an
       * element with the id "view-selector-container".
       */
      var viewSelector1 = new gapi.analytics.ViewSelector({
        container: "view-selector-container-1"
      });

      var viewSelector2 = new gapi.analytics.ViewSelector({
        container: "view-selector-container-2"
      });

      // Render the view selector to the page.
      viewSelector1.execute();
      viewSelector2.execute();
      // viewSelector3.execute();

      /**
       * Create a new DataChart instance with the given query parameters
       * and Google chart options. It will be rendered inside an element
       * with the id "chart-container".
       */

      // 設定圖表顯示資料參數
      // 可以顯示不同維度的資料
      // dimensions => ga:date 、 ga:country
      // 可以選擇起始結束日期
      var dataChart1 = new gapi.analytics.googleCharts.DataChart({
        query: {
          metrics: _this.state.view1.metrics,
          dimensions: _this.state.view1.dimensions,
          "start-date": _this.state.view1.startDate,
          "end-date": _this.state.view1.endDate,
          "max-results": 6,
          sort: "-ga:sessions"
        },
        chart: {
          container: "chart-container-1",
          type: "PIE",
          options: {
            width: "100%",
            pieHole:  _this.state.view1.pieHole
          }
        }
      });

      // 圓餅圖
      var dataChart2 = new gapi.analytics.googleCharts.DataChart({
        query: {
          metrics: _this.state.view2.metrics,
          dimensions: _this.state.view2.dimensions,
          "start-date": _this.state.view2.startDate,
          "end-date": _this.state.view2.endDate,
          "max-results": 6,
          sort: "-ga:sessions"
        },
        chart: {
          container: "chart-container-2",
          type: "PIE",
          options: {
            width: "100%",
            pieHole: _this.state.view2.pieHole
          }
        }
      });

      viewSelector1.on("change", function(ids) {
        dataChart1
          .set({
            query: {
              ids: ids
            }
          })
          .execute();
      });

      viewSelector2.on("change", function(ids) {
        dataChart2
          .set({
            query: {
              ids: ids
            }
          })
          .execute();
      });
    });
  }

  updateView()
  {
    this.setState((prevState, props) => {
      return {
        view1: {
          metrics: this.metrics1.value,
          dimensions: this.dimensions1.value,
          startDate: this.startDate1.value,
          endDate: this.endDate1.value,
          pieHole: this.pieHole1.value
        },
        view2: {
          metrics: this.metrics2.value,
          dimensions: this.dimensions2.value,
          startDate: this.startDate2.value,
          endDate: this.endDate2.value,
          pieHole: this.pieHole2.value
        }
      };
    });
  }

  render() {
    return (
      <div className="main">
        <h1>圓餅圖 / 30天</h1>
        <h2>瀏覽器數量百分比</h2>
        <p>metrics: <input type="text" ref={(e) => { this.metrics1 = e; }} defaultValue={this.state.view1.metrics}/></p>
        <p>dimensions: <input type="text" ref={(e) => { this.dimensions1 = e; }} defaultValue={this.state.view1.dimensions}/></p>
        <p>startDate: <input type="text" ref={(e) => { this.startDate1 = e; }} defaultValue={this.state.view1.startDate}/></p>
        <p>endDate: <input type="text" ref={(e) => { this.endDate1 = e; }} defaultValue={this.state.view1.endDate}/></p>
        <p>pieHole: <input type="text" ref={(e) => { this.pieHole1 = e; }} defaultValue={this.state.view1.pieHole}/></p>
        <input type="button" value="update" onClick={()=>this.updateView()}/>
        <div id="chart-container-1" />
        <div id="view-selector-container-1" />

        <h2>觀看地區數量百分比</h2>
        <p>metrics: <input type="text" ref={(e) => { this.metrics2 = e; }} defaultValue={this.state.view2.metrics}/></p>
        <p>dimensions: <input type="text" ref={(e) => { this.dimensions2 = e; }} defaultValue={this.state.view2.dimensions}/></p>
        <p>startDate: <input type="text" ref={(e) => { this.startDate2 = e; }} defaultValue={this.state.view2.startDate}/></p>
        <p>endDate: <input type="text" ref={(e) => { this.endDate2 = e; }} defaultValue={this.state.view2.endDate}/></p>
        <p>pieHole: <input type="text" ref={(e) => { this.pieHole2 = e; }} defaultValue={this.state.view2.pieHole}/></p>
        <input type="button" value="update" onClick={()=>this.updateView()}/>
        <div id="chart-container-2" />
        <div id="view-selector-container-2" />
      </div>
    );
  }
}
function mapStateToProps({ book }) {
  return { book };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectBook }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Page1);
