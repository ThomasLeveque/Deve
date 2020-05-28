import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Typography, Tooltip, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Highlight } from 'react-instantsearch-dom';
import { motion } from 'framer-motion';

// Components
import Tag from '../../tag/tag.component';
import UnderlineLink from '../../underline-link/underline-link.component';

// Others
import { ALgoliaLink } from '../../../models/algolia-link.model';
import { useSearch } from '../../../providers/search/search.provider';
import { getDomain } from '../../../utils/format-string.util';

import './search-link-item.styles.less';

interface IProps {
  link: ALgoliaLink;
  index?: number;
}

const SearchLinkItem: React.FC<IProps> = memo(({ link }) => {
  const { toggleSearch } = useSearch();
  const history = useHistory();
  const { Title } = Typography;

  return (
    <motion.div whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }} className="search-link-item">
      <a className="search-link-item-data" href={link.url} target="_blank">
        <div>
          <Tooltip title={link.description} placement="topLeft">
            <Title ellipsis={{ rows: 2 }} level={4}>
              <Highlight tagName="span" hit={link} attribute="description" />
            </Title>
          </Tooltip>
          {link.categories.length > 0 && (
            <div className="tags">
              {link.categories.map((category: string, index: number) => (
                <Tag isButton key={`${category}${index}`} text={category} color="green" />
              ))}
            </div>
          )}
        </div>
        <Row align="bottom" className="author light">
          <Col span={12} className="break-word">
            <UnderlineLink type="not-link-external">On {getDomain(link.url)}</UnderlineLink>
          </Col>
          <Col span={12} className="text-align-right P">
            by {link.postedBy.displayName} | {distanceInWordsToNow(link.createdAt)} ago
          </Col>
        </Row>
      </a>
      <div
        className="search-link-item-actions text-align-center flex column justify-content-center pointer"
        onClick={() => {
          toggleSearch(false);
          history.push(`/links/${link.objectID}`);
        }}
      >
        <Badge count={link.commentCount} showZero overflowCount={99}>
          <MessageOutlined className="icon" />
        </Badge>
      </div>
    </motion.div>
  );
});

export default SearchLinkItem;
