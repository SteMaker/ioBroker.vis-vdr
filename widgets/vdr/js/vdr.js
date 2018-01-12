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
        "extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"}
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
    }
};

vis.binds.vdr.showVersion();
