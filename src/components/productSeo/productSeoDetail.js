import React from 'react';
import { Helmet } from 'react-helmet';

const ProductSEOdetail = ({ seo }) => {
  if (!seo) return null;

  return (
    <Helmet>
      {/* Título y Descripción Básica */}
      {seo.name && <title>{seo.name} || Asdimor.com</title>}
      {seo.metaDesc && <meta name="description" content={seo.metaDesc} />}
      {seo.focuskw && <meta name="keywords" content={seo.focuskw} />}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      {seo.opengraphTitle && <meta property="og:title" content={seo.opengraphTitle} />}
      {seo.opengraphDescription && <meta property="og:description" content={seo.opengraphDescription} />}
      {seo.opengraphImage?.sourceUrl && (
        <meta property="og:image" content={seo.opengraphImage.sourceUrl} />
      )}

      {/* Twitter Cards */}
      {seo.twitterTitle && <meta name="twitter:title" content={seo.twitterTitle} />}
      {seo.twitterDescription && <meta name="twitter:description" content={seo.twitterDescription} />}
      {seo.twitterImage?.sourceUrl && (
        <meta name="twitter:image" content={seo.twitterImage.sourceUrl} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default ProductSEOdetail;