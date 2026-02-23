export type MarketAsset = {
    id: string
    symbol: string
    name: string
    price: number
    change: number // %
    volume: string
    category: "Stock" | "Bond" | "FD" | "Crypto" | "Forex"
    // Stock/Equity specific
    pe?: number
    marketCap?: string
    // FD/Debt specific
    interestRate?: number
    lockIn?: string
    // Rating
    aiScore: number // 0-100
    // Actions
    actionLink?: string
    description?: string
}

const COMPANIES = [
    "Reliance Industries", "TCS", "HDFC Bank", "ICICI Bank", "Infosys", "Hindustan Unilever", "ITC", "SBI", "Bharti Airtel", "L&T",
    "Bajaj Finance", "Asian Paints", "HCL Tech", "Maruti Suzuki", "Sun Pharma", "Titan", "Avenue Supermarts", "UltraTech Cement", "Nestle India", "Wipro",
    "ONGC", "M&M", "NTPC", "Power Grid", "Tata Motors", "Adani Enterprises", "JSW Steel", "Tata Steel", "Coal India", "Grasim",
    "Britannia", "Tech Mahindra", "Hindalco", "Apollo Hospitals", "Eicher Motors", "Divi's Lab", "Dr Reddy", "Cipla", "BPCL", "Bajaj Auto",
    "Hero MotoCorp", "UPL", "Tata Consumer", "IndusInd Bank", "SBI Life", "HDFC Life", "Adani Ports", "Bajaj Finserv", "Kotak Bank", "LTIMindtree"
]

export const generateStocks = (): MarketAsset[] => {
    return COMPANIES.map((name, idx) => ({
        id: `STK-${idx}`,
        symbol: name.toUpperCase().substring(0, 4) + (Math.random() > 0.5 ? "" : "LTD"),
        name: name,
        price: Math.round(Math.random() * 5000) + 100,
        change: Number((Math.random() * 4 - 2).toFixed(2)), // -2% to +2%
        volume: `${(Math.random() * 50).toFixed(1)}M`,
        category: "Stock",
        pe: Number((Math.random() * 40 + 10).toFixed(1)),
        marketCap: `${(Math.random() * 20).toFixed(1)}L Cr`,
        aiScore: Math.round(Math.random() * 40 + 50), // 50-90
        actionLink: `https://www.google.com/finance/quote/${name.toUpperCase().substring(0, 4)}:NSE`,
        description: `Large cap stock in ${name.includes("Bank") ? "Banking" : "Technology/Infra"} sector.`
    }))
}

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Punjab National", "Canara", "Union Bank", "Bank of Baroda", "IDFC First", "IndusInd", "Yes Bank"]

export const generateFDs = (): MarketAsset[] => {
    return BANKS.map((name, idx) => ({
        id: `FD-${idx}`,
        symbol: `${name.toUpperCase()} FD`,
        name: `${name} Fixed Deposit`,
        price: 1000,
        change: 0,
        volume: "Unlimited",
        category: "FD",
        interestRate: Number((Math.random() * 3 + 5).toFixed(2)), // 5-8%
        lockIn: `${Math.floor(Math.random() * 5 + 1)} Years`,
        aiScore: Math.round(Math.random() * 30 + 60),
        actionLink: `https://www.google.com/search?q=${name}+fixed+deposit+rates`,
        description: `High safety fixed deposit from ${name}.`
    }))
}

export const generateBonds = (): MarketAsset[] => {
    const bonds = [
        "GOI 2030", "REC Tax Free", "NHAI AAA", "PFC Bond", "Sovereign Gold Bond", "Tata Capital NCD", "Muthoot Finance NCD", "Shriram Transport",
        "L&T Infra Bond", "HDFC Corp Bond", "LIC Housing Bond", "NABARD Bond", "IRFC Tax Free", "HUDCO Bond", "Power Finance Corp"
    ]
    return bonds.map((name, idx) => ({
        id: `BND-${idx}`,
        symbol: name.split(" ")[0].toUpperCase(),
        name: name,
        price: Math.round(Math.random() * 200 + 1000),
        change: Number((Math.random() * 1 - 0.5).toFixed(2)),
        volume: "High",
        category: "Bond",
        interestRate: Number((Math.random() * 4 + 6).toFixed(2)), // 6-10%
        aiScore: Math.round(Math.random() * 20 + 70)
    }))
}

