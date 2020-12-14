import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
// import Page from 'src/components/Page';
import Sale from './Sale';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import DailyVisitsInsight from './DailyVisitsInsight';
import Resolution from './Resolution';
import TotalCustomers from './Customers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import ProfitAnalysis from './ProfitAnalysis';
import SaleCategoryAnalysis from './SaleCategoryAnalysis';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  firstRow: {
    height: 'auto'
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (

    <Container maxWidth={false}>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Sale className={classes.firstRow} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalCustomers className={classes.firstRow} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Resolution className={classes.firstRow} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalProfit className={classes.firstRow} />
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          xl={9}
          xs={12}
        >
          <ProfitAnalysis className="" />
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          xl={9}
          xs={12}
        >
          <SaleCategoryAnalysis className="" />
        </Grid>

        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <DailyVisitsInsight className="" />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <TrafficByDevice className="" />
        </Grid>

        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <LatestProducts className="" />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestOrders className="" />
        </Grid>
      </Grid>
    </Container>

  );
};

export default Dashboard;
