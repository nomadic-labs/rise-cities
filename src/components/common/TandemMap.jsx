import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import find from 'lodash/find';
import Tooltip from '@material-ui/core/Tooltip';
import TandemDetailModal from './TandemDetailModal';

const PRIMARY_COLOR = '#FFCD44';
const SECONDARY_COLOR = '#46B27E';

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
    setHover(tandem.id);

    // preload the image so that when they click the marker 
    // to open the modal, it's already cached
    new Image().src = tandem.imageUrl;
  };

  const tandem = find(tandems, { id: selected });

  return (
    <>

    <TandemDetailModal tandem={tandem} closeModal={() => setSelected(null)} />

    <ComposableMap projection="geoMercator"
      projectionConfig={{ scale: 350, center: [9, 45] }}>

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
        const radius = hover === id ? 9 : 4;
        return (
          <Marker key={id} coordinates={[ lon, lat ]}
            onMouseEnter={() => onHover(tandem)}
            onMouseLeave={() => setHover(null)}
          >
            <Tooltip title={`${city}, ${country}`}>
              <circle r={radius} 
                fill={SECONDARY_COLOR} 
                style={{ cursor: 'pointer' }}
                onClick={() => setSelected(id)} 
                tabIndex="0"
              />
            </Tooltip>
          </Marker>
        );
      })}

    </ComposableMap>
    </>
  );
};

export default TandemMap;