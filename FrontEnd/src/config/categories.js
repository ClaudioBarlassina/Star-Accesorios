export const CATEGORIAS = [
  'Acero Quirurgico',
  'Acero Dorado',
  'Fantasia',
  'Perfumes',
  'Accesorios',
];

export const SUBCATEGORIAS = [
  'Aros',
  'Anillos',
  'Pulseras',
  'Brazalete',
  'Colgantes',
  'Cadenas',
  'Tobilleras',
  'Perfumes',
  'Cabello',
];

export const SUBCATEGORIAS_POR_CATEGORIA = {
  'Acero Quirurgico': ['Aros', 'Anillos', 'Pulseras', 'Brazalete', 'Colgantes', 'Cadenas', 'Tobilleras', 'Cabello'],
  'Acero Dorado': ['Aros', 'Anillos', 'Pulseras', 'Brazalete', 'Colgantes', 'Cadenas', 'Tobilleras', 'Cabello'],
  'Fantasia': ['Aros', 'Anillos', 'Pulseras', 'Colgantes', 'Cadenas', 'Tobilleras', 'Cabello'],
  'Perfumes': ['Perfumes'],
  'Accesorios': ['Cabello', 'Aros', 'Pulseras', 'Colgantes', 'Cadenas', 'Tobilleras'],
};

export const getSubcategoriasDe = (categoria) =>
  SUBCATEGORIAS_POR_CATEGORIA[categoria] || SUBCATEGORIAS;

export const FILTROS_CATEGORIA = [
  {
    name: 'category',
    label: 'Categoría',
    options: CATEGORIAS,
  },
  {
    name: 'subcategory',
    label: 'Subcategoría',
    options: SUBCATEGORIAS,
  },
];
