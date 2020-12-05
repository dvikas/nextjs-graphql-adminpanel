import React from 'react';
import loadable from '@loadable/component'

const Chart = loadable(() => import('react-apexcharts'));

const Charts = ({ ...props }) => {
  return <Chart {...props} />;
};

export default Charts;
