import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoModal } from "@/components/CryptoModal";
import { api, Crypto } from "@/services/api";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

const SORT_OPTIONS = {
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  MCAP_ASC: "mcap-asc",
  MCAP_DESC: "mcap-desc",
  CHANGE_ASC: "change-asc",
  CHANGE_DESC: "change-desc",
} as const;

const Index = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>(SORT_OPTIONS.MCAP_DESC);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const { data: cryptos = [], isLoading } = useQuery({
    queryKey: ["cryptos"],
    queryFn: api.getAssets,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: history = [] } = useQuery({
    queryKey: ["crypto-history", selectedCrypto?.id],
    queryFn: () => (selectedCrypto ? api.getAssetHistory(selectedCrypto.id) : []),
    enabled: !!selectedCrypto,
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteClick = (crypto: Crypto) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(crypto.id);
      const newFavorites = isFavorite
        ? prev.filter((id) => id !== crypto.id)
        : [...prev, crypto.id];

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${crypto.name} has been ${
          isFavorite ? "removed from" : "added to"
        } your favorites`,
      });

      return newFavorites;
    });
  };

  const getMarketTrend = () => {
    const positiveChanges = cryptos.filter(
      (crypto) => parseFloat(crypto.changePercent24Hr) > 0
    ).length;
    const totalCryptos = cryptos.length;
    const positivePercentage = (positiveChanges / totalCryptos) * 100;

    return {
      trend: positivePercentage > 50 ? "bullish" : "bearish",
      percentage: positivePercentage,
    };
  };

  const marketTrend = getMarketTrend();

  const filteredAndSortedCryptos = [...cryptos]
    .filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(search.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case SORT_OPTIONS.PRICE_ASC:
          return parseFloat(a.priceUsd) - parseFloat(b.priceUsd);
        case SORT_OPTIONS.PRICE_DESC:
          return parseFloat(b.priceUsd) - parseFloat(a.priceUsd);
        case SORT_OPTIONS.MCAP_ASC:
          return parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd);
        case SORT_OPTIONS.MCAP_DESC:
          return parseFloat(b.marketCapUsd) - parseFloat(a.marketCapUsd);
        case SORT_OPTIONS.CHANGE_ASC:
          return (
            parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr)
          );
        case SORT_OPTIONS.CHANGE_DESC:
          return (
            parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)
          );
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Crypto Tracker</h1>
        <div className="flex items-center space-x-2 text-sm">
          <span>Market Trend:</span>
          {marketTrend.trend === "bullish" ? (
            <div className="flex items-center text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Bullish ({marketTrend.percentage.toFixed(1)}%)</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>Bearish ({marketTrend.percentage.toFixed(1)}%)</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Search cryptocurrencies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-[300px]"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:max-w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_OPTIONS.PRICE_ASC}>
              Price (Low to High)
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.PRICE_DESC}>
              Price (High to Low)
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.MCAP_ASC}>
              Market Cap (Low to High)
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.MCAP_DESC}>
              Market Cap (High to Low)
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.CHANGE_ASC}>
              24h Change (Low to High)
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.CHANGE_DESC}>
              24h Change (High to Low)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedCryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isFavorite={favorites.includes(crypto.id)}
              onFavoriteClick={() => handleFavoriteClick(crypto)}
              onClick={() => setSelectedCrypto(crypto)}
            />
          ))}
        </div>
      )}

      <CryptoModal
        crypto={selectedCrypto}
        history={history}
        isOpen={!!selectedCrypto}
        onClose={() => setSelectedCrypto(null)}
      />
    </div>
  );
};

export default Index;