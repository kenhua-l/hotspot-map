var XChartManager = XChartManager || {};
XChartManager = {
    SelectedRegion: "North",
    //SelectedChartName: "PM<sub>2.5</sub> sub-index",
    SelectedChartName: "1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)",
    PSIData: { "North": 0, "South": 0, "East": 0, "West": 0, "Central": 0 },
    TooltipImagePath: { "North": "", "South": "", "East": "", "West": "", "Central": "" },
    FootNote: {
        "1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)": "* computed based on <u>1-hour</u> average PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)",
        "PM<sub>2.5</sub> sub-index": "* computed based on <u>24-hour</u> average PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)",
        "PM<sub>10</sub> sub-index": "* computed based on <u>24-hour</u> average PM<sub>10</sub> reading (&micro;g/m<sup>3</sup>)",
        "SO<sub>2</sub> sub-index": "* computed based on <u>24-hour</u> average Sulphur Dioxide reading (&micro;g/m<sup>3</sup>)",
        "O<sub>3</sub> sub-index": "* computed based on <u>8-hour</u> average Ozone reading (&micro;g/m<sup>3</sup>)",
        "CO sub-index": "* computed based on <u>8-hour</u> average Carbon Monoxide reading (mg/m<sup>3</sup>)",
        "NO<sub>2</sub> sub-index": "* computed based on <u>1-hour</u> average Nitrogen Dioxide reading (&micro;g/m<sup>3</sup>)<br />Sub-index for nitrogen dioxide is reported only when the <u>1-hour</u> concentration equals or exceeds 1130 &#956;g/m<sup>3</sup>."
    },

    ChartData: {
        "PM<sub>2.5</sub> sub-index": null,
        "1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)": null,
        "PM<sub>10</sub> sub-index": null,
        "SO<sub>2</sub> sub-index": null,
        "O<sub>3</sub> sub-index": null,
        "CO sub-index": null,
        "NO<sub>2</sub> sub-index": null
    },
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    LoadAirQuality: function () {
        var that = this;
        var timestamp = window.GetNeaTimeStamp(window.GenerateGuid());
        jQuery("span.panel-stats-timing").html("");
        return new Promise(function (resolve, reject) {
            var ajaxPromise = new Promise(function (resolve, reject) {
                var hasZeroValue = false;
                var finalResult;

                jQuery.ajax({
                    url: "/api/airquality/jsondata/" + timestamp,
                    async: false,
                    success: function (result) {
                        XChartManager.Categories = result.Categories;

                        XChartManager.Categories[1] = "";
                        XChartManager.Categories[2] = "";
                        XChartManager.Categories[4] = "";
                        XChartManager.Categories[5] = "";
                        XChartManager.Categories[6] = "";
                        XChartManager.Categories[8] = "";
                        XChartManager.Categories[9] = "";
                        XChartManager.Categories[10] = "";
                        XChartManager.Categories[12] = "";
                        XChartManager.Categories[13] = "";
                        XChartManager.Categories[14] = "";
                        XChartManager.Categories[16] = "";
                        XChartManager.Categories[17] = "";
                        XChartManager.Categories[18] = "";
                        XChartManager.Categories[20] = "";
                        XChartManager.Categories[21] = "";
                        XChartManager.Categories[22] = "";

                        for (var property in result) {
                            if (typeof (result[property]) === 'object') {
                                for (var inner_property in result[property]) {
                                    if (property === 'Chart1HRPM25'
                                        || property === 'ChartCO'
                                        //|| property === 'ChartNO2'
                                        || property === 'ChartO3'
                                        || property === 'ChartPM10'
                                        || property === 'ChartPM25'
                                        || property === 'ChartSO2') {
                                        if (inner_property !== 'DivId') {
                                            if (result[property][inner_property].Data[result[property][inner_property].Data.length - 1].value === 0
                                                || result[property][inner_property].Data[result[property][inner_property].Data.length - 1].value === null) {
                                                hasZeroValue = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (hasZeroValue)
                                break;
                        }

                        finalResult = result;
                    },
                    complete: function () {
                        resolve({ hasZeroValue, finalResult });
                    }
                });
            });

            ajaxPromise.then(function (obj) {
                var result = obj.finalResult;
                if (obj.hasZeroValue) {

                    console.log('Has missing value');

                    var year = new Date().getFullYear();
                    var month = new Date().getMonth() + 1;
                    month = month < 10 ? ('0' + month) : month;
                    var date = new Date().getDate();
                    date = date < 10 ? ('0' + date) : date;
                    var fullDay = year + '-' + month + '-' + date;
                    var epochTime = Math.round(new Date().getTime() / 1000);

                    var psiApiUrl = 'https://api.data.gov.sg/v1/environment/psi?date=' + fullDay + '&time=' + epochTime;
                    var pm25ApiUrl = 'https://api.data.gov.sg/v1/environment/pm25?date=' + fullDay + '&time=' + epochTime;

                    return new Promise(function (resolve, reject) {
                        $.get(psiApiUrl, function (data) {
                            var latestPsi = data.items[data.items.length - 1];

                            if (typeof latestPsi === 'undefined' || latestPsi === null ||
                                typeof latestPsi.readings === 'undefined' || latestPsi.readings === null) {
                                return;
                            } else {
                                // PM25 Sub Index
                                that.SetPsi24DataGovValue(result.ChartPM25.Central.Data[result.ChartPM25.Central.Data.length - 1], latestPsi.readings.pm25_sub_index.central);
                                that.SetPsi24DataGovValue(result.ChartPM25.East.Data[result.ChartPM25.East.Data.length - 1], latestPsi.readings.pm25_sub_index.east);
                                that.SetPsi24DataGovValue(result.ChartPM25.West.Data[result.ChartPM25.West.Data.length - 1], latestPsi.readings.pm25_sub_index.west);
                                that.SetPsi24DataGovValue(result.ChartPM25.North.Data[result.ChartPM25.North.Data.length - 1], latestPsi.readings.pm25_sub_index.north);
                                that.SetPsi24DataGovValue(result.ChartPM25.South.Data[result.ChartPM25.South.Data.length - 1], latestPsi.readings.pm25_sub_index.south);

                                // PM10 Sub Index
                                that.SetPsi24DataGovValue(result.ChartPM10.Central.Data[result.ChartPM10.Central.Data.length - 1], latestPsi.readings.pm10_sub_index.central);
                                that.SetPsi24DataGovValue(result.ChartPM10.East.Data[result.ChartPM10.East.Data.length - 1], latestPsi.readings.pm10_sub_index.east);
                                that.SetPsi24DataGovValue(result.ChartPM10.West.Data[result.ChartPM10.West.Data.length - 1], latestPsi.readings.pm10_sub_index.west);
                                that.SetPsi24DataGovValue(result.ChartPM10.North.Data[result.ChartPM10.North.Data.length - 1], latestPsi.readings.pm10_sub_index.north);
                                that.SetPsi24DataGovValue(result.ChartPM10.South.Data[result.ChartPM10.South.Data.length - 1], latestPsi.readings.pm10_sub_index.south);

                                // SO2 Sub Index
                                that.SetPsi24DataGovValue(result.ChartSO2.Central.Data[result.ChartSO2.Central.Data.length - 1], latestPsi.readings.so2_sub_index.central);
                                that.SetPsi24DataGovValue(result.ChartSO2.East.Data[result.ChartSO2.East.Data.length - 1], latestPsi.readings.so2_sub_index.east);
                                that.SetPsi24DataGovValue(result.ChartSO2.West.Data[result.ChartSO2.West.Data.length - 1], latestPsi.readings.so2_sub_index.west);
                                that.SetPsi24DataGovValue(result.ChartSO2.North.Data[result.ChartSO2.North.Data.length - 1], latestPsi.readings.so2_sub_index.north);
                                that.SetPsi24DataGovValue(result.ChartSO2.South.Data[result.ChartSO2.South.Data.length - 1], latestPsi.readings.so2_sub_index.south);

                                // O3 Sub Index
                                that.SetPsi24DataGovValue(result.ChartO3.Central.Data[result.ChartO3.Central.Data.length - 1], latestPsi.readings.o3_sub_index.central);
                                that.SetPsi24DataGovValue(result.ChartO3.East.Data[result.ChartO3.East.Data.length - 1], latestPsi.readings.o3_sub_index.east);
                                that.SetPsi24DataGovValue(result.ChartO3.West.Data[result.ChartO3.West.Data.length - 1], latestPsi.readings.o3_sub_index.west);
                                that.SetPsi24DataGovValue(result.ChartO3.North.Data[result.ChartO3.North.Data.length - 1], latestPsi.readings.o3_sub_index.north);
                                that.SetPsi24DataGovValue(result.ChartO3.South.Data[result.ChartO3.South.Data.length - 1], latestPsi.readings.o3_sub_index.south);

                                // CO Sub Index
                                that.SetPsi24DataGovValue(result.ChartCO.Central.Data[result.ChartCO.Central.Data.length - 1], latestPsi.readings.co_sub_index.central);
                                that.SetPsi24DataGovValue(result.ChartCO.East.Data[result.ChartCO.East.Data.length - 1], latestPsi.readings.co_sub_index.east);
                                that.SetPsi24DataGovValue(result.ChartCO.West.Data[result.ChartCO.West.Data.length - 1], latestPsi.readings.co_sub_index.west);
                                that.SetPsi24DataGovValue(result.ChartCO.North.Data[result.ChartCO.North.Data.length - 1], latestPsi.readings.co_sub_index.north);
                                that.SetPsi24DataGovValue(result.ChartCO.South.Data[result.ChartCO.South.Data.length - 1], latestPsi.readings.co_sub_index.south);

                                // NO2
                                // 0 Value
                            }

                        }).fail(function (fail) {
                            console.log('fail to load psi chart');
                        }).always(function () {
                            XChartManager.ChartData["PM<sub>2.5</sub> sub-index"] = result.ChartPM25;
                            XChartManager.ChartData["PM<sub>10</sub> sub-index"] = result.ChartPM10;
                            XChartManager.ChartData["SO<sub>2</sub> sub-index"] = result.ChartSO2;
                            XChartManager.ChartData["O<sub>3</sub> sub-index"] = result.ChartO3;
                            XChartManager.ChartData["CO sub-index"] = result.ChartCO;
                            XChartManager.ChartData["NO<sub>2</sub> sub-index"] = result.ChartNO2;

                            if (result.ChartAsOfDate == null) result.ChartAsOfDate = "";
                            jQuery("span.panel-stats-timing").html("At " + result.ChartAsOfDate);
                            resolve();
                        });
                    }).then(function () {
                        $.get(pm25ApiUrl, function (data) {
                            var latestPsi = data.items[data.items.length - 1];

                            if (typeof latestPsi === 'undefined' || latestPsi === null ||
                                typeof latestPsi.readings === 'undefined' || latestPsi.readings === null) {
                                return;
                            } else {
                                that.SetPsi1DataGovValue(result.Chart1HRPM25.Central.Data[result.Chart1HRPM25.Central.Data.length - 1], latestPsi.readings.pm25_one_hourly.central);
                                that.SetPsi1DataGovValue(result.Chart1HRPM25.East.Data[result.Chart1HRPM25.East.Data.length - 1], latestPsi.readings.pm25_one_hourly.east);
                                that.SetPsi1DataGovValue(result.Chart1HRPM25.West.Data[result.Chart1HRPM25.West.Data.length - 1], latestPsi.readings.pm25_one_hourly.west);
                                that.SetPsi1DataGovValue(result.Chart1HRPM25.North.Data[result.Chart1HRPM25.North.Data.length - 1], latestPsi.readings.pm25_one_hourly.north);
                                that.SetPsi1DataGovValue(result.Chart1HRPM25.South.Data[result.Chart1HRPM25.South.Data.length - 1], latestPsi.readings.pm25_one_hourly.south);
                            }
                        }).fail(function (fail) {
                            console.log('fail to load pm25 chart');
                        }).always(function () {
                            XChartManager.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"] = result.Chart1HRPM25;

                            if (result.ChartAsOfDate === null) result.ChartAsOfDate = "";
                            jQuery("span.panel-stats-timing").html("At " + result.ChartAsOfDate);
                            resolve();
                        });
                    });

                } else {
                    XChartManager.ChartData["PM<sub>2.5</sub> sub-index"] = result.ChartPM25;
                    XChartManager.ChartData["PM<sub>10</sub> sub-index"] = result.ChartPM10;
                    XChartManager.ChartData["SO<sub>2</sub> sub-index"] = result.ChartSO2;
                    XChartManager.ChartData["O<sub>3</sub> sub-index"] = result.ChartO3;
                    XChartManager.ChartData["CO sub-index"] = result.ChartCO;
                    XChartManager.ChartData["NO<sub>2</sub> sub-index"] = result.ChartNO2;
                    XChartManager.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"] = result.Chart1HRPM25;

                    if (result.ChartAsOfDate == null) result.ChartAsOfDate = "";
                    jQuery("span.panel-stats-timing").html("At " + result.ChartAsOfDate);

                    resolve();
                }
            });
        });
    },
    SetPsi24DataGovValue: function (obj, value) {
        if (obj.value === 0 || obj.value === null) {
            obj.value = value;
            obj.valueColor = this.GetColor(value);
            obj.band = '';
        }
    },
    SetPsi1DataGovValue: function (obj, value) {
        if (obj.value === 0 || obj.value === null) {
            obj.value = value;
            obj.valueColor = '#595959';
            obj.band = this.GetBand(value).match('\([I|V]+\)')[0];
        }
    },
    Categories: {},
    SetRegion: function (selectedRegion) {
        this.SelectedRegion = selectedRegion;
        $("#region-selected-value").html(selectedRegion);
    },
    SetChartName: function (selectedChartName) {
        this.SelectedChartName = selectedChartName;
    },
    UpdatePSIValue: function () {
    },
    UpdatePSIDataAndMap: function () {
    },
    GetCurrent: function (data) {
        var length = data.length;
        if (length > 0) {
            for (var i = length - 1; i >= 0; i--) {
                var dataObj = data[i];
                if (typeof dataObj !== 'undefined' && typeof dataObj.value !== 'undefined') {
                    return dataObj.value;
                }
            }
        }
        return 0;
    },
    GetMax: function (data) {
        var max = -1;
        for (var i = 0; i < data.length; i++) {
            if (typeof data[i] !== 'undefined' && typeof data[i].value !== 'undefined' && data[i].value > max) {
                max = data[i].value;
            }
        }
        return max != -1 ? max : 0;
    },
    GetMin: function (data) {
        var min = Number.MAX_VALUE;
        for (var i = 0; i < data.length; i++) {
            if (typeof data[i] !== 'undefined' && typeof data[i].value !== 'undefined' && (data[i].value != -1 && data[i].value < min)) {
                min = data[i].value;
            }
        }
        return min == Number.MAX_VALUE ? 0 : min;
    },
    GetStatusDisplayString: function (value) {
        if (value === undefined || value <= 50) {
            return "Good";
        } else if (value <= 100) {
            return "Moderate";
        } else if (value <= 200) {
            return "Unhealthy";
        } else if (value <= 300) {
            return "Very Unhealthy";
        } else {
            return "Hazardous";
        }
    },
    GetStatus1hr: function (value) {
        if (value === undefined || value <= 55) {
            return "Normal";
        } else if (value <= 150) {
            return "Elevated";
        } else if (value <= 250) {
            return "High";
        } else {
            return "Very High";
        }
    },
    GetStatus: function (value) {
        return this.GetStatusDisplayString(value).replaceAll(" ", "").toLowerCase();
    },
    GetColor: function (value) {
        if (value === undefined || value <= 50) {
            return "#479B02";
        } else if (value <= 100) {
            return "#006FA1";
        } else if (value <= 200) {
            return "#ffce03";
        } else if (value <= 300) {
            return "#ffa800";
        } else {
            return "#D60000";
        }
    },
    GetBand: function (value) {
        if (value === undefined || value <= 55) {
            return '<span class="romanize">(I)</span>';
        } else if (value <= 150) {
            return '<span class="romanize">(II)</span>';
        } else if (value <= 250) {
            return '<span class="romanize">(III)</span>';
        } else {
            return '<span class="romanize">(IV)</span>';
        }
    },
    ApplyCSS: function (value) {
        if (value === undefined || value <= 50) {
            return "good";
        } else if (value <= 100) {
            return "moderate";
        } else if (value <= 200) {
            return "unhealthy";
        } else if (value <= 300) {
            return "vryunhealthy";
        } else {
            return "hazardous";
        }
    },
    FirstLoadChart: function () {
        this.UpdatePSIDataAndMap();
        this.ReloadChart();
        //this.SetChartName("PM<sub>2.5</sub> sub-index");
        this.SetChartName("1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)");
    },
    ReloadChart: function () {
        this.LoadSelectedChart();
        this.LoadChart1();
        this.LoadChart2();
        this.LoadChart3();
        this.LoadChart4();
        this.LoadChart5();
        this.LoadChart6();
        this.LoadChart7();
        this.UpdatePSIValue();
    },
    LoadSelectedChart: function () {
        var selectedRegion = this.SelectedRegion;
        var curr1HrPM25 = this.GetCurrent(this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"][selectedRegion].Data);
        var currPM25 = this.GetCurrent(this.ChartData["PM<sub>2.5</sub> sub-index"][selectedRegion].Data);
        var currPM10 = this.GetCurrent(this.ChartData["PM<sub>10</sub> sub-index"][selectedRegion].Data);
        var currSO2 = this.GetCurrent(this.ChartData["SO<sub>2</sub> sub-index"][selectedRegion].Data);
        var currCO = this.GetCurrent(this.ChartData["CO sub-index"][selectedRegion].Data);
        var currO3 = this.GetCurrent(this.ChartData["O<sub>3</sub> sub-index"][selectedRegion].Data);
        var currNO = this.GetCurrent(this.ChartData["NO<sub>2</sub> sub-index"][selectedRegion].Data);
        var psiNorthData = this.ChartData["PM<sub>2.5</sub> sub-index"]["North"].Data;
        var psiSouthData = this.ChartData["PM<sub>2.5</sub> sub-index"]["South"].Data;
        var psiEastData = this.ChartData["PM<sub>2.5</sub> sub-index"]["East"].Data;
        var psiWestData = this.ChartData["PM<sub>2.5</sub> sub-index"]["West"].Data;
        var psiCentralData = this.ChartData["PM<sub>2.5</sub> sub-index"]["Central"].Data;

        //Every Direction Value
        var currPM25N = this.GetCurrent(this.ChartData["PM<sub>2.5</sub> sub-index"]["North"].Data);
        var currPM25W = this.GetCurrent(this.ChartData["PM<sub>2.5</sub> sub-index"]["West"].Data);
        var currPM25C = this.GetCurrent(this.ChartData["PM<sub>2.5</sub> sub-index"]["Central"].Data);
        var currPM25E = this.GetCurrent(this.ChartData["PM<sub>2.5</sub> sub-index"]["East"].Data);
        var currPM25S = this.GetCurrent(this.ChartData["PM<sub>2.5</sub> sub-index"]["South"].Data);
        var currPM10N = this.GetCurrent(this.ChartData["PM<sub>10</sub> sub-index"]["North"].Data);
        var currPM10W = this.GetCurrent(this.ChartData["PM<sub>10</sub> sub-index"]["West"].Data);
        var currPM10C = this.GetCurrent(this.ChartData["PM<sub>10</sub> sub-index"]["Central"].Data);
        var currPM10E = this.GetCurrent(this.ChartData["PM<sub>10</sub> sub-index"]["East"].Data);
        var currPM10S = this.GetCurrent(this.ChartData["PM<sub>10</sub> sub-index"]["South"].Data);
        var currSO2N = this.GetCurrent(this.ChartData["SO<sub>2</sub> sub-index"]["North"].Data);
        var currSO2W = this.GetCurrent(this.ChartData["SO<sub>2</sub> sub-index"]["West"].Data);
        var currSO2C = this.GetCurrent(this.ChartData["SO<sub>2</sub> sub-index"]["Central"].Data);
        var currSO2E = this.GetCurrent(this.ChartData["SO<sub>2</sub> sub-index"]["East"].Data);
        var currSO2S = this.GetCurrent(this.ChartData["SO<sub>2</sub> sub-index"]["South"].Data);
        var currCON = this.GetCurrent(this.ChartData["CO sub-index"]["North"].Data);
        var currCOW = this.GetCurrent(this.ChartData["CO sub-index"]["West"].Data);
        var currCOC = this.GetCurrent(this.ChartData["CO sub-index"]["Central"].Data);
        var currCOE = this.GetCurrent(this.ChartData["CO sub-index"]["East"].Data);
        var currCOS = this.GetCurrent(this.ChartData["CO sub-index"]["South"].Data);
        var currO3N = this.GetCurrent(this.ChartData["O<sub>3</sub> sub-index"]["North"].Data);
        var currO3W = this.GetCurrent(this.ChartData["O<sub>3</sub> sub-index"]["West"].Data);
        var currO3C = this.GetCurrent(this.ChartData["O<sub>3</sub> sub-index"]["Central"].Data);
        var currO3E = this.GetCurrent(this.ChartData["O<sub>3</sub> sub-index"]["East"].Data);
        var currO3S = this.GetCurrent(this.ChartData["O<sub>3</sub> sub-index"]["South"].Data);
        var currNON = this.GetCurrent(this.ChartData["NO<sub>2</sub> sub-index"]["North"].Data);
        var currNOW = this.GetCurrent(this.ChartData["NO<sub>2</sub> sub-index"]["West"].Data);
        var currNOC = this.GetCurrent(this.ChartData["NO<sub>2</sub> sub-index"]["Central"].Data);
        var currNOE = this.GetCurrent(this.ChartData["NO<sub>2</sub> sub-index"]["East"].Data);
        var currNOS = this.GetCurrent(this.ChartData["NO<sub>2</sub> sub-index"]["South"].Data);

        this.PSIData.North = this.GetCurrent(psiNorthData);
        this.PSIData.South = this.GetCurrent(psiSouthData);
        this.PSIData.East = this.GetCurrent(psiEastData);
        this.PSIData.West = this.GetCurrent(psiWestData);
        this.PSIData.Central = this.GetCurrent(psiCentralData);
        var imgPathTemplate = "../assets/nea/images/map/$status/$status_$region.png";
        var imgPathTemplateSelected = "../assets/nea/images/map/$status/$status_$region_hover.png";

        if (this.SelectedChartName == "1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)") {

            var color = "#595959";
            $("#panel-stats-value").html(curr1HrPM25);
            $("#panel-stats-unit").html("&micro;g/m<sup>3</sup>");
            $("#panel-stats-status").html(this.GetStatus1hr(curr1HrPM25)).css("color", color);
            $(".panel-stats-value-content span").css("color", color);
            $(".panel-stats-value-holder").css("border-color", color);
            $('#panel-stats-time-wrapper .panel-stats-title').html('1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)');

            //Get Max Value from each Direction
            var maxValueNorth = Math.max(this.GetCurrent(this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"]["North"].Data));
            var maxValueWest = Math.max(this.GetCurrent(this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"]["West"].Data));
            var maxValueCentral = Math.max(this.GetCurrent(this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"]["Central"].Data));
            var maxValueEast = Math.max(this.GetCurrent(this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"]["East"].Data));
            var maxValueSouth = Math.max(this.GetCurrent(this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"]["South"].Data));

            var bandNorth = this.GetBand(maxValueNorth);
            var bandWest = this.GetBand(maxValueWest);
            var bandCentral = this.GetBand(maxValueCentral);
            var bandEast = this.GetBand(maxValueEast);
            var bandSouth = this.GetBand(maxValueSouth);

            $('#ContentPlaceHolderTicker_C049_DivTopNorth').html(maxValueNorth + ' ' + bandNorth);
            $('#ContentPlaceHolderTicker_C049_DivTopWest').html(maxValueWest + ' ' + bandWest);
            $('#ContentPlaceHolderTicker_C049_DivTopCentral').html(maxValueCentral + ' ' + bandCentral);
            $('#ContentPlaceHolderTicker_C049_DivTopEast').html(maxValueEast + ' ' + bandEast);
            $('#ContentPlaceHolderTicker_C049_DivTopSouth').html(maxValueSouth + ' ' + bandSouth);
        } else {

            var maxValue = Math.max(currPM25, currPM10, currSO2, currCO, currO3, currNO);
            var color = this.GetColor(maxValue);

            $("#panel-stats-value").html(maxValue);
            $("#panel-stats-unit").html('');
            $("#panel-stats-status").html(this.GetStatusDisplayString(maxValue)).css("color", color);;
            $(".panel-stats-value-content span").css("color", color);
            $(".panel-stats-value-holder").css("border-color", color);
            $('#panel-stats-time-wrapper .panel-stats-title').html('PSI Value');

            //Get Max Value from each Direction
            var maxValueN2 = Math.max(currPM25N, currPM10N, currSO2N, currCON, currO3N, currNON);
            var maxValueW2 = Math.max(currPM25W, currPM10W, currSO2W, currCOW, currO3W, currNOW);
            var maxValueC2 = Math.max(currPM25C, currPM10C, currSO2C, currCOC, currO3C, currNOC);
            var maxValueE2 = Math.max(currPM25E, currPM10E, currSO2E, currCOE, currO3E, currNOE);
            var maxValueS2 = Math.max(currPM25S, currPM10S, currSO2S, currCOS, currO3S, currNOS);
            var N2Color = this.ApplyCSS(maxValueN2);
            var W2Color = this.ApplyCSS(maxValueW2);
            var C2Color = this.ApplyCSS(maxValueC2);
            var E2Color = this.ApplyCSS(maxValueE2);
            var S2Color = this.ApplyCSS(maxValueS2);
            $('#ContentPlaceHolderTicker_C049_LitValueNorth').html(maxValueN2);
            $('#ContentPlaceHolderTicker_C049_LitValueWest').html(maxValueW2);
            $('#ContentPlaceHolderTicker_C049_LitValueCentral').html(maxValueC2);
            $('#ContentPlaceHolderTicker_C049_LitValueEast').html(maxValueE2);
            $('#ContentPlaceHolderTicker_C049_LitValueSouth').html(maxValueS2);

            $('#ContentPlaceHolderTicker_C049_LitValueNorth').parents('.info').addClass(N2Color);
            $('#ContentPlaceHolderTicker_C049_LitValueWest').parents('.info').addClass(W2Color);
            $('#ContentPlaceHolderTicker_C049_LitValueCentral').parents('.info').addClass(C2Color);
            $('#ContentPlaceHolderTicker_C049_LitValueEast').parents('.info').addClass(E2Color);
            $('#ContentPlaceHolderTicker_C049_LitValueSouth').parents('.info').addClass(S2Color);
        }
    },
    LoadChart1: function () {
        var chartData = this.ChartData["1-hr PM<sub>2.5</sub> reading (&micro;g/m<sup>3</sup>)"][this.SelectedRegion].Data;
        $("#chart-1hr-pm25 .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-1hr-pm25 .value.value-max").html(this.GetMax(chartData));
        $("#chart-1hr-pm25 .value.value-min").html(this.GetMin(chartData));
        $("#chart-1hr-pm25 .chart-small").kendoChart({
            theme: "flat",
            title: {
                font: "bold 17px Arial, Helvetica, sans-serif",
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: '${value} (Band <span class="romanize">${dataItem.band}</span>)',
                background: "white"
            }
        }).data("kendoChart");
    },
    LoadChart2: function () {
        var chartData = this.ChartData["PM<sub>2.5</sub> sub-index"][this.SelectedRegion].Data;
        $("#chart-pm25 .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-pm25 .value.value-max").html(this.GetMax(chartData));
        $("#chart-pm25 .value.value-min").html(this.GetMin(chartData));
        $("#chart-pm25 .chart-small").kendoChart({
            theme: "flat",
            title: {
                font: "bold 17px Arial, Helvetica, sans-serif",
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: "${value} ${dataItem.band}",
                background: "white"
            }
        }).data("kendoChart");
        $("#chart-pm25 .footnote").html(this.FootNote[["PM<sub>2.5</sub> sub-index"]]);
    },
    LoadChart3: function () {
        var chartData = this.ChartData["PM<sub>10</sub> sub-index"][this.SelectedRegion].Data;
        $("#chart-pm10 .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-pm10 .value.value-max").html(this.GetMax(chartData));
        $("#chart-pm10 .value.value-min").html(this.GetMin(chartData));
        $("#chart-pm10 .chart-small").kendoChart({
            theme: "flat",
            title: {
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: "${value} ${dataItem.band}",
                background: "white"
            }
        }).data("kendoChart");
        $("#chart-pm10 .footnote").html(this.FootNote[["PM<sub>10</sub> sub-index"]]);
    },
    LoadChart4: function () {
        var chartData = this.ChartData["SO<sub>2</sub> sub-index"][this.SelectedRegion].Data;
        $("#chart-so2 .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-so2 .value.value-max").html(this.GetMax(chartData));
        $("#chart-so2 .value.value-min").html(this.GetMin(chartData));
        $("#chart-so2 .chart-small").kendoChart({
            theme: "flat",
            title: {
                font: "bold 17px Arial, Helvetica, sans-serif",
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: "${value} ${dataItem.band}",
                background: "white"
            }
        }).data("kendoChart");
        $("#chart-so2 .footnote").html(this.FootNote[["SO<sub>2</sub> sub-index"]]);
    },
    LoadChart5: function () {
        var chartData = this.ChartData["O<sub>3</sub> sub-index"][this.SelectedRegion].Data;
        $("#chart-o3 .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-o3 .value.value-max").html(this.GetMax(chartData));
        $("#chart-o3 .value.value-min").html(this.GetMin(chartData));
        $("#chart-o3 .chart-small").kendoChart({
            theme: "flat",
            title: {
                font: "bold 17px Arial, Helvetica, sans-serif",
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: "${value} ${dataItem.band}",
                background: "white"
            }
        }).data("kendoChart");
        $("#chart-o3 .footnote").html(this.FootNote[["O<sub>3</sub> sub-index"]]);
    },
    LoadChart6: function () {
        var chartData = this.ChartData["CO sub-index"][this.SelectedRegion].Data;
        $("#chart-co .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-co .value.value-max").html(this.GetMax(chartData));
        $("#chart-co .value.value-min").html(this.GetMin(chartData));
        $("#chart-co .chart-small").kendoChart({
            theme: "flat",
            title: {
                font: "bold 17px Arial, Helvetica, sans-serif",
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: "${value} ${dataItem.band}",
                background: "white"
            }
        }).data("kendoChart");
        $("#chart-co .footnote").html(this.FootNote[["CO sub-index"]]);
    },
    LoadChart7: function () {
        var chartData = this.ChartData["NO<sub>2</sub> sub-index"][this.SelectedRegion].Data;
        $("#chart-no2 .value.value-current").html(this.GetCurrent(chartData));
        $("#chart-no2 .value.value-max").html(this.GetMax(chartData));
        $("#chart-no2 .value.value-min").html(this.GetMin(chartData));
        $("#chart-no2 .chart-small").kendoChart({
            theme: "flat",
            title: {
                font: "bold 17px Arial, Helvetica, sans-serif",
                color: "#006fa1",
                visible: false
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            series: [{
                name: "North",
                type: "column",
                labels: {
                    visible: false
                },
                border: {
                    width: 1,
                    color: "white"
                },
                markers: {
                    visible: false
                },
                data: chartData,
                colorField: "valueColor",
                gap: 0.1
            }],
            valueAxis: [{
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                majorUnit: 1,
                majorTicks: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: true
                },
                labels: {
                    step: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                        1 :
                        Math.ceil(this.GetMax(chartData) * 1.33),
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                max: Math.ceil(this.GetMax(chartData) * 1.33) == 0 ?
                    1 :
                    Math.ceil(this.GetMax(chartData) * 1.33),
                min: 0
            }],
            categoryAxis: {
                title: {
                    visible: false
                },
                majorGridLines: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                },
                line: {
                    visible: true,
                    color: "#b1d8ec"
                },
                labels: {
                    font: "normal 11px Arial,Helvetica,sans-serif",
                    color: "#006fa1",
                    visible: true
                },
                categories: XChartManager.Categories
            },
            tooltip: {
                visible: true,
                template: "${value} ${dataItem.band}",
                background: "white"
            }
        }).data("kendoChart");
        $("#chart-no2 .footnote").html(this.FootNote[["NO<sub>2</sub> sub-index"]]);
    }
};
