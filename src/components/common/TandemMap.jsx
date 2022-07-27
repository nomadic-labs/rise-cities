import React, { useState, useEffect, useMemo } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { EditorWrapper, theme } from 'react-easy-editables';
import { useSelector, useDispatch } from 'react-redux';

import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';

import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import noop from 'lodash/noop';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';

import MarkerIcon, { MarkerIconSvg } from './MarkerIcon';
import TandemDetailModal from './TandemDetailModal';
import TandemEditingModal from './TandemEditingModal';

import { saveTandem } from '../../redux/actions';

import produce from 'immer';

const PRIMARY_COLOR = '#FFCD44';
const SECONDARY_COLOR = '#46B27E';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primaryColor,
    }
  },
  typography: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize
  }
});

const TandemRow = (props) => {
  const { tandem } = props;

  const onHover = props.onHover || noop;
  const onClick = props.onClick || noop;

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

const Map = (props) => {

  const { isMini, tandems } = props;

  // mini version is non-interactive
  const onHover = !isMini ? props.onHover : noop;
  const onClick = !isMini ? props.onClick : noop;
  const hover = !isMini ? props.hover : null;

  const mapOptions = {
    projectionConfig: {
      scale: 650,
      center: [9, 50]
    },
    height: 600,
    width: 600,
  };

  return (
    <ComposableMap projection="geoMercator"
      {...mapOptions}>

      <Geographies geography="/mapdata.json">
        {({ geographies }) => (
          geographies.map((geo) => {
            return (
              <Geography key={geo.rsmKey} geography={geo} 
                tabIndex="-1"
                fill={PRIMARY_COLOR} stroke="white" strokeWidth="1"
                pointerEvents="none" />
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
              city={city} country={country}
              isHovering={isHovering}
              shift 
              expand={isMini}
              style={{ cursor: !isMini ? 'pointer' : 'default' }}
              onClick={() => onClick(tandem)}
              onMouseEnter={() => onHover(tandem)}
              onMouseLeave={() => onHover(null)}
              tabIndex="0"
            />
          </Marker>
        );
      })}

    </ComposableMap>
  );
};

const TandemMap = (props) => {

  const { allTandems: { nodes } } = useStaticQuery(graphql`
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
          image
        }
      }
    }
  `);

  const [ tandems, setTandems ] = useState([]);

  const [ hover, setHover ] = useState(null);
  const [ selected, setSelected ] = useState(null);
  const [ editing, setEditing ] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setTandems(nodes.map((node) => {
      return {
        ...node,
        image: node.image ? JSON.parse(node.image) : {}
      };
    }));
  }, [ nodes ]);

  const onHover = (tandem) => {
    if (tandem) {

      setHover(tandem.id);

      // preload the image so that when they click the marker 
      // to open the modal, it's already cached
      if (tandem.image?.imageSrc) {
        new Image().src = tandem.image.imageSrc;
      }
    } else {
      setHover(null);
    }
  };

  const onSave = (tandem) => {
    const { id, ...payload } = tandem;

    dispatch(saveTandem(id, {
      ...payload,
      image: JSON.stringify(payload.image)
    }));

    setTandems(produce(tandems, (draft) => {
      const index = findIndex(draft, { id: tandem.id });
      draft[index] = tandem;
    }));

    stopEditing();
  };

  const startEditing = (tandem) => {
    setEditing(tandem);
  };

  const stopEditing = () => {
    setEditing(null);
  };

  const isEditingPage = useSelector((state) => state.adminTools.isEditingPage);

  const columns = useMemo(() => {
    const sorted = sortBy(tandems, 'city');
    return [
      take(sorted, 6),
      takeRight(sorted, 6),
    ];
  }, [ tandems ]);

  if (tandems.length === 0) return null;

  return (
    <>

    <TandemDetailModal tandem={selected} closeModal={() => setSelected(null)} />

    <TandemEditingModal 
      tandem={editing} 
      closeModal={stopEditing} 
      onSave={onSave}
    />

    <Grid container>

      <Hidden mdUp>
        <Grid item xs={12} md={6} className="map-container">
          <Map
            isMini
            tandems={tandems}
          />
        </Grid>
      </Hidden>

      { columns.map((column, i) => (
        <Grid item xs={12} md={3} key={i}>
          { column.map((tandem) => (
            <React.Fragment key={tandem.id}>

            { isEditingPage &&
              <ThemeProvider theme={muiTheme}>
                <EditorWrapper theme={theme} 
                  startEditing={() => startEditing(tandem)}>
                  <TandemRow tandem={tandem} />
                </EditorWrapper>
              </ThemeProvider>
            }

            { !isEditingPage &&
              <TandemRow 
                tandem={tandem} 
                onHover={onHover} 
                onClick={() => setSelected(tandem)}
              />
            }

            </React.Fragment>
          ))}
        </Grid>
      ))}

      <Hidden smDown>
        <Grid item xs={12} md={6} className="map-container">
          <Map
            tandems={tandems}
            hover={hover}
            onClick={setSelected}
            onHover={onHover}
          />
        </Grid>
      </Hidden>

    </Grid>
    </>
  );
};

export default TandemMap;