/**
 * Graph Data Configuration
 * Single source of truth for all dashboard graphs
 * 
 * Add new graphs here or use the Python script: python3 add_graph.py
 */

export const graphData = [
  {
    id: 1,
    title: "Invested Wealth",
    url: "https://charts.checkonchain.com/btconchain/urpd/urpd_realised/urpd_realised_dark.html",
    category: "Pricing Models",
    details: "There are no details about this chart yet!"
  },
  {
    id: 2,
    title: "Comparison of Aggregate Volume Metrics",
    url: "https://charts.checkonchain.com/btconchain/etfs/etf_volume_vsspot/etf_volume_vsspot_dark.html",
    category: "Spot ETF",
    details: "There are no details about this chart yet!"
  },
  {
    id: 3,
    title: "The HODL Waves",
    url: "https://charts.checkonchain.com/btconchain/supply/hodl_waves_0/hodl_waves_0_dark.html",
    category: "Lifespan",
    details: "There are no details about this chart yet!"
  },
  {
    id: 4,
    title: "Revived Supply Breakdown by Age",
    url: "https://charts.checkonchain.com/btconchain/supply/revived_supply_1_supply/revived_supply_1_supply_dark.html",
    category: "Supply Dynamics",
    details: "There are no details about this chart yet!"
  },
  {
    id: 5,
    title: "Bitcoin ETF Flows [USD]",
    url: "https://charts.checkonchain.com/btconchain/etfs/etf_flows_1_1w/etf_flows_1_1w_dark.html",
    category: "Spot ETF",
    details: "There are no details about this chart yet!"
  },
  {
    id: 6,
    title: "US Dollar Strength",
    url: "https://charts.checkonchain.com/btconchain/tradfi/usdollarstrength/usdollarstrength_dark.html",
    category: "Tradfi",
    details: "There are no details about this chart yet!"
  },
  {
    id: 7,
    title: "Checkonchain Z-Score Confluence for Bitcoin",
    url: "https://charts.checkonchain.com/btconchain/confluence/confluence_zscore_boxwhisker/confluence_zscore_boxwhisker_dark.html",
    category: "Pricing Models",
    details: "There are no details about this chart yet!"
  }
,
  {
    id: 8,
    title: "Bitcoin Cycle Extreme Oscillators",
    url: "https://charts.checkonchain.com/btconchain/confluence/cycleextreme_v2_1/cycleextreme_v2_1_dark.html",
    category: "Pricing Models",
    details: "There are no details about this chart yet!"
  }
];

export const categories = [
  "Pricing Models",
  "Spot ETF", 
  "Derivatives",
  "Strategy",
  "Profit Loss",
  "Lifespan",
  "Network Adoption",
  "Supply Dynamics",
  "Mining",
  "TA and Volatility",
  "Stablecoins",
  "Tradfi"
];

// Category CSS variable mapping - automatically uses colors from colors.css
export const categoryConfig = {
  "Pricing Models": {
    cssVar: "pricing-models"
  },
  "Spot ETF": {
    cssVar: "spot-etf"
  },
  "Derivatives": {
    cssVar: "derivatives"
  },
  "Strategy": {
    cssVar: "strategy"
  },
  "Profit Loss": {
    cssVar: "profit-loss"
  },
  "Lifespan": {
    cssVar: "lifespan"
  },
  "Network Adoption": {
    cssVar: "network-adoption"
  },
  "Supply Dynamics": {
    cssVar: "supply-dynamics"
  },
  "Mining": {
    cssVar: "mining"
  },
  "TA and Volatility": {
    cssVar: "ta-and-volatility"
  },
  "Stablecoins": {
    cssVar: "stablecoins"
  },
  "Tradfi": {
    cssVar: "tradfi"
  }
};

export default graphData;