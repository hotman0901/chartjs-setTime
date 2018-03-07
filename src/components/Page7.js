import React, { Component } from "react";
import update from "immutability-helper";
import { ids } from "../config/config";
import { Doughnut, Line } from "react-chartjs-2";
import moment from "moment";
import { filter, orderBy } from "lodash";
import equal from "deep-equal";

// 圓餅圖的顏色
const backgroundColor = ["#ffc53a", "#f24f4f", "#2faded"];
class Page7 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "aaa",
      circle: {
        dou: {
          labels: ["Chrome", "Firefox", "Safari"],
          datasets: [
            {
              label: "# of Session",
              data: [300, 50, 100],
              backgroundColor,
              borderColor: "red"
            }
          ]
        },
        chartOptions: {
          legend: {
            display: false
          },
          elements: {
            arc: {
              borderWidth: 0
            }
          }
        }
      },
      line: {
        dou: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
          fill: false,
          datasets: [
            {
              label: "# of chrome",
              data: [1, 0, 0, 0, 0, 0],
              borderColor: "#ffc53a"
            },
            {
              label: "# of firefox",
              data: [0, 2, 0, 0, 0, 0],
              borderColor: "#f24f4f"
            },
            {
              label: "# of safari",
              data: [0, 0, 3, 0, 0, 0],
              borderColor: "#2faded"
            }
          ]
        },
        chartOptions: {
          legend: {
            display: false
          },
          elements: {
            arc: {
              borderWidth: 0
            }
          }
        }
      }
    };

    this.benny = this.benny.bind(this);
    // this.open = this.open.bind(this);
  }

  shouldComponentUpdate(nextState) {
    if (!equal(this.state, nextState)) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    let _self = this;
    gapi.analytics.ready(function() {
      // 透過api撈取資料 經緯度設定sessions、browser
      // 如果要顯示多個dimensions的資訊用逗號分隔
      const report = new gapi.analytics.report.Data({
        query: {
          ids,
          metrics: "ga:sessions",
          dimensions: "ga:browser, ga:date",
          "start-date": "7daysAgo",
          "end-date": "today"
        }
      });

      // get 取得設定資訊
      // console.log(report.get())

      // 取得query的資料
      report.on("success", function(response) {
        console.log(response.rows);
        // 取得成功後，在這去繪製圖表
        // label 改成前七天範圍
        let days = [];
        let i;
        for (i = 0; i < 7; i++) {
          let date = moment()
            .subtract(i, "days")
            .format("YYYYMMDD");
          days = [...days, date];
        }
        _self.setState(
          update(_self.state, {
            line: {
              dou: {
                labels: { $set: days.sort() }
              }
            }
          })
        );
        // 撈出各別的瀏覽器
        const chrome = filter(response.rows, obj => {
          return obj[0] === "Chrome";
        });

        const firefox = filter(response.rows, obj => {
          return obj[0] === "Firefox";
        });

        const safari = filter(response.rows, obj => {
          return obj[0] === "Safari";
        });

        // 先預設每天的瀏覽人氣為0
        let chromeData = [0, 0, 0, 0, 0, 0, 0];
        let firefoxData = [0, 0, 0, 0, 0, 0, 0];
        let safariData = [0, 0, 0, 0, 0, 0, 0];

        // 替換該日期的位置
        let j;
        for (j = 0; j < days.length; j++) {
          chrome.forEach((element, index) => {
            if (days[j] === element[1]) {
              chromeData[j] = element[2];
            }
          });

          firefox.forEach((element, index) => {
            if (days[j] === element[1]) {
              firefoxData[j] = element[2];
            }
          });

          safari.forEach((element, index) => {
            if (days[j] === element[1]) {
              safariData[j] = element[2];
            }
          });
        }

        // 目前的dataset
        let lineDate = _self.state.line.dou.datasets;
        // 將替換好的data update回去
        lineDate[0].data = chromeData;
        lineDate[1].data = firefoxData;
        lineDate[2].data = safariData;

        let circleData = _self.state.circle.dou.datasets;

        let cTotal = 0;
        let fTotal = 0;
        let sTotal = 0;
        chrome.forEach((element, index) => {
          cTotal += Number(element[2]);
        });
        firefox.forEach((element, index) => {
          fTotal += Number(element[2]);
        });
        safari.forEach((element, index) => {
          sTotal += Number(element[2]);
        });
        circleData[0].data[0] = cTotal;
        circleData[0].data[1] = fTotal;
        circleData[0].data[2] = sTotal;

        // 更新state
        _self.setState(
          update(_self.state, {
            line: {
              dou: {
                datasets: { $set: lineDate }
              }
            },
            circle: {
              dou: {
                datasets: { $set: circleData }
              }
            }
          })
        );
      });
      report.execute();
    });

    var evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: 227.67999267578125,
      clientY: 32
    });
    this.line.chartInstance.canvas.dispatchEvent(evt);
  }

  benny() {
    let meta = this.line.chartInstance.getDatasetMeta(1);
    console.log(this.line.chartInstance.tooltip);
    // meta.data[1].click;
    // console.log(meta.controller._data.click())

    // meta.controller._data.click()

    // var evt = new MouseEvent("click", {
    //   view: window,
    //   bubbles: true,
    //   cancelable: true,
    //   clientX: 227.67999267578125,
    //   clientY: 32
    // });
    // this.line.chartInstance.canvas.dispatchEvent(evt);
  }

  setTime() {
    // 每個資料的時間各別顯示的時間長度
    const time = [1000, 10000, 3000, 4000, 5000];
    let obj = this.line.chartInstance;
    for (let index in time) {
      var j = Number(index);

      (function(num, oChart) {
        let all = 0;
        for (let i = 0; i < num + 1; i++) {
          all += time[i];
        }
        setTimeout(() => {
          var activeElements = [];
          var requestedElem = oChart.getDatasetMeta(1).data[num];
          activeElements.push(requestedElem);
          oChart.tooltip._active = activeElements;
          oChart.tooltip.update(true);
          oChart.draw();
        }, all - time[num]);
      })(j, obj);
    }

    // 最後一個時間到清除
    (function(oChart) {
      let last = 0;
      for (let i = 0; i < time.length; i++) {
        last += time[i];
      }
      setTimeout(() => {
        var activeElements = [];
        oChart.tooltip._active = activeElements;
        oChart.tooltip.update(true);
        oChart.draw();
      }, last);
    })(obj);
  }


  open(idx) {
    let meta = this.line.chartInstance;
    this.openTip(meta, 1, idx);
  }

  close(idx) {
    let meta = this.line.chartInstance;
    this.closeTip(meta, 1, idx);
  }

  openTip(oChart, datasetIndex, pointIndex) {
    if (oChart.tooltip._active == undefined) oChart.tooltip._active = [];
    var activeElements = oChart.tooltip._active;
    var requestedElem = oChart.getDatasetMeta(datasetIndex).data[pointIndex];
    for (var i = 0; i < activeElements.length; i++) {
      if (requestedElem._index == activeElements[i]._index) return;
    }
    activeElements.push(requestedElem);
    oChart.tooltip._active = activeElements;
    oChart.tooltip.update(true);
    oChart.draw();
  }

  closeTip(oChart, datasetIndex, pointIndex) {
    console.log("close:", pointIndex);

    var activeElements = oChart.tooltip._active;
    if (activeElements == undefined || activeElements.length == 0) return;
    var requestedElem = oChart.getDatasetMeta(datasetIndex).data[pointIndex];
    for (var i = 0; i < activeElements.length; i++) {
      if (requestedElem._index == activeElements[i]._index) {
        activeElements.splice(i, 1);
        break;
      }
    }
    oChart.tooltip._active = activeElements;
    oChart.tooltip.update(true);
    oChart.draw();
  }
  render() {
    return (
      <div className="main">
        <br />
        <h1>Report.Data / 7天</h1>
        <h2>Use react-chartjs-2</h2>
        <Doughnut
          data={this.state.circle.dou}
          width={100}
          height={30}
          options={this.state.circle.chartOptions}
        />
        <input
          type="button"
          value="setInterval"
          onClick={() => this.setTime()}
        />
        <br />
        <input type="button" value="show1" onClick={() => this.open(0)} />
        <input type="button" value="show2" onClick={() => this.open(1)} />
        <input type="button" value="show3" onClick={() => this.open(2)} />
        <input type="button" value="show4" onClick={() => this.open(3)} />
        <input type="button" value="show5" onClick={() => this.open(4)} />

        <br />
        <input type="button" value="close1" onClick={() => this.close(0)} />
        <input type="button" value="close2" onClick={() => this.close(1)} />
        <input type="button" value="close3" onClick={() => this.close(2)} />
        <input type="button" value="close4" onClick={() => this.close(3)} />
        <input type="button" value="close5" onClick={() => this.close(4)} />
        <br />
        <Line
          ref={e => {
            this.line = e;
          }}
          data={this.state.line.dou}
          width={100}
          height={30}
          onElementsClick={this.benny}
        />
      </div>
    );
  }
}

export default Page7;
