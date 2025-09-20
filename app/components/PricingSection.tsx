import React from 'react';
import Link from 'next/link';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  buttonText: string;
  buttonStyle: 'primary' | 'secondary' | 'outlined';
  features: PricingFeature[];
  isRecommended?: boolean;
  isFree?: boolean;
  isEnterprise?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'A simpler way to chat and collaborate',
    price: 'RM0',
    period: 'free forever',
    buttonText: 'GET STARTED',
    buttonStyle: 'outlined',
    isFree: true,
    features: [
      { text: '90 days of message history', included: true },
      { text: 'Up to 10 apps', included: true },
      { text: '1:1 meetings', included: true },
    ]
  },
  {
    name: 'Pro',
    description: 'Drive productivity in one place',
    price: 'RM35',
    period: 'per user / month, when paying monthly',
    buttonText: 'TRY NOW',
    buttonStyle: 'secondary',
    features: [
      { text: 'Unlimited message history', included: true },
      { text: 'Unlimited app integrations', included: true },
      { text: 'Group meetings', included: true },
    ]
  },
  {
    name: 'Enterprise+',
    description: 'Maximize performance on the most comprehensive work OS',
    price: '',
    period: 'Contact sales for pricing',
    buttonText: 'CONTACT SALES',
    buttonStyle: 'outlined',
    isEnterprise: true,
    features: [
      { text: 'Unlimited message history', included: true },
      { text: 'Unlimited app integrations', included: true },
      { text: 'Group meetings', included: true },
    ]
  }
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4 text-gray-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export default function PricingSection() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8">
            Make teamwork more productive
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-lg border p-8 ${
                plan.isRecommended 
                  ? 'border-purple-200 shadow-lg' 
                  : 'border-gray-200'
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    RECOMMENDED
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  {plan.isEnterprise ? (
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-gray-600 text-sm">{plan.period}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-black">{plan.price}</span>
                        {!plan.isFree && <span className="text-gray-500 ml-1">MYR</span>}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{plan.period}</p>
                    </>
                  )}
                </div>
                
                {plan.isEnterprise ? (
                  <Link href="/request">
                    <button
                      className={`w-full py-3 px-6 rounded-lg font-medium text-sm transition-colors mb-6 ${
                        plan.buttonStyle === 'primary'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : plan.buttonStyle === 'secondary'
                          ? 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </Link>
                ) : (
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium text-sm transition-colors mb-6 ${
                      plan.buttonStyle === 'primary'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : plan.buttonStyle === 'secondary'
                        ? 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                )}
                
                {plan.name === 'Pro' && (
                  <p className="text-center text-sm text-gray-500">Free 30-day trial</p>
                )}
              </div>
              
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <CheckIcon />
                    <span className="text-gray-700 text-sm ml-3 flex items-center">
                      {feature.text}
                      <InfoIcon />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}