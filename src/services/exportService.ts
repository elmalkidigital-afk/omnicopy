'use client';

import type { GeneratedContent, ProductInput } from '../types';

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

const escapeCsvField = (field: string | undefined | null): string => {
  if (field === undefined || field === null) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};


export const exportToShopifyCSV = (content: GeneratedContent, input: ProductInput) => {
  const product = {
    "Handle": content.handle,
    "Title": content.title,
    "Body (HTML)": content.description,
    "Vendor": "OmniCopy AI Store",
    "Type": input.category,
    "Tags": content.tags.join(', '),
    "Published": "true",
    "Option1 Name": "Title",
    "Option1 Value": "Default Title",
    "Variant SKU": "",
    "Variant Grams": "0",
    "Variant Inventory Tracker": "shopify",
    "Variant Inventory Qty": "1",
    "Variant Inventory Policy": "deny",
    "Variant Fulfillment Service": "manual",
    "Variant Price": input.price,
    "Variant Requires Shipping": "true",
    "Variant Taxable": "true",
    "Image Src": input.imageUrl,
    "Image Position": "1",
    "SEO Title": content.title,
    "SEO Description": content.metaDescription,
  };

  const headers = Object.keys(product);
  const row = headers.map(header => escapeCsvField(product[header as keyof typeof product]));

  const csvContent = [headers.join(','), row.join(',')].join('\n');
  downloadFile(csvContent, 'shopify_import.csv', 'text/csv;charset=utf-8;');
};


export const exportToWooCommerceJSON = (content: GeneratedContent, input: ProductInput) => {
  const wooData = [{
    name: content.title,
    type: "simple",
    regular_price: input.price.toString(),
    description: content.description,
    short_description: content.shortDescription,
    categories: [{ name: input.category }],
    images: input.imageUrl ? [{ src: input.imageUrl }] : [],
    tags: content.tags.map(tag => ({ name: tag })),
    meta_data: [
      { key: "_yoast_wpseo_metadesc", value: content.metaDescription },
      { key: "_omnicopy_generated", value: "true" }
    ]
  }];

  const dataStr = JSON.stringify(wooData, null, 2);
  downloadFile(dataStr, "woo_import.json", "data:text/json;charset=utf-8,");
};
