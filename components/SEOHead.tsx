import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UserPreferences, OptimizationResult } from '../types';

// ============================================================================
// SEO CONFIGURATION
// ============================================================================

const SEO_CONFIG = {
  siteName: 'VacyMax',
  siteUrl: 'https://vacymax.com',
  twitterHandle: '@vacymax',
  themeColor: '#F43F5E', // Rose accent color
  defaultOgImage: 'https://vacymax.com/og-image.png',
  logoUrl: 'https://vacymax.com/logo.png',
  foundingDate: '2024',
  priceAmount: '4.99',
  priceCurrency: 'USD',
};

// ============================================================================
// VIEW TYPES - Must match App.tsx ViewState
// ============================================================================

type ViewState =
  | 'landing'
  | 'how-it-works'
  | 'results'
  | 'about'
  | 'algorithm'
  | 'privacy'
  | 'terms'
  | 'region-us'
  | 'region-uk'
  | 'region-ca'
  | 'region-au';

interface SEOHeadProps {
  view?: ViewState;
  prefs?: UserPreferences;
  result?: OptimizationResult;
  country?: string;
}

// ============================================================================
// PAGE-SPECIFIC SEO DATA
// ============================================================================

interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  ogType: 'website' | 'article';
  noIndex?: boolean;
}

