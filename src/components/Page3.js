import React, { Component } from "react";
class Page3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view1: {
        metrics: "ga:bounceRate",
        dimensions: "ga:date",
        startDate: "30daysAgo",
        endDate: "yesterday",
        type: "COLUMN"
      }
    };
  }

  componentDidUpdate() {
    this.renderView();
  }

  componentDidMount() {
    this.renderView();
  }

  renderView() {
    const _this = this;
    gapi.analytics.ready(function() {
      var viewSelector = new gapi.analytics.ViewSelector({
        container: "view-selector-container"
      });

      viewSelector.execute();

      var dataChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          metrics: _this.state.view1.metrics,
          dimensions: _this.state.view1.dimensions,
          "start-date": _this.state.view1.startDate,
          "end-date": _this.state.view1.endDate
        },
        chart: {
          container: "chart-container",
          type: _this.state.view1.type,
          options: {
            width: "100%"
          }
        }
      });
      viewSelector.on("change", function(ids) {
        dataChart
          .set({
            query: {
              ids: ids
            }
          })
          .execute();
      });
    });
  }

  updateView() {
    this.setState((prevState, props) => {
      return {
        view1: {
          metrics: this.metrics1.value,
          dimensions: this.dimensions1.value,
          startDate: this.startDate1.value,
          endDate: this.endDate1.value,
          type: this.type1.value
        }
      };
    });
  }

  render() {
    return (
      <div className="main">
        <h1>Y軸長條圖 / 30天</h1>
        <h2>跳出率(訪客進入你的網站後只瀏覽了一個網頁就離開的訪客百分比)</h2>
        <p>
          metrics:{" "}
          <input
            type="text"
            ref={e => {
              this.metrics1 = e;
            }}
            defaultValue={this.state.view1.metrics}
          />
        </p>
        <p>
          dimensions:{" "}
          <input
            type="text"
            ref={e => {
              this.dimensions1 = e;
            }}
            defaultValue={this.state.view1.dimensions}
          />
        </p>
        <p>
          startDate:{" "}
          <input
            type="text"
            ref={e => {
              this.startDate1 = e;
            }}
            defaultValue={this.state.view1.startDate}
          />
        </p>
        <p>
          endDate:{" "}
          <input
            type="text"
            ref={e => {
              this.endDate1 = e;
            }}
            defaultValue={this.state.view1.endDate}
          />
        </p>
        <p>
          type:{" "}
          <input
            type="text"
            ref={e => {
              this.type1 = e;
            }}
            defaultValue={this.state.view1.type}
          />
        </p>
        <input type="button" value="update" onClick={() => this.updateView()} />
        <div id="chart-container" />
        <div id="view-selector-container" />
      </div>
    );
  }
}

export default Page3;
