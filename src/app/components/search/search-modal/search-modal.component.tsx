import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { Divider } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'beautiful-react-hooks';

// Components
import SearchFilterBar from '../search-filter-bar/search-filter-bar.component';
import SearchLinkList from '../search-link-list/search-link-list.component';
import SearchHeader from '../search-header/search-header.component';

// Others
import { searchClient, indexName } from '../../../algolia/algolia.config';
import { useSearch } from '../../../providers/search/search.provider';
import { animateModalContainer, animateModal } from './search-modal.animate';
import { IS_RESPONSIVE } from '../../../utils/constants.util';

import './search-modal.styles.less';

const SearchModal: React.FC = () => {
  const { toggleSearch, isSearchOpen } = useSearch();
  const isReponsive = useMediaQuery(IS_RESPONSIVE); 

  return (
    <AnimatePresence exitBeforeEnter>
      {isSearchOpen && (
        <motion.div animate="animate" initial="initial" exit="exit">
          <motion.div variants={animateModal} className="search-modal" onClick={() => toggleSearch(false)}>
            <motion.div
              variants={animateModalContainer}
              className="search-modal-container"
              onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation()}
            >
              <InstantSearch searchClient={searchClient} indexName={indexName}>
                <div className="search-modal-content">
                  <SearchHeader />
                  <div className="search-modal-data">
                    {!isReponsive && (
                      <>
                        <SearchFilterBar />
                        <Divider type="vertical" />
                      </>
                    )}
                    <SearchLinkList />
                  </div>
                </div>
              </InstantSearch>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