const getPageSEO = (view: ViewState, country?: string, result?: OptimizationResult): PageSEO => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const pageSEOMap: Record<ViewState, PageSEO> = {
    landing: {
      title: `VacyMax - Maximize Your Vacation Days | PTO Optimizer ${nextYear}`,
      description: `Free vacation optimizer that finds the best dates to use your PTO in ${nextYear}. Get up to 3x more days off by strategically planning around public holidays. Instant results for US, UK, Canada, Australia & Europe.`,
      keywords: [
        'vacation planner',
        'PTO optimizer',
        'holiday calculator',
        'vacation days calculator',
        'time off planner',
        'public holidays',
        'vacation optimization',
        `best time to take vacation ${nextYear}`,
        'maximize PTO days',
        'long weekend planner',
        'bridge day calculator',
        'vacation hack',
        'PTO strategy',
        'work life balance',
        'annual leave optimizer'
      ],
      canonicalPath: '/',
      ogType: 'website'
    },
    'how-it-works': {
      title: `How VacyMax Works | Smart Vacation Planning Algorithm`,
      description: `Learn how VacyMax's AI-powered vacation optimizer finds the perfect dates to maximize your time off. Our algorithm analyzes public holidays, weekends, and bridge days to create your ideal vacation schedule.`,
      keywords: [
        'vacation planning algorithm',
        'how to maximize PTO',
        'vacation optimizer how it works',
        'smart vacation planning',
        'PTO optimization strategy',
        'bridge day strategy',
        'holiday planning tips'
      ],
      canonicalPath: '/how-it-works',
      ogType: 'article'
    },
    results: {
      title: result && country
        ? `${result.totalDaysOff} Days Off in ${country} ${result.targetYear} | VacyMax Results`
        : `Your Optimized Vacation Plan | VacyMax`,
      description: result
        ? `Unlock ${result.totalDaysOff} days off using only ${result.totalPtoUsed} PTO days (${result.totalPtoUsed > 0 ? (result.totalDaysOff / result.totalPtoUsed).toFixed(1) : '∞'}x efficiency). ${result.vacationBlocks.length} perfectly optimized vacation blocks for ${result.targetYear}.`
        : `Your personalized vacation optimization results. See exactly when to take time off for maximum relaxation.`,
      keywords: [
        'vacation plan results',
        'optimized vacation schedule',
        'PTO plan',
        `${country || ''} holidays ${result?.targetYear || nextYear}`,
        'vacation blocks',
        'time off schedule'
      ],
      canonicalPath: country ? `/results/${country.toLowerCase().replace(/\s+/g, '-')}` : '/results',
      ogType: 'article'
    },
    about: {
      title: `About VacyMax | Our Mission to Maximize Your Rest`,
      description: `VacyMax was created to help busy professionals reclaim their time. Learn about our mission to make vacation planning smarter and help you achieve better work-life balance.`,
      keywords: [
        'about VacyMax',
        'vacation planning company',
        'PTO optimizer team',
        'work life balance mission',
        'vacation planning startup'
      ],
      canonicalPath: '/about',
      ogType: 'article'
    },
    algorithm: {
      title: `The VacyMax Algorithm | How We Optimize Your Vacation`,
      description: `Deep dive into the VacyMax optimization algorithm. Learn how we analyze public holidays, weekends, and bridge days to create the most efficient vacation schedule possible.`,
      keywords: [
        'vacation optimization algorithm',
        'PTO algorithm',
        'holiday optimization',
        'bridge day algorithm',
        'vacation planning AI',
        'smart scheduling algorithm'
      ],
      canonicalPath: '/algorithm',
      ogType: 'article'
    },
    privacy: {
      title: `Privacy Policy | VacyMax`,
      description: `Learn how VacyMax protects your privacy and handles your data. We're committed to keeping your vacation planning information safe and secure.`,
      keywords: ['privacy policy', 'data protection', 'VacyMax privacy'],
      canonicalPath: '/privacy',
      ogType: 'article',
      noIndex: false
    },
    terms: {
      title: `Terms of Service | VacyMax`,
      description: `Read the terms and conditions for using VacyMax vacation planning service. Understand your rights and responsibilities as a user.`,
      keywords: ['terms of service', 'terms and conditions', 'VacyMax terms'],
      canonicalPath: '/terms',
      ogType: 'article',
      noIndex: false
    },
    'region-us': {
      title: `US Vacation Planner ${nextYear} | Federal Holidays & PTO Optimizer`,
      description: `Plan your perfect ${nextYear} vacation schedule around US federal holidays. Maximize Memorial Day, July 4th, Labor Day, Thanksgiving & Christmas breaks with smart PTO optimization.`,
      keywords: [
        `US holidays ${nextYear}`,
        'federal holidays USA',
        `American vacation planner ${nextYear}`,
        'US PTO optimizer',
        'Memorial Day weekend',
        'Thanksgiving break planning',
        '4th of July vacation',
        'US long weekends'
      ],
      canonicalPath: '/united-states-vacation-planner',
      ogType: 'article'
    },
    'region-uk': {
      title: `UK Vacation Planner ${nextYear} | Bank Holidays & Annual Leave Optimizer`,
      description: `Plan your perfect ${nextYear} holiday schedule around UK bank holidays. Maximize Easter, May bank holidays, August bank holiday & Christmas breaks with smart annual leave optimization.`,
      keywords: [
        `UK bank holidays ${nextYear}`,
        `British vacation planner ${nextYear}`,
        'UK annual leave optimizer',
        'bank holiday weekends UK',
        'Easter holiday UK',
        'Christmas break planning UK',
        'UK long weekends'
      ],
      canonicalPath: '/united-kingdom-vacation-planner',
      ogType: 'article'
    },
    'region-ca': {
      title: `Canada Vacation Planner ${nextYear} | Statutory Holidays & PTO Optimizer`,
      description: `Plan your perfect ${nextYear} vacation schedule around Canadian statutory holidays. Maximize Victoria Day, Canada Day, Labour Day, Thanksgiving & Christmas breaks.`,
      keywords: [
        `Canada holidays ${nextYear}`,
        'statutory holidays Canada',
        `Canadian vacation planner ${nextYear}`,
        'Canada PTO optimizer',
        'Victoria Day long weekend',
        'Canada Day vacation',
        'Canadian Thanksgiving'
      ],
      canonicalPath: '/canada-vacation-planner',
      ogType: 'article'
    },
    'region-au': {
      title: `Australia Vacation Planner ${nextYear} | Public Holidays & Leave Optimizer`,
      description: `Plan your perfect ${nextYear} holiday schedule around Australian public holidays. Maximize Australia Day, Easter, ANZAC Day, Queen's Birthday & Christmas breaks.`,
      keywords: [
        `Australia holidays ${nextYear}`,
        'Australian public holidays',
        `Australian vacation planner ${nextYear}`,
        'Australia leave optimizer',
        'Australia Day long weekend',
        'ANZAC Day break',
        'Australian Christmas holidays'
      ],
      canonicalPath: '/australia-vacation-planner',
      ogType: 'article'
    }
  };

  return pageSEOMap[view] || pageSEOMap.landing;
};

