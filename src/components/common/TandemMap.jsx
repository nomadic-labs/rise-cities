import React, { useEffect, useState } from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';

const MAP_ZOOM = 3.0;

const style = {
  hover: {
    fill: '#46B27E',
    stroke: 'white',
    strokeWidth: 2,
  },
  default: {
    fill: '#FFCD44',
    //stroke: 'blue',
    //strokeWidth: 1,
  }
};

const TandemMap = (props) => {

  useEffect(() => {
  }, []);

  return (
    <ComposableMap projection="geoMercator"
      projectionConfig={{ scale: 350, center: [5, 40] }}>
      {/*<ZoomableGroup 
        zoom={MAP_ZOOM} minZoom={MAP_ZOOM} maxZoom={MAP_ZOOM} 
  center={[5, 40]}>*/}
        <Geographies geography="/europe.json">
          {({ geographies }) => (
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} style={style} />
            ))
          )}
        </Geographies>
      {/*</ZoomableGroup>*/}
    </ComposableMap>
  );
};

export default TandemMap;