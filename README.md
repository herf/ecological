### Data and runtime for Longcore et al. "Rapid Assessment of Lamp Spectrum to Quantify Ecological Effects of Light at Night"

Demo at https://fluxometer.com/ecological/

We have provided here (in .CSV form) a list of SPDs and action spectra used in making the graphs for the above paper. Also provided is a simple Javascript runtime for calculating and graphing responses in the browser.

Things you can do:

* Review [calc.js](calc.js) if you want to reproduce our calculations
* Clone this repository and add your own lamps to SPD.csv
* Load "index.html" using any static webserver (local files do not work anymore due to browser security changes)

The CSVs are organized as follows:

* [ActionSpectra.csv](csv/ActionSpectra.csv): All action spectra (or response curves) used, converted to power units (not quantal)
* [SPD.csv](csv/SPD.csv): All SPDs used
* [visual.csv](csv/visual.csv): Pre-computed data per lamp, including CRI, CCT, and sRGB-equivalent color
