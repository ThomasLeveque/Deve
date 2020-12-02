import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { ReloadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'beautiful-react-hooks';

import LinkItem from '../link-item/link-item.component';
import Loading from '../loading/loading.component';
import CustomButton from '../custom-button/custom-button.component';

import { GLOBAL_GRID_SIZE, IS_MOBILE, IS_DESKTOP, IS_TABLET, IS_LARGE_DESKTOP, IS_LARGE_MOBILE } from '../../utils/constants.util';
import { Link } from '../../models/link.model';
import { useLinks } from '../../providers/links/links.provider';

import './link-list.styles.less';

const LinkList: React.FC = () => {
  const [columnSize, setColumnSize] = useState<number>(0);

  const isMobile = useMediaQuery(IS_MOBILE);
  const isLargeMobile = useMediaQuery(IS_LARGE_MOBILE);
  const isTablet = useMediaQuery(IS_TABLET);
  const isDesktop = useMediaQuery(IS_DESKTOP);
  const isLargeDesktop = useMediaQuery(IS_LARGE_DESKTOP);

  const { links, linksLoaded, loadMoreLinks, loadingMoreLinks, hasMoreLinks } = useLinks();

  const getColumnSize = (): number => {
    if (isMobile) {
      return GLOBAL_GRID_SIZE / 1;
    } else if (isLargeMobile) {
      return GLOBAL_GRID_SIZE / 2;
    } else if (isTablet) {
      return GLOBAL_GRID_SIZE / 3;
    } else if (isDesktop) {
      return GLOBAL_GRID_SIZE / 3;
    } else if (isLargeDesktop) {
      return GLOBAL_GRID_SIZE / 4;
    }
  }

  useEffect(() => {
    setColumnSize(getColumnSize());
  }, [isMobile, isTablet, isDesktop, isLargeDesktop, isLargeMobile]);

  if (!linksLoaded) {
    return <Loading />;
  }

  return (
    <div className="link-list">
      <Row gutter={[16, 16]}>
        {Object.keys(links).map((linkId: string, index: number) => {
          const link: Link = links[linkId];
          return (
            <Col key={link.id} span={columnSize}>
              <LinkItem columnSize={columnSize} link={link} index={index} />
            </Col>
          );
        })}
      </Row>
      <div className="load-more">
        <CustomButton
          buttonType="secondary"
          disabled={!hasMoreLinks}
          text={hasMoreLinks ? 'Load more' : 'No more links'}
          loading={loadingMoreLinks}
          onClick={loadMoreLinks}
          hasIcon
          Icon={hasMoreLinks ? ReloadOutlined : CloseCircleOutlined}
        />
      </div>
    </div>
  );
};

export default LinkList;
