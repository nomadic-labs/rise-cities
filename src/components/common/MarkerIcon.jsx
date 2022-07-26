import React, { useEffect, useRef } from 'react';
import SVGText from 'svg-text';
import classnames from 'classnames';

const MarkerIcon = ({ isHovering, shift, city, country, ...rest }) => {
  const transforms = [];

  const gRef = useRef();

  useEffect(() => {
    if (city && country) {
      let text = new SVGText({
        text: `${city}, ${country}`,
        x: 8,
        y: 22,
        element: gRef.current,
        maxWidth: 80,
        align: 'center',
        className: 'marker-icon-text',
        /*

        WARNING: using this style option seems to cause a bug
        and crashes the page when doing hot module replacement

        Instead, use the CSS class above and style it there.

        style: {
          'font-size': '6pt',
          fill: 'white',
        },
        */
        rect: {
          fill: 'black',
          rx: '2px',
          ry: '2px',
        },
        padding: '3px',
      });

      return () => {
        // remove the DOM elements
        text.rect.remove();
        text.text.remove();
        text = {};
      };
    }
  }, [ city, country, gRef ]);

  // shift so that the point of the teardrop is (approximately) on the correct spot on the map
  if (shift) transforms.push('translate(-8, -20)');

  return (
    <g fill="black" transform={transforms.join(' ')} {...rest}>
      <rect width="14.5414" height="18" fill="black" fillOpacity="0" />
      <g className={classnames(
        'marker-teardrop', {
          'marker-grow': isHovering,
          'marker-shrink': !isHovering,
        }
      )}>
        <path d="M7.11782 18C6.95357 17.8653 6.76467 17.7517 6.62861 17.5931C4.88446 15.554 3.14648 13.5104 1.4107 11.4642C0.547214 10.4461 0.0954346 9.24976 0.0174962 7.93186C-0.167442 4.8064 1.1148 2.43434 3.81446 0.864561C5.04959 0.146382 6.42033 -0.0856716 7.84612 0.0270529C9.39432 0.149905 10.7708 0.697676 11.9482 1.71176C13.3476 2.91694 14.1908 4.44048 14.4621 6.26829C14.6615 7.61482 14.4845 8.91776 13.9341 10.1652C13.6911 10.7165 13.3397 11.1987 12.9509 11.6553C11.2415 13.6623 9.53391 15.6707 7.81926 17.6733C7.7061 17.8054 7.54009 17.8921 7.39875 18H7.11738H7.11782ZM7.25652 16.3968C7.29483 16.3549 7.31508 16.3338 7.33402 16.3118C8.74704 14.6526 10.1636 12.9965 11.57 11.3316C11.9319 10.9032 12.3216 10.4809 12.5929 9.99656C13.4106 8.53643 13.5136 6.9715 12.9645 5.41273C12.1134 2.99664 10.3956 1.5823 7.82323 1.29432C6.4833 1.14417 5.21735 1.43126 4.08042 2.16265C2.43491 3.22165 1.48556 4.7399 1.2786 6.68748C1.1148 8.23128 1.47763 9.63373 2.51681 10.8354C3.77351 12.2889 5.0104 13.7596 6.25609 15.2224C6.58546 15.6095 6.91526 15.9965 7.25652 16.3968Z" />
        <path d="M7.23536 10.7852C5.26048 10.7469 3.7048 9.14715 3.73694 7.2053C3.7682 5.31452 5.30936 3.71304 7.29084 3.73858C9.27233 3.76456 10.821 5.37661 10.7774 7.32243C10.7342 9.25768 9.13362 10.8222 7.23536 10.7852ZM9.52199 7.25638C9.51935 6.00364 8.49779 4.9878 7.24725 4.99396C6.00376 5.00013 4.99408 6.01773 4.99673 7.2621C4.99981 8.51616 6.02093 9.53288 7.27059 9.5254C8.51408 9.51835 9.52464 8.49943 9.52199 7.25638Z" />
      </g>
      <g ref={gRef} 
        className={classnames(
          'marker-tooltip', { 
            'marker-show': isHovering,
            'marker-hide': !isHovering,
          }
        )}>
      </g>
    </g>
  );
};

export default MarkerIcon;

// the default export above is used within the map <svg> container...
// below, this one can be used as an SVG element on its own
export const MarkerIconSvg = (props) => (
  <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <MarkerIcon {...props} />
  </svg>
);