// ============================================================================
// STRUCTURED DATA GENERATORS
// ============================================================================

const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  logo: SEO_CONFIG.logoUrl,
  sameAs: [
    `https://twitter.com/${SEO_CONFIG.twitterHandle.replace('@', '')}`,
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: `${SEO_CONFIG.siteUrl}/about`
  }
});

const getWebApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  description: 'Free vacation optimizer that finds the best dates to use your PTO. Get up to 3x more days off by strategically planning around public holidays.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: SEO_CONFIG.priceAmount,
    priceCurrency: SEO_CONFIG.priceCurrency,
    description: 'Premium vacation plan unlock'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '2847',
    bestRating: '5',
    worstRating: '1'
  },
  featureList: [
    'Smart PTO optimization',
    'Public holiday integration',
    'Multi-country support',
    'Calendar export',
    'Couple/buddy planning'
  ]
});

const getFAQSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does VacyMax maximize my vacation days?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VacyMax analyzes your available PTO days alongside public holidays and weekends to find "bridge days" - strategic days that connect holidays to weekends, turning a single PTO day into 3-4 days off. Our algorithm can help you get up to 3x more vacation time from your existing PTO.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which countries does VacyMax support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VacyMax supports vacation planning for the United States, United Kingdom, Canada, Australia, and most European countries. Each region includes accurate public holiday data and regional variations.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is VacyMax free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VacyMax offers a free tier that shows your first optimized vacation block. To unlock your complete vacation schedule with all recommended dates and calendar export, a small one-time fee applies.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I plan vacation with my partner using VacyMax?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! VacyMax includes a "Travel Buddy" feature that optimizes vacation schedules for two people, finding overlapping opportunities even when you have different PTO allowances or live in different countries.'
      }
    },
    {
      '@type': 'Question',
      name: 'How accurate are the public holiday dates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VacyMax uses official government sources for public holiday data and is updated annually. We include federal/national holidays as well as popular regional observances for supported countries.'
      }
    }
  ]
});

const getHowToSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Maximize Your Vacation Days',
  description: 'Learn how to get up to 3x more time off by strategically planning your PTO around public holidays.',
  totalTime: 'PT2M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Enter your PTO days',
      text: 'Tell us how many vacation days you have available for the year.',
      position: 1
    },
    {
      '@type': 'HowToStep',
      name: 'Select your timeframe',
      text: 'Choose whether you want to plan for the current year, next year, or a rolling 12-month period.',
      position: 2
    },
    {
      '@type': 'HowToStep',
      name: 'Choose your optimization strategy',
      text: 'Select from Balanced (mix of long and short breaks), Long Weekends (frequent short trips), Extended (fewer but longer vacations), or Regular Resets (consistent breaks).',
      position: 3
    },
    {
      '@type': 'HowToStep',
      name: 'Select your location',
      text: 'Choose your country and optionally your state/region to include local holidays.',
      position: 4
    },
    {
      '@type': 'HowToStep',
      name: 'Get your optimized plan',
      text: 'Receive your personalized vacation schedule with exact dates, showing how to turn your PTO into maximum time off.',
      position: 5
    }
  ]
});

