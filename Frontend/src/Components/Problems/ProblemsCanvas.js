import React from 'react';
import TopicCardsList from './Topics/TopicCardsList';
import OnlyDesktopSVG from '../../Assets/Images/onlyDesktop.svg';

export default function ProblemsCanvas() {
  return (
    <div>
      <div id="onlyDesktop">
        <img src={OnlyDesktopSVG} style={{ height: '20%' }} />
        Sorry! Open this page on a Desktop to access its features
      </div>
      <TopicCardsList />
    </div>
  );
}
