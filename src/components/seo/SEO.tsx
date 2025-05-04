import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  children?: React.ReactNode;
}

const SEO = ({
  title = 'CityPulse South Africa - Discover Local Deals & Events',
  description = 'Find the best local deals and events across South Africa. CityPulse connects you with exciting offers and happenings in your area.',
  keywords = 'south africa, deals, events, local, discounts, promotions, cape town, johannesburg, durban',
  ogImage = '/og-image.jpg',
  ogUrl = 'https://citypulse.co.za',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  children
}: SEOProps) => {
  // Ensure the title has the site name
  const fullTitle = title.includes('CityPulse') ? title : `${title} | CityPulse South Africa`;

  // Ensure ogImage is a full URL
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;

  // Use current URL if canonical not provided, but strip the hash for SEO
  const canonical = canonicalUrl || (
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      : 'https://citypulse-sa.vercel.app'
  );

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />

      {/* Additional tags */}
      {children}
    </Helmet>
  );
};

export default SEO;
