import React, { useEffect, useState } from 'react';
import Bus from '../../utils/bus';
import { Close } from '@material-ui/icons';

import './flash.style.scss';

export type FlashType = 'success' | 'error';

const Flash = () => {
  let [visibility, setVisibility] = useState<boolean>(false);
  let [message, setMessage] = useState<string>('');
  let [subtitle, setSubtitle] = useState<string>('');
  let [type, setType] = useState<string>('');

  useEffect(() => {
    Bus.addListener('flash', ({ message, subtitle, type }) => {
      setVisibility(true);
      setMessage(message);
      setSubtitle(subtitle);
      setType(type);
      setTimeout(() => {
        setVisibility(false);
      }, 4000);
    });
  }, []);

  useEffect(() => {
    if (document.querySelector('.close') !== null) {
      document.querySelector('.close').addEventListener('click', () => setVisibility(false));
    }
  });

  return (
    visibility && (
      <div className={`alert alert-${type}`}>
        <div>
          <p className={subtitle && 'bold'}>{message}</p>
          {subtitle && <span>{subtitle}</span>}
        </div>
        <Close className="close pointer" />
      </div>
    )
  );
};

export default Flash;
