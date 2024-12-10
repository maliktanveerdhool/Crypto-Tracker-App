import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Crypto } from "@/services/api";

interface CryptoCardProps {
  crypto: Crypto;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onClick: () => void;
}

export const CryptoCard = ({
  crypto,
  isFavorite,
  onFavoriteClick,
  onClick,
}: CryptoCardProps) => {
  const isPositiveChange = parseFloat(crypto.changePercent24Hr) > 0;

  return (
    <Card
      className="p-4 hover:bg-secondary transition-colors cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{crypto.name}</h3>
            <span className="text-sm text-muted-foreground">{crypto.symbol}</span>
          </div>
          <p className="text-lg font-semibold mt-1">
            {formatCurrency(parseFloat(crypto.priceUsd))}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick();
          }}
          className="p-1 hover:bg-secondary rounded-full transition-colors"
        >
          <Star
            className={`h-5 w-5 ${
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            }`}
          />
        </button>
      </div>
      <div className="flex justify-between mt-4 text-sm">
        <span
          className={`${
            isPositiveChange ? "text-success" : "text-destructive"
          } font-medium`}
        >
          {formatPercentage(parseFloat(crypto.changePercent24Hr))}
        </span>
        <span className="text-muted-foreground">
          MCap: {formatCurrency(parseFloat(crypto.marketCapUsd))}
        </span>
      </div>
    </Card>
  );
};