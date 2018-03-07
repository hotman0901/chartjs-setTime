import React, { Component } from "react";
class Page2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view1: {
        metrics: "ga:sessions",
        dimensions: "ga:date",
        startDate: "30daysAgo",
        endDate: "yesterday"
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
      /**
       * Create a new ViewSelector instance to be rendered inside of an
       * element with the id "view-selector-container".
       */
      var viewSelector = new gapi.analytics.ViewSelector({
        container: "view-selector-container"
      });

      var viewSelector2 = new gapi.analytics.ViewSelector({
        container: "view-selector-container-2"
      });

      // Render the view selector to the page.
      viewSelector.execute();

      viewSelector2.execute();

      /**
       * Create a new DataChart instance with the given query parameters
       * and Google chart options. It will be rendered inside an element
       * with the id "chart-container".
       */
      var dataChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          metrics: _this.state.view1.metrics,
          dimensions: _this.state.view1.dimensions,
          "start-date": _this.state.view1.startDate,
          "end-date": _this.state.view1.endDate
        },
        chart: {
          container: "chart-container",
          type: "LINE",
          options: {
            width: "100%"
            // pointShape: { type: 'star', sides: 4 },
            // pointSize: 30,
          }
        }
      });

      // 選擇瀏覽器
      var mainChart2 = new gapi.analytics.googleCharts.DataChart({
        query: {
          dimensions: "ga:browser",
          metrics: "ga:sessions",
          sort: "-ga:sessions",
          "max-results": "6"
        },
        chart: {
          type: "TABLE",
          container: "main-chart-container-2",
          options: {
            width: "100%"
          }
        }
      });

      // 圖表顯示
      var breakdownChart2 = new gapi.analytics.googleCharts.DataChart({
        query: {
          dimensions: "ga:date",
          metrics: "ga:sessions",
          "start-date": "7daysAgo",
          "end-date": "yesterday"
        },
        chart: {
          type: "LINE",
          container: "breakdown-chart-container-2",
          options: {
            width: "100%"
          }
        }
      });

      /**
       * Render the dataChart on the page whenever a new view is selected.
       */
      viewSelector.on("change", function(ids) {
        dataChart
          .set({
            query: {
              ids: ids
            }
          })
          .execute();
      });

      /**
       * Store a refernce to the row click listener variable so it can be
        * removed later to prevent leaking memory when the chart instance is
        * replaced.
        */
      var mainChartRowClickListener2;

      /**
       * Update both charts whenever the selected view changes.
       */
      viewSelector2.on("change", function(ids) {
        var options = {
          query: {
            ids: ids
          }
        };

        // Clean up any event listeners registered on the main chart before
        // rendering a new one.
        if (mainChartRowClickListener2) {
          google.visualization.events.removeListener(
            mainChartRowClickListener2
          );
        }

        mainChart2.set(options).execute();
        breakdownChart2.set(options);

        // Only render the breakdown chart if a browser filter has been set.
        if (breakdownChart2.get().query.filters) breakdownChart2.execute();
      });

      /**
       * Each time the main chart is rendered, add an event listener to it so
       * that when the user clicks on a row, the line chart is updated with
       * the data from the browser in the clicked row.
       */
      mainChart2.on("success", function(response) {
        var chart = response.chart;
        var dataTable = response.dataTable;

        // Store a reference to this listener so it can be cleaned up later.
        mainChartRowClickListener2 = google.visualization.events.addListener(
          chart,
          "select",
          function(event) {
            // When you unselect a row, the "select" event still fires
            // but the selection is empty. Ignore that case.
            if (!chart.getSelection().length) return;

            var row = chart.getSelection()[0].row;
            var browser = dataTable.getValue(row, 0);
            var options = {
              query: {
                filters: "ga:browser==" + browser
              },
              chart: {
                options: {
                  title: browser
                }
              }
            };

            breakdownChart2.set(options).execute();
          }
        );
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
          endDate: this.endDate1.value
        }
      };
    });
  }

  render() {
    return (
      <div className="main">
        <h1>折線圖 / 30天</h1>
        <h2>每日登入人數數量</h2>
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
        <input type="button" value="update" onClick={() => this.updateView()} />
        <div id="chart-container" />
        <div id="view-selector-container" />

        <h2>瀏覽器登入數量</h2>
        <div id="main-chart-container-2" />
        <div id="breakdown-chart-container-2" />
        <div id="view-selector-container-2" />
      </div>
    );
  }
}

export default Page2;