const getBreadcrumbSchema = (view: ViewState, pageSEO: PageSEO) => {
  const breadcrumbs = [
    { name: 'Home', url: SEO_CONFIG.siteUrl }
  ];

  if (view !== 'landing') {
    const pageName = pageSEO.title.split(' | ')[0];
    breadcrumbs.push({
      name: pageName,
      url: `${SEO_CONFIG.siteUrl}${pageSEO.canonicalPath}`
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

const getArticleSchema = (pageSEO: PageSEO) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: pageSEO.title,
  description: pageSEO.description,
  author: {
    '@type': 'Organization',
    name: SEO_CONFIG.siteName
  },
  publisher: {
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    logo: {
      '@type': 'ImageObject',
      url: SEO_CONFIG.logoUrl
    }
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SEO_CONFIG.siteUrl}${pageSEO.canonicalPath}`
  }
});

const getResultsSchema = (result: OptimizationResult, country: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `How to Get ${result.totalDaysOff} Days Off in ${country} in ${result.targetYear}`,
  description: `Optimized vacation plan using ${result.totalPtoUsed} PTO days for ${result.totalDaysOff} total days off. Efficiency: ${(result.totalDaysOff / result.totalPtoUsed).toFixed(1)}x.`,
  author: {
    '@type': 'Organization',
    name: SEO_CONFIG.siteName
  },
  publisher: {
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    logo: {
      '@type': 'ImageObject',
      url: SEO_CONFIG.logoUrl
    }
  },
  datePublished: new Date().toISOString(),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SEO_CONFIG.siteUrl}/results/${country.toLowerCase().replace(/\s+/g, '-')}`
  }
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SEOHead: React.FC<SEOHeadProps> = ({
  view = 'landing',
  prefs,
  result,
  country
}) => {
  const pageSEO = getPageSEO(view, country, result);
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${pageSEO.canonicalPath}`;

  // Dynamic OG Image
  const getOgImage = (): string => {
    if (view === 'results' && result && country) {
      return `${SEO_CONFIG.siteUrl}/api/og?days=${result.totalDaysOff}&country=${encodeURIComponent(country)}&year=${result.targetYear}`;
    }
    return SEO_CONFIG.defaultOgImage;
  };

  // Social-optimized titles (more engaging)
  const getSocialTitle = (): string => {
    if (view === 'results' && result) {
      return `I just unlocked ${result.totalDaysOff} days off using only ${result.totalPtoUsed} PTO days! 🌴`;
    }
    return `${SEO_CONFIG.siteName} - Turn Your PTO Into Epic Vacations ✨`;
  };

  const getSocialDescription = (): string => {
    if (view === 'results' && result) {
      return `VacyMax found me ${result.vacationBlocks.length} perfect vacation blocks in ${result.targetYear}. Calculate yours for free! 🚀`;
    }
    return `Get up to 3x more vacation days by planning smarter. Free PTO optimizer for US, UK, Canada, Australia & Europe. ✈️`;
  };

  // Build structured data array
  const getStructuredData = () => {
    const schemas: object[] = [
      getOrganizationSchema(),
      getBreadcrumbSchema(view, pageSEO)
    ];

    if (view === 'landing') {
      schemas.push(getWebApplicationSchema());
      schemas.push(getFAQSchema());
    }

    if (view === 'how-it-works') {
      schemas.push(getHowToSchema());
      schemas.push(getFAQSchema());
    }

    if (view === 'results' && result && country) {
      schemas.push(getResultsSchema(result, country));
    }

    if (['about', 'algorithm', 'privacy', 'terms'].includes(view) || view.startsWith('region-')) {
      schemas.push(getArticleSchema(pageSEO));
    }

    return schemas;
  };

  const ogImage = getOgImage();
  const socialTitle = getSocialTitle();
  const socialDescription = getSocialDescription();

  return (
    <Helmet>
      {/* --- PRIMARY META TAGS --- */}
      <title>{pageSEO.title}</title>
      <meta name="title" content={pageSEO.title} />
      <meta name="description" content={pageSEO.description} />
      <meta name="keywords" content={pageSEO.keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* --- ROBOTS --- */}
      <meta name="robots" content={pageSEO.noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={pageSEO.noIndex ? 'noindex, follow' : 'index, follow'} />

      {/* --- OPEN GRAPH (Facebook, LinkedIn, WhatsApp, iMessage) --- */}
      <meta property="og:type" content={pageSEO.ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SEO_CONFIG.siteName} - Vacation Planning Made Smart`} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* --- TWITTER CARD --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SEO_CONFIG.siteName} - Vacation Planning Made Smart`} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />

      {/* --- ADDITIONAL SEO TAGS --- */}
      <meta name="language" content="English" />
      <meta name="author" content={SEO_CONFIG.siteName} />
      <meta name="publisher" content={SEO_CONFIG.siteName} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SEO_CONFIG.siteName}`} />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="7 days" />

      {/* --- GEO TAGS (for local SEO) --- */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* --- MOBILE & PWA --- */}
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.siteName} />
      <meta name="application-name" content={SEO_CONFIG.siteName} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content={SEO_CONFIG.themeColor} />

      {/* --- STRUCTURED DATA (JSON-LD) --- */}
      {getStructuredData().map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
