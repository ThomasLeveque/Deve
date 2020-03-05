import React, { useRef, useContext } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { animated, useChain, useSpring } from 'react-spring';
import { Divider } from 'antd';

import SearchFilterBar from '../search-filter-bar/search-filter-bar.component';
import SearchLinkList from '../search-link-list/search-link-list.component';
import { searchClient, indexName } from '../../algolia/algolia.config';
import SearchHeader from '../search-header/search-header.component';
import { SearchContext } from '../../providers/search/search.provider';

import './search-layout.styles.less';

const SearchLayout: React.FC = () => {
  const { isSearchOpen, toggleSearch } = useContext(SearchContext);

  const layoutRef = useRef();
  const layoutProps = useSpring({
    from: { opacity: 0, pointerEvents: 'none' },
    to: { opacity: isSearchOpen ? 1 : 0, pointerEvents: isSearchOpen ? 'visible' : 'none' },
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
      opacity: isSearchOpen ? 1 : 0,
      transform: isSearchOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
      pointerEvents: isSearchOpen ? 'visible' : 'none'
    },
    ref: modalRef
  });

  useChain(isSearchOpen ? [layoutRef, modalRef] : [modalRef, layoutRef], [0, 0.1]);
  return (
    <>
      <animated.div onClick={() => toggleSearch(false)} style={layoutProps} className="search-layout" />
      <div className="search-modal">
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <animated.div style={modalProps} className="search-modal-container">
            <SearchHeader />
            <div className="search-modal-data">
              <SearchFilterBar />
              <Divider type="vertical" />
              <SearchLinkList />
            </div>
          </animated.div>
        </InstantSearch>
      </div>
    </>
  );
};

export default SearchLayout;
