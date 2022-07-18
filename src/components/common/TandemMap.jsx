import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ComposableMap, Graticule, ZoomableGroup, Geographies, Geography, Marker } from 'react-simple-maps';
import some from 'lodash/some';
import find from 'lodash/find';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';

const PRIMARY_COLOR = '#FFCD44';
const SECONDARY_COLOR = '#46B27E';

const TandemInfo = (props) => {
  const { tandem } = props;
  if (!tandem) return null;

  const { title, description, url, imageUrl } = tandem;

  return (
    <div className="tandem-info">
      <div className="tandem-img">
        <img src={imageUrl} />
      </div>
      <div className="p-10">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="tandem-link">
          Tandem Link
        </a>
      </div>
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
  const [ clicked, setClicked ] = useState(null);
  const [ selected, setSelected ] = useState(null);

  const handleClick = (e, id) => {
    setClicked(e.currentTarget);
    setSelected(id);
  };

  const showPopover = !!clicked;
  const tandem = find(tandems, { id: selected });

  return (
    <>

    <Popover 
      open={showPopover} 
      onClose={() => { setClicked(null); setSelected(null); }}
      anchorEl={clicked}
    >
      <TandemInfo tandem={tandem} />
    </Popover>

    <ComposableMap projection="geoMercator"
      projectionConfig={{ scale: 350, center: [9, 45] }}>

      <Geographies geography="/mapdata.json">
        {({ geographies }) => (
          geographies.map((geo) => {
            return (
              <Geography key={geo.rsmKey} geography={geo} 
                fill="lightgray" stroke="white" strokeWidth="1" />
            );
          })
        )}
      </Geographies>

      { tandems.map((tandem) => {
        const { id, lat, lon, city, country } = tandem;
        const radius = hover === id ? 9 : 4;
        return (
          <Marker key={id} coordinates={[ lon, lat ]}
            onMouseEnter={() => setHover(id)}
            onMouseLeave={() => setHover(null)}
          >
            <Tooltip title={`${city}, ${country}`}>
              <circle r={radius} 
                fill={SECONDARY_COLOR} 
                stroke={SECONDARY_COLOR} 
                strokeWidth={1} 
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleClick(e, id)} />
            </Tooltip>
          </Marker>
        );
      })}

    </ComposableMap>
    </>
  );
};

export default TandemMap;