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
    category: "Profit/Loss",
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
,
  {
    id: 9,
    title: "Short-Term Holder SOPR Indicator",
    url: "https://charts.checkonchain.com/btconchain/realised/sthsopr_indicator/sthsopr_indicator_light.html",
    category: "Pricing Models",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 10,
    title: "Short-Term Holder Supply Distribution Heatmap",
    url: "https://charts.checkonchain.com/btconchain/premium/urpd_heatmap_supply_sth/urpd_heatmap_supply_sth_light.html",
    category: "Profit/Loss",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 11,
    title: "Long-Term Holder Supply Distribution Heatmap",
    url: "https://charts.checkonchain.com/btconchain/premium/urpd_heatmap_supply_lth/urpd_heatmap_supply_lth_dark.html",
    category: "Profit/Loss",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 12,
    title: "Long and Short-Term Holder Supply Breakdown",
    url: "https://charts.checkonchain.com/btconchain/supply/breakdown_lthsth_0/breakdown_lthsth_0_dark.html",
    category: "Supply Dynamics",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 13,
    title: "Short-Term Holder Realised Profit/Loss Ratio",
    url: "https://charts.checkonchain.com/btconchain/realised/realisedpnl_ratio_sth/realisedpnl_ratio_sth_light.html",
    category: "Profit/Loss",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 14,
    title: "Realised Profit/Loss Ratio",
    url: "https://charts.checkonchain.com/btconchain/realised/realisedpnl_ratio_all/realisedpnl_ratio_all_light.html",
    category: "Profit/Loss",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 15,
    title: "Long-Term Holder Realised Profit/Loss Ratio",
    url: "https://charts.checkonchain.com/btconchain/realised/realisedpnl_ratio_lth/realisedpnl_ratio_lth_light.html",
    category: "Profit/Loss",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 16,
    title: "Long-Term Holder Binary Spending Indicator",
    url: "https://charts.checkonchain.com/btconchain/supply/binaryspending_indicator/binaryspending_indicator_dark.html",
    category: "Pricing Models",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 17,
    title: "Short-Term Holder MVRV and SOPR",
    url: "https://charts.checkonchain.com/btconchain/unrealised/sthsoprmvrv_indicator/sthsoprmvrv_indicator_dark.html",
    category: "Pricing Models",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 18,
    title: "Perpetual Futures Funding Rates",
    url: "https://charts.checkonchain.com/btconchain/derivatives/derivatives_futures_fundingrate/derivatives_futures_fundingrate_light.html",
    category: "Derivatives",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 19,
    title: "MVRV Ratio Z-Score",
    url: "https://charts.checkonchain.com/btconchain/unrealised/mvrv_all_zscore/mvrv_all_zscore_light.html",
    category: "Pricing Models",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 20,
    title: "Bitcoin Coin-days Destroyed",
    url: "https://charts.checkonchain.com/btconchain/lifespan/cdd/cdd_light.html",
    category: "Lifespan",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 21,
    title: "Binary Coin-days Destroyed",
    url: "https://charts.checkonchain.com/btconchain/lifespan/binarycdd/binarycdd_light.html",
    category: "Lifespan",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 22,
    title: "US Treasury Yield Curve Inversion",
    url: "https://charts.checkonchain.com/macroeconomic/macro/ustreasury_yields_inversion/ustreasury_yields_inversion_light.html",
    category: "Tradfi",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 23,
    title: "Bitcoin Treasury Company Balances",
    url: "https://charts.checkonchain.com/btconchain/entities/bitcoin_treasurycompanies/bitcoin_treasurycompanies_light.html",
    category: "Treasury Companies",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 24,
    title: "Bitcoin Treasury Company mNAV",
    url: "https://charts.checkonchain.com/btconchain/entities/bitcoin_treasurycompanies_mnav/bitcoin_treasurycompanies_mnav_light.html",
    category: "Treasury Companies",
    details: "There are no details about this graph yet!"
  }
,
  {
    id: 25,
    title: "Strategy BTC Accumulation and Holdings",
    url: "https://charts.checkonchain.com/btconchain/entities/mstr_accumulation/mstr_accumulation_light.html",
    category: "Treasury Companies",
    details: "There are no details about this graph yet!"
  }
];

export const categories = [
  "Pricing Models",
  "Spot ETF", 
  "Derivatives",
  "Treasury Companies",
  "Profit/Loss",
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
  "Treasury Companies": {
    cssVar: "treasury-companies"
  },
  "Profit/Loss": {
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