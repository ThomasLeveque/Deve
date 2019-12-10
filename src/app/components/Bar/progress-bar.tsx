import React from 'react';
import { useNProgress } from '@tanem/react-nprogress';

interface IProps {
  isAnimating: boolean;
}

interface IProgress {
  animationDuration: number;
  isFinished: boolean;
  progress: number;
}

const ProgressBar: React.FC<IProps> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress }: IProgress = useNProgress({
    isAnimating
  });

  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`
      }}
    >
      <div
        style={{
          background: '#00ae96',
          height: 2,
          left: 0,
          marginLeft: `${(-1 + progress) * 100}%`,
          position: 'fixed',
          top: 60,
          transition: `margin-left ${animationDuration}ms linear`,
          width: '100%',
          zIndex: 1031
        }}
      />
    </div>
  );
};

export default ProgressBar;
