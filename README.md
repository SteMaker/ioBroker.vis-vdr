# iobroker.vdr
ioBroker visualization adapter for VDR

Overview:
=========
This is a VIS adapter for the ioBroker platform (http://iobroker.net/) to access a VDR - VideoDiskRecorder - (http://www.tvdr.de/). You will also need to iobroker.vdr adapter to perform the actual access to VDR. Thanks to Klaus Schmidinger, the author of VDR, for this fantastic project! And also thanks to the yavdr team for the RESTful API plugin. 

Pre-requisites:
==============
* A VDR installation obviously.
* The iobroker.vdr adapter that communicates to VDR
* The RESTful API VDR-plugin (https://github.com/yavdr/vdr-plugin-restfulapi) to communicate with VDR. This is not a direct dependency of this adapter but of the iobroker.vdr adapter.

Description:
============
Early stage! Pre-alpha!

A widget is available that displays the channels of the VDR and that can be used to select a channel.

This adapter is based on the iobroker.vis-template adapter (https://github.com/ioBroker/ioBroker.vis-template). Thanks to bluefox for providing this and lots of other iobroker stuff!
