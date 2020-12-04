import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    // backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
  bgImage: {
    background: "url('/images/money-bag.svg')",
    backgroundRepeat: 'round',
    "&:before": {
      backgroundColor: "rgba(0,0,0,0.25)"
    }
  }
}));

type Props = {
  className: string
};

const Budget: React.FC<Props> = ({ className, ...rest }) => {

  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              BUDGET
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              $24,000
            </Typography>
          </Grid>
          <Grid item>
            <Avatar src="/images/money-bag.svg" className={classes.avatar}>

            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <ArrowDownwardIcon className={classes.differenceIcon} />
        <Typography
          className={classes.differenceValue}
          variant="body2"
        >
          122%
          </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
          </Typography>
      </CardActions>
    </Card>
  );
};

// Budget.propTypes = {
//   className: PropTypes.string
// };

export default Budget;
