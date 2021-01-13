import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';

// import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
// import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

// import EditIcon from '@material-ui/icons/Edit';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import styled from '@emotion/styled';
// import ApolloClient from 'apollo-client';
import Link from 'next/link';
import { useApolloClient, useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
// import MaterialTable from 'material-table';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
// import Add from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Slider from '@material-ui/core/Slider';
import Router from 'next/router'

// import { customTheme } from '../../utils/styles/theme';
import Message, { TOGGLE_SNACKBAR_MUTATION } from '../Material/SuccessMessage';
import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
// import Slide from '@material-ui/core/Slide';
// import { TransitionProps } from '@material-ui/core/transitions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CardActionArea from '@material-ui/core/CardActionArea';
import { OrderByArg } from '../../graphql/generated/graphql-global-types';
import { usePaginationQuery } from '../../utils/hooks/usePaginationQuery';
import Pagination from '@material-ui/lab/Pagination';
import { useStyles } from './ProductStyle';
import { GET_PRODUCTS } from './ProductQuery';
import { GET_CATEGORIES } from '../Category/CategoryQuery';
import EditProduct from './EditProduct';
import { categories, categoriesVariables, categories_categories_nodes } from '../../graphql/generated/categories';


var classNames = require('classnames');
const previewPageSize = 10;

function valuetext(value: number) {
    return `${value}%`;
}

type Props = {
    isPreview?: boolean;
};

const orderByValues = [{
    key: 'updatedAt',
    value: 'Added Date',
}, {
    key: 'price',
    value: 'Price'
}, {
    key: 'name',
    value: 'Product Name'
}
];

interface NewProductForm {
    id: string
    name: string
    Category: string
    ProductImages: string[]
    prodName: string
    description: string
    discount: number
    price: number
    salePrice: number
    sku: string
    unit: string
    slug: string
    parentCategory: string
    childCategory: string
    productImages: string[]
}

const editProductDefaultValues = {
    id: '',
    prodName: '',
    description: '',
    discount: 0,
    price: 0,
    salePrice: 0,
    sku: '',
    unit: '',
    slug: '',
    parentCategory: '',
    childCategory: '',
    images: {}
};

const Product: React.FC<Props> = ({ isPreview = false }) => {
    const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);
    const classes = useStyles();

    const { page, orderBy, pageSize, setQuery, direction } = usePaginationQuery({
        orderBy: 'updatedAt',
        direction: OrderByArg.desc,
    });
    const [pagingPage, setPage] = React.useState(page);
    const [pagingPageSize, setPagingPageSize] = React.useState(pageSize);
    const [pagingPageSizeDialog, setPagingPageSizeDialog] = React.useState(false);
    const [pagingOrderBy, setPagingOrderBy] = React.useState('updatedAt');
    const [allChildCategories, setChildCategories] = useState([{ name: '', id: '', parent: '', slug: '' }]);

    const [getCategories, { loading: loadingChildCategories }] = useLazyQuery<categories, categoriesVariables>(GET_CATEGORIES, {
        onCompleted: (data) => {
            if (data.categories.nodes.length) {
                setChildCategories(data.categories.nodes)
            }
        },
    });

    const [isDiscount, setIsDiscount] = React.useState(false);
    const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsDiscount(event.target.checked);
    };

    const [discountText, setDiscountText] = React.useState('20% - 70%');
    const [discountSliderValue, setDiscountSliderValue] = React.useState<number[]>([20, 70]);
    const handleDiscountSliderChange = (event: any, newValue: number | number[]) => {
        console.log('Discount is', newValue)
        setDiscountSliderValue(newValue as number[]);
        const arr = newValue as number[]
        // console.log(arr[0])
        setDiscountText(arr[0] + '% - ' + arr[1] + '%')
    };

    const [editProductDetails, setEditProductDetails] = React.useState(editProductDefaultValues);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const handleClickOpenEditDialog = (product: NewProductForm) => {
        const category = product.Category as any

        getCategories({ variables: { parentQuery: category.parent } })

        if (!loadingChildCategories) {

            setTimeout(() => {
                setEditProductDetails({
                    id: product.id,
                    prodName: product.name,
                    description: product.description,
                    discount: product.discount,
                    price: product.price,
                    salePrice: product.salePrice,
                    sku: product.sku,
                    unit: product.unit,
                    slug: '',
                    parentCategory: category.parent,
                    childCategory: category.id,
                    images: product.ProductImages
                });
                setEditDialogOpen(true);
            }, 200)
        }

    };
    const handleClose = () => {
        setEditDialogOpen(false);
    };

    const [orderByFilter, setOrderBy] = React.useState('updatedAt');
    const handleChangeOrderBy = (event: React.ChangeEvent<{ value: unknown }>) => {
        setOrderBy(event.target.value as string);
        setQuery(
            {
                orderBy: (event.target.value as any)
            })
    };

    const [orderByDirection, setOrderByDirection] = React.useState(direction);
    const handleChangeDirection = (event: React.ChangeEvent<{ value: unknown }>) => {
        setOrderByDirection(event.target.value as any);
        setQuery(
            {
                direction: (event.target.value as any)
            })
    };

    const [productName, setProductName] = useState('');
    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleProductNameChange called')
        setProductName(e.target.value)
    }

    const handleClosePageSize = () => {
        setPagingPageSizeDialog(false);
    };

    const handleOpenPageSize = () => {
        setPagingPageSizeDialog(true);
    };

    const skip = isPreview ? 0 : (page - 1) * pageSize;
    const first = isPreview ? previewPageSize : pageSize;
    const productQueryVariables = {
        first,
        skip,
        nameQuery: productName,
        discount: isDiscount ? discountSliderValue.toString() : '',
        orderBy: {
            [orderBy]: direction,
        }
    };
    const { data, error, loading, refetch } = useQuery(GET_PRODUCTS, {
        variables: productQueryVariables
    });

    const pagingHandleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const pushQueryParam = () => {
        Router.push({
            pathname: '/products',
            query: { pageSize: pagingPageSize, page: pagingPage, productName: encodeURI(productName), orderBy, direction },
        });
    }

    useEffect(() => {
        pushQueryParam()
        // refetch();
    }, [pagingPage, orderBy, productName, pagingPageSize]);

    const discountLabel = () => {
        return isDiscount ? 'Discount(' + discountText + ')' : 'Discount'
    }
    const handleEditDialogOpen = (val: boolean) => {
        setEditDialogOpen(val)
    }
    return (
        <div>
            <Message />

            <Link href="add-product">
                <Fab color="primary" className={classes.newProduct} aria-label="add">
                    <AddIcon />
                </Fab>
            </Link>

            <fieldset className={classes.searchBar}>
                <legend className={classes.searchLegend}>Search</legend>
                <div>
                    <Grid
                        container
                        justify="center"
                        alignItems="center"
                        direction="row"
                        className={classes.filterBox}
                    >
                        <Grid
                            className={classes.searchInput}
                            item
                            xs={12} sm={6} md={3}
                        >
                            <TextField label="Product name"
                                onInput={handleProductNameChange}
                                value={productName}
                                variant="outlined" fullWidth />

                        </Grid>
                        <Grid
                            className={classes.searchInput}
                            item
                            xs={12} sm={6} md={3}
                        >
                            <Typography id="discount-range" gutterBottom>

                                <FormControlLabel
                                    control={<Checkbox checked={isDiscount} onChange={handleDiscountChange} name="discountPercent" />}
                                    label={discountLabel()}
                                />
                            </Typography>
                            <Slider
                                value={discountSliderValue}
                                disabled={!isDiscount}
                                onChange={handleDiscountSliderChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="discount-range"
                                getAriaValueText={valuetext}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className={classes.searchInput}>
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel id="sort-by">Sort By</InputLabel>
                                <Select
                                    labelId="sort-by"
                                    id="sortSelect"
                                    value={orderByFilter}
                                    onChange={handleChangeOrderBy}
                                >
                                    {orderByValues.map((name) => (
                                        <MenuItem key={name.key} value={name.key} >
                                            {name.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} >
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel id="direction-by">Direction</InputLabel>
                                <Select
                                    labelId="direction-by"
                                    id="directionSelect"
                                    value={orderByDirection}
                                    onChange={handleChangeDirection}
                                >

                                    <MenuItem value='asc' >Ascending</MenuItem>
                                    <MenuItem value='desc' >Descending</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            </fieldset>
            { !loading ? data.products.nodes.length > 0 ? (
                <Grid container justify="center" spacing={2}>
                    {data.products.nodes.map((product: any) => (
                        <Grid key={product.id} item>
                            <Card className={classes.root}
                                onClick={e => {
                                    handleClickOpenEditDialog(product)
                                }}
                            >
                                <CardActionArea>
                                    <Grid item xs={12}>
                                        <div className={classes.parentImageContainer}>
                                            <CardMedia
                                                className={classes.media}
                                                image={product.ProductImages[0] ? product.ProductImages[0].image : '../images/no-product-image.png'}
                                                title={product.name}
                                            />
                                            <span className={classes.discountInPercent}>{product.discount}% off</span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CardHeader
                                            classes={{
                                                title: classes.title,
                                                subheader: classes.subheader,
                                            }}

                                            title={product.name}
                                            subheader={product.Category.parent + ' › ' + product.Category.name}
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" className={classes.discountedPrice} color="textSecondary" component="span">
                                                        ${product.salePrice}
                                                    </Typography>
                                                    <Typography variant="body2" className={classes.price} color="textSecondary" component="span">
                                                        ${product.price}
                                                    </Typography>
                                                </Grid>
                                                <Grid container item xs={6} justify="flex-end"
                                                >
                                                    <Typography variant="body2" color="textSecondary" component="span">
                                                        {product.unit}
                                                    </Typography>
                                                </Grid>

                                            </Grid>
                                        </CardContent>
                                        {/* <CardActions disableSpacing>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <IconButton aria-label="add to favorites">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={6} container justify="flex-end">
                                            <IconButton aria-label="share">
                                                <EditIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardActions> */}
                                    </Grid>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}

                    <Grid container justify="center" spacing={2} className={classes.pagination}>
                        <Grid
                            item xs={12} sm={6} md={4}>
                            <Grid container
                                direction="row"
                                justify="center"
                                alignItems="center" >

                                <Grid item xs={2}>
                                    <FormControl >
                                        <InputLabel id="paging-page-size-label">Size</InputLabel>
                                        <Select
                                            labelId="paging-page-size-label"
                                            id="pagingPageSizeId"
                                            displayEmpty
                                            open={pagingPageSizeDialog}
                                            onClose={handleClosePageSize}
                                            onOpen={handleOpenPageSize}
                                            value={pageSize}
                                            onChange={(e): void => setQuery(
                                                {
                                                    pageSize: parseInt((e.target as HTMLInputElement).value)
                                                })}
                                        >
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={10}>
                                    <Pagination
                                        page={pagingPage} onChange={pagingHandleChange}
                                        count={Math.ceil(data.products.totalCount / pageSize)} defaultPage={1} variant="outlined" color="primary" />
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            ) : (
                    <Alert severity="info">
                        There is no product in db.
                        Please&nbsp;
                        <Link href="add-product">
                            add new product.
                        </Link>
                    </Alert>
                )
                : (<div>Loading</div>)
            }



            {/* Dialog for product details and edit */}
            < Dialog
                classes={{
                    root: classNames({
                        [classes.drawerOpen]: editDialogOpen,
                        [classes.drawerClose]: !editDialogOpen,
                    }),
                }}
                fullScreen open={editDialogOpen} onClose={handleClose} >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.dialogTitle}>
                            Edit
            </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            close
            </Button>
                    </Toolbar>
                </AppBar>
                <EditProduct
                    handleEditDialogOpen={handleEditDialogOpen}
                    id={editProductDetails.id}
                    prodName={editProductDetails.prodName}
                    description={editProductDetails.description}
                    discount={editProductDetails.discount}
                    price={editProductDetails.price}
                    salePrice={editProductDetails.salePrice}
                    sku={editProductDetails.sku}
                    unit={editProductDetails.unit}
                    slug={editProductDetails.slug}
                    parentCategory={editProductDetails.parentCategory}
                    childCategory={editProductDetails.childCategory as any}
                    childCategories={allChildCategories}
                    productImages={editProductDetails.images as any ? editProductDetails.images as any : []}
                    productQueryVariables={productQueryVariables}
                />
            </ Dialog>

        </div >
    );

};

export default Product;
