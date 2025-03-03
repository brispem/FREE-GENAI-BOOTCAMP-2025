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
}

export function ActivityCard({ title, description, icon, href, level }: ActivityCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="text-orange-500 mr-3">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{level}</span>
        <Link to={href}>
          <Button>
            Launch
          </Button>
        </Link>
      </div>
    </Card>
  );
} 