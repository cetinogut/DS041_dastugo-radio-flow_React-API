import React, { useEffect, useState } from "react";
import { RadioBrowserApi } from "radio-browser-api";
import AudioPlayer from "react-h5-audio-player";
import ReactCountryFlag from "react-country-flag"
import "react-h5-audio-player/lib/styles.css";
import defaultImage from "./radio.jpg";
import ReactTooltip from 'react-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'



export default function Radio() {
  const [stations, setStations] = useState();
  const [stationFilter, setStationFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("US");



  useEffect(() => {
    setupApi(stationFilter, countryFilter).then((data) => {
      setStations(data);
    });
  }, [stationFilter, countryFilter]);

  const setupApi = async (stationFilter, countryFilter) => {
    const api = new RadioBrowserApi(fetch.bind(window), "My Radio App");

    const stations = await api
      .searchStations({
        countryCode: countryFilter,
        //language: "english",
        tag: stationFilter,
        limit: 30
      })
      .then((data) => {
        return data;
      });

    return stations;
  };

  const filters = [
    "all",
    "talk",
    "classical",
    "country",
    "dance",
    "disco",
    "jazz",
    "pop",
    "rap",
    "retro",
    "rock"
  ];

  const countries = [ "US", "TR", "DE", "FR", "GB"]

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  //const setDataTip = ({station.favicon}) ? "test" : "test2";
  const setDataTipNoLogo = "I don't have an original logo";
  const setDataTipWithLogo = "This is my original logo";

  return (
    <div className="radio">
      <div className="filters">
        {filters.map((filter, index) => (
          <span
            key={index}
            className={stationFilter === filter ? "selected" : ""}
            onClick={() => setStationFilter(filter)}
          >
            {filter}
          </span>
        ))}
      </div>

      <div className="filters">
        {countries.map((country, index) => (
          <span
            key={index}
            className={countryFilter === country ? "selected" : ""}
            onClick={() => setCountryFilter(country)}
          >
            {country}
          </span>
        ))}
      </div>
      

      <div className="stations">
        {stations &&
          stations.map((station, index) => {
            return (
              <div className="station" key={index}>
                <div className="stationName">
                  <img
                    className="logo"
                    data-tip={(station.favicon) ? setDataTipWithLogo : setDataTipNoLogo}
                    src={station.favicon}
                    alt="station logo"
                    onError={setDefaultSrc}
                  />
                  <div className="name" data-tip={station.homepage}>{station.name}</div>
                </div>

                <ReactTooltip />
               
                <AudioPlayer
                  className="player"
                  src={station.urlResolved}
                  showJumpControls={false}
                  layout="stacked"
                  customProgressBarSection={[]}
                  customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                  autoPlayAfterSrcChange={false}
                />
                <div className="row">
                <ReactCountryFlag
                countryCode={station.countryCode}
                svg
                style={{
                    width: '2em',
                    height: '2em',
                }}
                title={station.countryCode}
                data-tip={station.country}
               />
               <a href={station.homepage} target="_blank">
                <FontAwesomeIcon icon={faCaretRight} 
                    style={{ color: 'red' }}
                    data-tip="visit this radio site"
                />
               </a>
               </div>
                
               
              </div>
            );
          })}
      </div>
    </div>
  );
}
