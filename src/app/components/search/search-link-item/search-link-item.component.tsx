import React from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Typography, Tooltip, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Highlight } from 'react-instantsearch-dom';

import Tag from '../../tag/tag.component';
import UnderlineLink from '../../underline-link/underline-link.component';

import { ALgoliaLink } from '../../../models/algolia-link.model';
import { useSearch } from '../../../providers/search/search.provider';
import { getDomain } from '../../../utils/format-string.util';

import './search-link-item.styles.less';

interface IProps {
  link: ALgoliaLink;
  index?: number;
}

const SearchLinkItem: React.FC<IProps> = ({ link }) => {
  const { toggleSearch } = useSearch();
  const history = useHistory();
  const { Title } = Typography;

  return (
    <div className="search-link-item">
      <a className="search-link-item-data" href={link.url} target="_blank">
        <div>
          <Tooltip title={link.description}>
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
    </div>
  );
};

export default SearchLinkItem;
