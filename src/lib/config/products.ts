/**
 * 定义产品特性
 */
export interface ProductFeature {
  name: string;
  included: boolean;
  description?: string;
}

/**
 * 定义一个定价套餐
 */
export interface PricingTier {
  id: string; // 我们系统内部的套餐 ID，如 'free', 'pro', 'enterprise'
  name: string;
  description: string;
  isPopular: boolean;
  features: ProductFeature[];
  pricing: {
    // 针对不同支付提供商的产品ID
    creem: {
      oneTime: string;
      monthly: string;
      yearly: string;
    };
    // stripe: { ... }; // 为未来扩展预留
  };
  prices: {
    oneTime: number;
    monthly: number;
    yearly: number;
  };
  currency: "USD" | "EUR"; // 支持的货币
}

/**
 * Pet AI 平台专用产品套餐定义
 * 实现信用点数 + 订阅会员的混合商业模式
 */
export const PRODUCT_TIERS: PricingTier[] = [
  {
    id: "credits_starter",
    name: "Starter",
    description: "Perfect for trying out our Pet AI magic",
    isPopular: false,
    features: [
      { name: "30 AI generations", included: true },
      { name: "All art styles available", included: true },
      { name: "High-quality downloads", included: true },
      { name: "Priority support", included: true },
      { name: "Watermark removal", included: true },
      { name: "Commercial usage rights", included: true },
      { name: "Priority generation queue", included: false },
      { name: "Exclusive art styles", included: false },
    ],
    pricing: {
      creem: {
        oneTime: "prod_popular_30_credits",
        monthly: "prod_popular_30_credits",
        yearly: "prod_popular_30_credits",
      },
    },
    prices: {
      oneTime: 19.99,
      monthly: 19.99,
      yearly: 19.99,
    },
    currency: "USD",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Unlimited creativity for pet lovers",
    isPopular: true,
    features: [
      { name: "30 monthly AI generations", included: true },
      { name: "All art styles + exclusive ones", included: true },
      { name: "Ultra high-quality downloads", included: true },
      { name: "Priority support", included: true },
      { name: "Watermark removal", included: true },
      { name: "Commercial usage rights", included: true },
      { name: "Priority generation queue", included: true },
      { name: "Exclusive art styles", included: true },
    ],
    pricing: {
      creem: {
        oneTime: "prod_premium_monthly_sub",
        monthly: "prod_premium_monthly_sub",
        yearly: "prod_premium_yearly_sub",
      },
    },
    prices: {
      oneTime: 9.99,
      monthly: 9.99,
      yearly: 99.99,
    },
    currency: "USD",
  },
  {
    id: "credits_bulk",
    name: "Bulk",
    description: "Best value for frequent users",
    isPopular: false,
    features: [
      { name: "100 AI generations", included: true },
      { name: "All art styles available", included: true },
      { name: "Ultra high-quality downloads", included: true },
      { name: "Priority support", included: true },
      { name: "Watermark removal", included: true },
      { name: "Commercial usage rights", included: true },
      { name: "Priority generation queue", included: true },
      { name: "Exclusive art styles", included: false },
    ],
    pricing: {
      creem: {
        oneTime: "prod_bulk_100_credits",
        monthly: "prod_bulk_100_credits",
        yearly: "prod_bulk_100_credits",
      },
    },
    prices: {
      oneTime: 59.99,
      monthly: 59.99,
      yearly: 59.99,
    },
    currency: "USD",
  },
];

/**
 * 根据内部套餐 ID 获取套餐详情
 * @param id - 套餐 ID ('pro', 'enterprise'等)
 * @returns PricingTier | undefined
 */
export const getProductTierById = (id: string): PricingTier | undefined => {
  return PRODUCT_TIERS.find((tier) => tier.id === id);
};

/**
 * 根据支付提供商的产品ID反查套餐详情
 * @param productId - 支付提供商的产品 ID
 * @returns PricingTier | undefined
 */
export const getProductTierByProductId = (
  productId: string,
): PricingTier | undefined => {
  for (const tier of PRODUCT_TIERS) {
    if (Object.values(tier.pricing.creem).includes(productId)) {
      return tier;
    }
  }
  return undefined;
};
