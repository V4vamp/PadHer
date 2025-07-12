import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ImpactStats } from "@shared/schema";

const fetchImpactStats = async (): Promise<ImpactStats> => {
  const response = await fetch("http://localhost:5050/api/impact-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch impact stats");
  }
  return response.json();
};
interface CounterProps {
  end: number;
  duration?: number;
  className?: string;
}

function Counter({ end, duration = 2000, className = "" }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(end * easeOut));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span className={className}>
      {count.toLocaleString()}
    </span>
  );
}

export default function ImpactStats() {
  const { data: stats, isLoading, error } = useQuery<ImpactStats>({
  queryKey: ["impactStats"],
  queryFn: fetchImpactStats,
});

  if (isLoading || !stats) {
    return (
      <section className="py-16 bg-accent-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-accent-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-counter">
            <div className="text-4xl md:text-5xl font-bold text-primary-pink mb-2">
              <Counter end={stats.girlsHelped} />
            </div>
            <div className="text-text-light font-medium">Girls Helped</div>
          </div>
          
          <div className="animate-counter">
            <div className="text-4xl md:text-5xl font-bold text-secondary-purple mb-2">
              <Counter end={stats.padsDistributed} />
            </div>
            <div className="text-text-light font-medium">Pads Distributed</div>
          </div>
          
          <div className="animate-counter">
            <div className="text-4xl md:text-5xl font-bold text-primary-pink mb-2">
              <Counter end={stats.schoolsReached} />
            </div>
            <div className="text-text-light font-medium">Schools Reached</div>
          </div>
          
          <div className="animate-counter">
            <div className="text-4xl md:text-5xl font-bold text-secondary-purple mb-2">
              <Counter end={stats.volunteers} />
            </div>
            <div className="text-text-light font-medium">Active Volunteers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
