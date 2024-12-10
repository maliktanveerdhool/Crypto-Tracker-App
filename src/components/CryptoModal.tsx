import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crypto, CryptoHistory } from "@/services/api";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CryptoModalProps {
  crypto: Crypto | null;
  history: CryptoHistory[];
  isOpen: boolean;
  onClose: () => void;
}

export const CryptoModal = ({
  crypto,
  history,
  isOpen,
  onClose,
}: CryptoModalProps) => {
  if (!crypto) return null;

  const chartData = history.map((item) => ({
    time: new Date(item.time).toLocaleDateString(),
    price: parseFloat(item.priceUsd),
  }));

  const isPositiveChange = parseFloat(crypto.changePercent24Hr) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {crypto.name}
            <span className="text-sm text-muted-foreground">
              {crypto.symbol}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(parseFloat(crypto.priceUsd))}
              </p>
              <p
                className={`${
                  isPositiveChange ? "text-success" : "text-destructive"
                } font-medium`}
              >
                {formatPercentage(parseFloat(crypto.changePercent24Hr))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="font-medium">
                {formatCurrency(parseFloat(crypto.marketCapUsd))}
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-muted-foreground">Volume (24h)</p>
              <p className="font-medium">
                {formatCurrency(parseFloat(crypto.volumeUsd24Hr))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supply</p>
              <p className="font-medium">
                {parseInt(crypto.supply).toLocaleString()} {crypto.symbol}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};