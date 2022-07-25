import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import TandemDetailModal from './TandemDetailModal';
import { Grid } from '@material-ui/core';

import take from 'lodash/take';
import takeRight from 'lodash/takeRight';

import MarkerIcon, { MarkerIconSvg } from './MarkerIcon';

const PRIMARY_COLOR = '#FFCD44';
const SECONDARY_COLOR = '#46B27E';

const TandemRow = (props) => {
  const { tandem, onHover, onClick } = props;

  return (
    <div className="tandem-row" 
      onMouseEnter={() => onHover(tandem)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}>
      <div className="display-flex align-center">
        <div className="mr-5">
          <MarkerIconSvg />
        </div>
        <div className="pt-5 pb-5">
          <div className="text-uppercase text-xs">
            {tandem.city}, {tandem.country}
          </div>
          <div className="text-bold">
            {tandem.title}
          </div>
        </div>
      </div>
      <div className="fancy-border" />
    </div>
  );
};

const TandemMap = (props) => {

  const { allTandems: { nodes: tandems } } = useStaticQuery(graphql`
    query TandemQuery {
      allTandems {
        nodes {
          id
          city
          country
          lat
          lon
          title
          description
          url
          imageUrl
        }
      }
    }
  `);

  const [ hover, setHover ] = useState(null);
  const [ selected, setSelected ] = useState(null);

  const onHover = (tandem) => {
    if (tandem) {

      setHover(tandem.id);

      // preload the image so that when they click the marker 
      // to open the modal, it's already cached
      new Image().src = tandem.imageUrl;
    } else {
      setHover(null);
    }
  };

  const columns = [
    take(tandems, 6),
    takeRight(tandems, 6),
  ];

  return (
    <>

    <TandemDetailModal tandem={selected} closeModal={() => setSelected(null)} />

    <Grid container spacing={3}>

      { columns.map((column, i) => (
        <Grid item xs={12} sm={3} key={i}>
          { column.map((tandem) => (
            <TandemRow 
              key={tandem.id}
              tandem={tandem} 
              onHover={onHover} 
              onClick={() => setSelected(tandem)}
            />
          ))}
        </Grid>
      ))}

      <Grid item xs={12} sm={6} className="map-container">
        <ComposableMap projection="geoMercator"
          projectionConfig={{ scale: 650, center: [9, 50] }}
          height={600} width={600}>

          <Geographies geography="/mapdata.json">
            {({ geographies }) => (
              geographies.map((geo) => {
                return (
                  <Geography key={geo.rsmKey} geography={geo} 
                    tabIndex="-1"
                    fill={PRIMARY_COLOR} stroke="white" strokeWidth="1" />
                );
              })
            )}
          </Geographies>

          { tandems.map((tandem) => {
            const { id, lat, lon, city, country } = tandem;
            const isHovering = hover === id;
            return (
              <Marker key={id} coordinates={[ lon, lat ]}>
                <MarkerIcon 
                  label={isHovering && `${city}, ${country}`}
                  expand={isHovering} 
                  shift 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(tandem)}
                  onMouseEnter={() => onHover(tandem)}
                  onMouseLeave={() => onHover(null)}
                  tabIndex="0"
                />
              </Marker>
            );
          })}

        </ComposableMap>
      </Grid>
    </Grid>
    </>
  );
};

export default TandemMap;