export const generateCrypto = (): MarketAsset[] => {
    const coins = [
        { name: "Bitcoin", symbol: "BTC", price: 5200000 },
        { name: "Ethereum", symbol: "ETH", price: 280000 },
        { name: "Solana", symbol: "SOL", price: 12000 },
        { name: "Binance Coin", symbol: "BNB", price: 32000 },
        { name: "Ripple", symbol: "XRP", price: 55 },
        { name: "Cardano", symbol: "ADA", price: 45 },
        { name: "Avalanche", symbol: "AVAX", price: 3500 },
        { name: "Dogecoin", symbol: "DOGE", price: 12 },
        { name: "Polkadot", symbol: "DOT", price: 650 },
        { name: "Polygon", symbol: "MATIC", price: 85 }
    ]
    return coins.map((c, idx) => ({
        id: `CRY-${idx}`,
        symbol: c.symbol,
        name: c.name,
        price: c.price,
        change: Number((Math.random() * 10 - 5).toFixed(2)),
        volume: "Very High",
        category: "Crypto",
        marketCap: `${(Math.random() * 50 + 10).toFixed(1)}T`,
        aiScore: Math.round(Math.random() * 60 + 20),
        actionLink: `https://coinmarketcap.com/currencies/${c.name.toLowerCase().replace(" ", "-")}/`,
        description: "Decentralized digital currency based on blockchain technology."
    }))
}

export const generateHomeLoans = (): MarketAsset[] => {
    const lenders = [
        { name: "SBI Home Loan", url: "https://homeloans.sbi" },
        { name: "HDFC Reach", url: "https://www.hdfc.com/home-loans" },
        { name: "ICICI Home", url: "https://www.icicibank.com/personal-banking/loans/home-loan" },
        { name: "LIC Housing", url: "https://www.lichousing.com/" },
        { name: "Bajaj Housing", url: "https://www.bajajhousingfinance.in/" },
        { name: "Kotak Home", url: "https://www.kotak.com/en/personal-banking/loans/home-loan.html" },
        { name: "PNB Housing", url: "https://www.pnbhousing.com/" },
        { name: "Axis Home", url: "https://www.axisbank.com/retail/loans/home-loan" },
        { name: "BoB Home", url: "https://www.bankofbaroda.in/personal-banking/loans/home-loan" },
        { name: "Union Home", url: "https://www.unionbankofindia.co.in/english/home-loan.aspx" }
    ]
    return lenders.map((l, idx) => ({
        id: `LOAN-${idx}`,
        symbol: l.name.split(" ")[0].toUpperCase(),
        name: l.name,
        price: 0,
        change: 0,
        volume: "N/A",
        category: "Bond",
        interestRate: Number((Math.random() * 1.5 + 8.3).toFixed(2)),
        lockIn: "Nil",
        aiScore: Math.round(Math.random() * 30 + 60),
        actionLink: l.url,
        description: "Floating rate home loan with zero prepayment charges."
    }))
}

export const generateInsurancePlans = (): MarketAsset[] => {
    const plans = [
        { name: "HDFC Ergo Optima", url: "https://www.hdfcergo.com/" },
        { name: "Niva Bupa ReAssure", url: "https://www.nivabupa.com/" },
        { name: "Star Health Assure", url: "https://www.starhealth.in/" },
        { name: "ICICI Lombard iHealth", url: "https://www.icicilombard.com/" },
        { name: "Care Supreme", url: "https://www.careinsurance.com/" },
        { name: "Tata AIG Medicare", url: "https://www.tataaig.com/" },
        { name: "Aditya Birla Activ", url: "https://www.adityabirlacapital.com/" },
        { name: "ManipalCigna Pro", url: "https://www.manipalcigna.com/" },
        { name: "SBI General Health", url: "https://www.sbigeneral.in/" },
        { name: "Bajaj Allianz", url: "https://www.bajajallianz.com/" }
    ]
    return plans.map((p, idx) => ({
        id: `INS-${idx}`,
        symbol: p.name.split(" ")[0].toUpperCase(),
        name: p.name + " Health",
        price: Math.round(Math.random() * 5000 + 10000),
        change: 0,
        volume: "High",
        category: "Bond",
        marketCap: "₹5L Cover",
        aiScore: Math.round(Math.random() * 20 + 75),
        actionLink: p.url,
        description: "Comprehensive health coverage with cashless hospitalization."
    }))
}

export const fetchLivePrice = async (symbol: string) => {
    // Simulate API delay
    // In a real app, this would fetch from AlphaVantage/Yahoo Finance
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate random price movement around a base
    const basePrice = Math.random() * 2000 + 100
    const change = (Math.random() * 20) - 10
    const changePercent = (change / basePrice) * 100

    return {
        success: true,
        data: {
            price: Number(basePrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: `${change > 0 ? '+' : ''}${changePercent.toFixed(2)}%`
        }
    }
}
