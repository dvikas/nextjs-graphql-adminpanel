import React from 'react';
import clsx from 'clsx';

import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const cardColor = colors.green['500']

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  },
  cardHeader: {
    color: cardColor,
    fontWeight: 400,
    textTransform: 'uppercase'
  },
  amount: {
    fontWeight: 300
  },
  bgCover: {
    backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%,rgba(255,255,255,0.8) 100%), url(/images/customers.svg)",
    backgroundAttachment: "static",
    backgroundPosition: "right",
    backgroundRepeat: "no-repeat",
    backgroundSize: "30%",
    borderLeft: `5px solid ${cardColor}`,
  },
  actionBar: {
    background: "linear-gradient(90deg, rgba(187,179,179,1) 0%, rgba(255,255,255,1) 100%)",
    borderLeft: `5px solid ${cardColor}`
  }

}));

type Props = {
  className: string
};

const Customers: React.FC<Props> = ({ className, ...rest }) => {

  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >

      <CardContent className={classes.bgCover}>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              className={classes.cardHeader}
              gutterBottom
              variant="h6"
            >
              customers
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
              className={classes.amount}
            >
              $24,000
            </Typography>
          </Grid>

        </Grid>
      </CardContent>
      <CardActions className={classes.actionBar}>
        <ArrowUpwardIcon className={classes.differenceIcon} />
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

export default Customers;
