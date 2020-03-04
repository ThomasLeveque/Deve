import React, { useRef, Fragment } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { animated, useChain, useSpring } from 'react-spring';

import SearchFilterBar from '../search-filter-bar/search-filter-bar.component';
import SearchLinkList from '../search-link-list/search-link-list.component';
import { searchClient, indexName } from '../../algolia/algolia.config';
import SearchHeader from '../search-header/search-header.component';

import './search-layout.styles.less';

interface IProps {
  searchOpen: boolean;
  searchClicked: () => void;
}

const SearchLayout: React.FC<IProps> = ({ searchOpen, searchClicked }) => {
  const layoutRef = useRef();
  const layoutProps = useSpring({
    from: { opacity: 0, pointerEvents: 'none' },
    to: { opacity: searchOpen ? 1 : 0, pointerEvents: searchOpen ? 'visible' : 'none' },
    ref: layoutRef
  });

  const modalRef = useRef();
  const modalProps = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(0, 20px, 0)',
      pointerEvents: 'none'
    },
    to: {
      opacity: searchOpen ? 1 : 0,
      transform: searchOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
      pointerEvents: searchOpen ? 'visible' : 'none'
    },
    ref: modalRef
  });

  useChain(searchOpen ? [layoutRef, modalRef] : [modalRef, layoutRef], [0, 0.1]);
  return (
    <>
      <animated.div onClick={searchOpen ? searchClicked : null} style={layoutProps} className="search-layout" />
      <div className="search-modal">
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <animated.div style={modalProps} className="search-modal-container">
            <SearchHeader />
            <SearchFilterBar />
            <SearchLinkList />
          </animated.div>
        </InstantSearch>
      </div>
    </>
  );
};

export default SearchLayout;
