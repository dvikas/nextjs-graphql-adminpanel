import {
  FruitsVegetable,
  FacialCare,
  DressIcon,
  Handbag,
  BookIcon,
  FurnitureIcon
} from '../../components/AllSvgIcon-2';

export const ParentCategories = {
  FruitsVegetable: 'Grocery',
  Makeup: 'Makeup',
  Bags: 'Bags',
  Clothing: 'Clothing',
  Furniture: 'Furniture',
  Book: 'Book',
}

export const ParentCategoriesWithIcon = [
  {
    name: 'FruitsVegetable',
    icon: <FruitsVegetable />,
    label: 'Grocery',
  },
  {
    name: 'Makeup',
    label: 'Makeup',
    icon: <FacialCare />,
  },
  {
    name: 'Bags',
    label: 'Bags',
    icon: <Handbag />,
  },
  {
    name: 'Clothing',
    label: 'Clothing',
    icon: <DressIcon />,
  },
  {
    name: 'Furniture',
    label: 'Furniture',
    icon: <FurnitureIcon width="15px" height="13px" />,
  },
  {
    name: 'Book',
    label: 'Book',
    icon: <BookIcon width="15px" height="13px" />,
  },
];