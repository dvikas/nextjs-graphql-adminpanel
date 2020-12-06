import React from 'react';
import clsx from 'clsx';
import loadable from '@loadable/component'

const Chart = loadable(() => import('react-apexcharts'));

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(() => ({
  root: {}
}));

type Props = {
  className: string
};

const SaleCategoryAnalysis: React.FC<Props> = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const options = {
    series: [{
      name: 'Grocery',
      data: [44, 55, 41, 67, 22, 43, 21, 49]
    }, {
      name: 'Clothing',
      data: [13, 23, 20, 8, 13, 27, 33, 12]
    }, {
      name: 'Furniture',
      data: [11, 17, 15, 15, 21, 14, 15, 13]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      xaxis: {
        categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2',
          '2012 Q3', '2012 Q4'
        ],
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'right',
        offsetX: 0,
        offsetY: 50
      },
    },


  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={(
          <Button
            endIcon={<ArrowDropDownIcon />}
            size="small"
            variant="text"
          >
            Last 7 days
          </Button>
        )}
        title="Product Sales"
      />
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >

          <Chart
            options={options.options}
            series={options.series}
            height="350" type="bar"
            width="97%"
          />

        </Box>
      </CardContent>

    </Card>
  );
};

export default SaleCategoryAnalysis;