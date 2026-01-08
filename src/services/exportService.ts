'use client';

import type { GeneratedContent, ProductInput, WooProduct } from '../types';
import Papa from 'papaparse';

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const exportToShopifyCSV = (content: GeneratedContent, input: ProductInput) => {
  const productForCsv = {
    "Handle": content.handle || input.name.toLowerCase().replace(/ /g, '-'),
    "Title": content.title,
    "Body (HTML)": content.description,
    "Vendor": content.vendor,
    "Type": input.category,
    "Tags": content.tags.join(', '),
    "Published": "true",
    "Option1 Name": content.option1Name,
    "Option1 Value": content.option1Value,
    "Variant SKU": "",
    "Variant Grams": "0",
    "Variant Inventory Tracker": "shopify",
    "Variant Inventory Qty": "1",
    "Variant Inventory Policy": "deny",
    "Variant Fulfillment Service": "manual",
    "Variant Price": input.price,
    "Variant Requires Shipping": "true",
    "Variant Taxable": "true",
    "Image Src": input.imageUrl || '',
    "Image Position": "1",
    "SEO Title": content.seoTitle,
    "SEO Description": content.metaDescription,
  };
  
  const csv = Papa.unparse([productForCsv]);
  downloadFile(csv, 'shopify_import.csv', 'text/csv;charset=utf-8;');
};


export const exportToWooCommerceCSV = (content: GeneratedContent, input: ProductInput) => {
  const productForCsv = {
    "Type": "simple",
    "Name": content.title,
    "Description": content.description,
    "Short description": content.shortDescription,
    "Categories": input.category,
    "Tags": content.tags.join(', '),
    "Regular price": input.price,
    "Images": input.imageUrl || '',
    "Meta: _yoast_wpseo_metadesc": content.metaDescription,
    "Meta: _yoast_wpseo_focuskw": content.title,
  };

  const csv = Papa.unparse([productForCsv]);
  downloadFile(csv, 'woocommerce_import.csv', 'text/csv;charset=utf-8;');
};


export const exportToWooCommerceJSON = (content: GeneratedContent, input: ProductInput) => {
  const product: WooProduct = {
    name: content.title,
    type: "simple",
    regular_price: input.price,
    description: content.description,
    short_description: content.shortDescription,
    categories: [{ name: input.category }],
    images: input.imageUrl ? [{ src: input.imageUrl }] : [],
    tags: content.tags.map(t => ({ name: t })),
    meta_data: [
      { key: "_yoast_wpseo_metadesc", value: content.metaDescription },
      { key: "_yoast_wpseo_focuskw", value: content.title },
      { key: "_omnicopy_generated", value: "true" }
    ]
  };

  const jsonContent = JSON.stringify([product], null, 2);
  downloadFile(jsonContent, 'woocommerce_export.json', 'application/json');
};
