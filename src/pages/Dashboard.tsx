import { useEffect, useState } from "react";
import { CryptoCard } from "@/components/CryptoCard";
import { Crypto } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const Dashboard = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const { data: cryptos = [] } = useQuery({
    queryKey: ["cryptos"],
    queryFn: api.getAssets,
    refetchInterval: 30000,
  });

  const favoriteCryptos = cryptos.filter((crypto) =>
    favorites.includes(crypto.id)
  );

  const handleFavoriteClick = (crypto: Crypto) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== crypto.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Favorites</h1>
      {favoriteCryptos.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No favorites added yet. Add some from the home page!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isFavorite={true}
              onFavoriteClick={() => handleFavoriteClick(crypto)}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;