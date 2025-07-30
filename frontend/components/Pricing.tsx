// <Pricing/> displays the subscription pricing plans for the car price predictor app
// Features "Coming Soon" buttons as the subscription functionality is not yet available

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for individual car buyers and sellers',
      features: [
        '5 price predictions per month',
        'Basic market analysis',
        'VIN lookup included',
        'Email support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$24.99',
      period: '/month',
      description: 'Ideal for dealers and automotive professionals',
      features: [
        '25 price predictions per month',
        'Advanced market insights',
        'Bulk VIN processing',
        'Priority support',
        'API access',
        'Custom reports',
        'Historical data access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99.99',
      period: '/month',
      description: 'For large dealerships and automotive businesses',
      features: [
        'Unlimited price predictions',
        'Real-time market data',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced analytics',
        'SLA guarantee',
        'Training & onboarding'
      ],
      popular: false
    }
  ];

  return (
    <section className="bg-base-200 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-6xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">Pricing</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            Choose the perfect plan for your car valuation needs
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto mt-4">
            All plans include our advanced AI predictions and market analysis. Get started with a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative p-8 rounded-2xl ${plan.popular ? 'bg-primary text-primary-content scale-105' : 'bg-base-100'} shadow-xl`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-secondary text-secondary-content px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg opacity-70">{plan.period}</span>
                </div>
                <p className={`text-sm ${plan.popular ? 'text-primary-content/80' : 'text-base-content/70'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className={`w-5 h-5 mr-3 ${plan.popular ? 'text-primary-content' : 'text-success'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-primary-content' : 'text-base-content'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 cursor-not-allowed opacity-60 ${
                  plan.popular
                    ? 'bg-primary-content text-primary hover:bg-primary-content/90'
                    : 'bg-primary text-primary-content hover:bg-primary/90'
                }`}
                disabled
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-base-content/70 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-base-content/60">
            Need a custom solution? <span className="text-primary font-semibold">Contact our sales team</span> for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
