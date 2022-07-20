import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { useSelector } from 'react-redux';
import Masonry from 'react-masonry-component';

const Curriculum = (props) => {

  const { allCurriculum: { nodes } } = useStaticQuery(graphql`
    query CurriculumQuery {
      allCurriculum(sort: {fields: order, order: ASC}) {
        nodes {
          id
          speaker
          subtitle
          summary
          title
          url
          image
        }
      }
    }
  `);

  const [ curriculum, setCurriculum ] = useState([]);

  useEffect(() => {
    setCurriculum(nodes);
  }, [ nodes ]);

  const isEditingPage = useSelector((state) => state.adminTools.isEditingPage);

  return (
    <Masonry options={{ gutter: 16 }} className="mt-10">
      { curriculum.map((item) => {
        const { id, title, subtitle } = item;
        const image = item.image ? JSON.parse(item.image) : {};

        return (
          <div key={id} className="mb-10">
            { image.imageSrc && 
              <img src={image.imageSrc} alt={title} />
            }
            <p className="mb-1 mt-1 text-xs text-uppercase text-clamped">{subtitle}</p>
            <h3 className="mb-0 mt-0">{title}</h3>
          </div>
        );
      })}
    </Masonry>
  );
};

export default Curriculum;