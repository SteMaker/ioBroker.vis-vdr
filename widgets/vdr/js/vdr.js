/*
    ioBroker.vis vdr Widget-Set

    version: "0.0.1"

    Copyright 10.2015-2016 maker<stefan@fam-macher.de>

*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "myColor":          {"en": "myColor",       "de": "mainColor",  "ru": "Мой цвет"},
        "myColor_tooltip":  {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText":         {"en": "htmlText",      "de": "htmlText",   "ru": "htmlText"},
        "group_extraMyset": {"en": "extraMyset",    "de": "extraMyset", "ru": "extraMyset"},
        "extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"},
        "Title":            {"en": "Title",         "de": "Titel"},
        "Duration":         {"en": "Duration",      "de": "Dauer"},
        "Date":             {"en": "Date",          "de": "Datum"}
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance":  {"en": "Instance", "de": "Instanz", "ru": "Инстанция"}
});

// this code can be placed directly in vdr.html
vis.binds.vdr = {
    version: "0.0.1",
    firstCh: 0,
    firstRec: 0,
    showVersion: function () {
        if (vis.binds.vdr.version) {
            console.log('Version vdr: ' + vis.binds.vdr.version);
            vis.binds.vdr.version = null;
        }
    },
    updateChannelListStyles: function (data) {
        $(".vdr-channel-list-head").css("background-color", data.chListHeadBgColor);
        $(".vdr-channel-list-head").css("color", data.chListHeadTextColor);
        $(".vdr-channel-list-row-even").css("background-color", data.chListEvenLineBgColor);
        $(".vdr-channel-list-row-even").css("color", data.chListEvenLineTextColor);
        $(".vdr-channel-list-row-odd").css("background-color", data.chListOddLineBgColor);
        $(".vdr-channel-list-row-odd").css("color", data.chListOddLineTextColor);
        $(".vdr-ch-select-scroll-button").css("background-color", data.chListHeadBgColor);
        $(".vdr-ch-select-scroll-button").css("stroke", data.chListHeadTextColor);
    },
	updateChannelList: function (widgetID, view, data, style) {
        var tblHtml = "";
        if(data.oid_getChList) {
            var chList = JSON.parse(vis.states[data.oid_getChList + '.val']);
            var len = chList.length;
            var numCh = Number(data.numberChannels);
            if(len < numCh) {
                numCh = len;
            }
            var first = vis.binds.vdr.firstCh;
            if(first < 0) {
                first = 0;
                vis.binds.vdr.firstCh = 0;
            }
            var last = first + numCh;
            if(last > len) {
                last = len;
                first = last - numCh;
                vis.binds.vdr.firstCh = first;
            }
            if (len) {
                tblHtml += "<table width=\"100%\" class=\"vdr-channel-list\"><tr class=\"vdr-channel-list-head\"><th>CH#</th><th>Name</th></tr>";
                for(; first < last; first++) {
                        tblHtml += "<tr class=\"vdr-ch-select-button vdr-channel-list-row" + ((first%2==0)?"-odd\"":"-even\"");
                        tblHtml += " data-channelid="+chList[first]["chid"] + " data-channelname="+chList[first]["name"]+">";
                        tblHtml += "<td class=\"vdr-channel-list-nr-col\">"+chList[first]["nr"]+"</td><td>"+chList[first]["name"]+"</td></tr>";
                }
                tblHtml += "</table>";
            }
        }
        $('.vdr-ch-table').html(tblHtml);
        vis.binds.vdr.updateChannelListStyles(data);

        // function called when a channel (line) in the channel list is clicked
        $(".vdr-ch-select-button").click(function() {
            var chId = $(this).data("channelid");
            console.log("Switching VDR to channelID " + chId + " -> " + $(this).data("channelname"));
            vis.setValue(data.oid_setCh, chId);
        });
    },
	createChSelectWidget: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.vdr.createChSelectWidget(widgetID, view, data, style);
            }, 100);
        }

        // Build the channel list table
        vis.binds.vdr.updateChannelList(widgetID, view, data, style);

        // function called when scroll up button was pressed
        $("#vdr-ch-select-scroll-up").click(function() {
            console.log("Scrolling up");
            vis.binds.vdr.firstCh -= Number(data.numberChannels);
            vis.binds.vdr.updateChannelList(widgetID, view, data, style);
        });
        // function called when scroll down button was pressed
        $("#vdr-ch-select-scroll-down").click(function() {
            console.log("Scrolling down");
            vis.binds.vdr.firstCh += Number(data.numberChannels);
            vis.binds.vdr.updateChannelList(widgetID, view, data, style);
        });
        // function called when scroll down button was pressed
        $("#vdr-ch-select-scroll-top").click(function() {
            console.log("Scrolling to top");
            vis.binds.vdr.firstCh = 0;
            vis.binds.vdr.updateChannelList(widgetID, view, data, style);
        });

        // subscribe on updates of value
        if (data.oid_getChList) {
            vis.states.bind(data.oid_getChList + '.val', function (e, newVal, oldVal) {
                updateChannelList(widgetID, view, data, style);
            });
        }
        feather.replace();
    },
    updateRecSelectStyles: function (data) {
        $(".vdr-rec-select-head").css("background-color", data.recSelectHeadBgColor);
        $(".vdr-rec-select-head").css("color", data.recSelectHeadTextColor);
        $(".vdr-rec-select-row-even").css("background-color", data.recSelectEvenLineBgColor);
        $(".vdr-rec-select-row-even").css("color", data.recSelectEvenLineTextColor);
        $(".vdr-rec-select-row-odd").css("background-color", data.recSelectOddLineBgColor);
        $(".vdr-rec-select-row-odd").css("color", data.recSelectOddLineTextColor);
        $(".vdr-rec-select-scroll-button").css("background-color", data.recSelectHeadBgColor);
        $(".vdr-rec-select-scroll-button").css("stroke", data.recSelectHeadTextColor);
        $(".vdr-rec-list-date-col").css("width", data.pxWidthDate);
        $(".vdr-rec-list-duration-col").css("width", data.pxWidthDuration);
    },
	updateRecSelect: function (widgetID, view, data, style) {
        var tblHtml = "";
        if(data.oid_getRecList) {
            var recList = JSON.parse(vis.states[data.oid_getRecList + '.val']);
            var len = recList.length;
            var numRec = Number(data.numberRecordings);
            if(len < numRec) {
                numRec = len;
            }
            var first = vis.binds.vdr.firstRec;
            if(first < 0) {
                first = 0;
                vis.binds.vdr.firstRec = 0;
            }
            var last = first + numRec;
            if(last > len) {
                last = len;
                first = last - numRec;
                vis.binds.vdr.firstRec = first;
            }
            if (len) {
                tblHtml += "<table class=\"vdr-rec-select\"><tr class=\"vdr-rec-select-head\"><th class=\"vdr-rec-list-title-col\" class=\"translate\">Title</th><th class=\"vdr-rec-list-date-col\" class=\"translate\">Date</th><th class=\"vdr-rec-list-duration-col\" class=\"translate\">Duration</th></tr>";
                for(; first < last; first++) {
                        var durH = Math.floor(recList[first].duration / 3600);
                        var durM = ("00"+Math.round((parseInt(recList[first].duration)-durH*3600)/60)).slice(-2);
                        var date = new Date(recList[first].start_time*1000);
                        var dateD = ("00"+date.getDate()).slice(-2);
                        var dateM = ("00"+(date.getMonth()+1)).slice(-2);
                        var dateY = ("00"+date.getFullYear()).slice(-2);
                        tblHtml += "<tr class=\"vdr-rec-select-button vdr-rec-select-row" + ((first%2==0)?"-odd\"":"-even\"");
                        tblHtml += " data-recfilename=" + recList[first]["filename"] + ">";
                        tblHtml += "<td class=\"vdr-rec-list-title-col\">"+recList[first]["name"]+"</td><td class=\"vdr-rec-list-date-col\">" + dateD+"."+dateM+"."+dateY + "</td><td class=\"vdr-rec-list-duration-col\">" + durH+":"+durM + "</td></tr>";
                }
                tblHtml += "</table>";
            }
        }
        $('.vdr-rec-table').html(tblHtml);
        vis.binds.vdr.updateRecSelectStyles(data);

        // function called when a recording (line) in the recording list is clicked
        $(".vdr-rec-select-button").click(function() {
            var recId = $(this).data("recid");
            console.log("Recording with filename " + $(this).data("recfilename") + " was clicked");
        });
    },
	createRecSelectWidget: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.vdr.createRecSelectWidget(widgetID, view, data, style);
            }, 100);
        }

        // Build the channel list table
        vis.binds.vdr.updateRecSelect(widgetID, view, data, style);

        // function called when scroll up button was pressed
        $("#vdr-rec-select-scroll-up").click(function() {
            console.log("Scrolling up");
            vis.binds.vdr.firstRec -= Number(data.numberRecordings);
            vis.binds.vdr.updateRecSelect(widgetID, view, data, style);
        });
        // function called when scroll down button was pressed
        $("#vdr-rec-select-scroll-down").click(function() {
            console.log("Scrolling down");
            vis.binds.vdr.firstRec += Number(data.numberRecordings);
            vis.binds.vdr.updateRecSelect(widgetID, view, data, style);
        });
        // function called when scroll top button was pressed
        $("#vdr-rec-select-scroll-top").click(function() {
            console.log("Scrolling to top");
            vis.binds.vdr.firstRec = 0;
            vis.binds.vdr.updateRecSelect(widgetID, view, data, style);
        });

        // subscribe on updates of value
        if (data.oid_getRecList) {
            vis.states.bind(data.oid_getRecList + '.val', function (e, newVal, oldVal) {
                updateRecSelect(widgetID, view, data, style);
            });
        }
        feather.replace();
    },
};

vis.binds.vdr.showVersion();
