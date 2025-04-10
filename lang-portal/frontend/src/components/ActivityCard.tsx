import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  level: string;
  isExternal?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  icon,
  href,
  level,
  isExternal = false
}) => {
  const CardContent = () => (
    <div className="p-6 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow dark:border-gray-700">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-orange-500">{icon}</div>
        <h3 className="text-xl font-semibold dark:text-white">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4 dark:text-gray-300">{description}</p>
      <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
        {level}
      </div>
    </div>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <CardContent />
    </a>
  ) : (
    <Link to={href}>
      <CardContent />
    </Link>
  );
}; 