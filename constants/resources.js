export const RESOURCES = [
  { 
    id: 'cash', 
    name: 'State Cash', 
    symbol: 'CASH', 
    color: 'text-green-400',
    icon: '💰',
    bgColor: 'bg-gray-700'
  },
  { 
    id: 'gold', 
    name: 'State Gold', 
    symbol: 'GOLD', 
    color: 'text-yellow-400',
    icon: '🏆',
    bgColor: 'bg-gray-700'
  },
  { 
    id: 'oil', 
    name: 'Petróleo', 
    symbol: 'OIL', 
    color: 'text-gray-300',
    icon: '🛢️',
    bgColor: 'bg-gray-800'
  },
  { 
    id: 'ore', 
    name: 'Minério', 
    symbol: 'ORE', 
    color: 'text-orange-400',
    icon: '⛏️',
    bgColor: 'bg-gray-700'
  },
  { 
    id: 'diamond', 
    name: 'Diamante', 
    symbol: 'DIA', 
    color: 'text-cyan-400',
    icon: '💎',
    bgColor: 'bg-gray-700'
  },
  { 
    id: 'uranium', 
    name: 'Urânio', 
    symbol: 'URA', 
    color: 'text-green-400',
    icon: '☢️',
    bgColor: 'bg-gray-700'
  }
];

export const INITIAL_ORDERS = {
  gold: {
    buy: [
      { id: 1, price: 1.25, quantity: 1000, total: 1250, user: 'Злой Санта' },
      { id: 2, price: 1.20, quantity: 2500, total: 3000, user: 'Commander' },
      { id: 3, price: 1.15, quantity: 800, total: 920, user: 'Warrior' }
    ],
    sell: [
      { id: 4, price: 1.30, quantity: 500, total: 650, user: 'General' },
      { id: 5, price: 1.35, quantity: 1200, total: 1620, user: 'Colonel' },
      { id: 6, price: 1.40, quantity: 900, total: 1260, user: 'Captain' }
    ]
  },
  oil: {
    buy: [
      { id: 7, price: 142.50, quantity: 100, total: 14250, user: 'Oil Baron' }
    ],
    sell: [
      { id: 8, price: 144.80, quantity: 150, total: 21720, user: 'Petrol King' }
    ]
  }
};

export const INITIAL_BALANCE = 189277723.87;