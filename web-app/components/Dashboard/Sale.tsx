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

const cardColor = colors.purple['500']

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
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
  cardHeader: {
    color: cardColor,
    fontWeight: 400
  },
  amount: {
    fontWeight: 300
  },
  bgCover: {
    backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%,rgba(255,255,255,0.8) 100%), url(/images/sales.svg)",
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

const Sale: React.FC<Props> = ({ className, ...rest }) => {

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
              SALE
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

export default Sale;
