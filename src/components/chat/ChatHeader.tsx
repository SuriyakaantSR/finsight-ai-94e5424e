import { Link } from "react-router-dom";
import { TrendingUp, Menu, LogOut, User, Settings, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  onMenuClick: () => void;
  userName?: string;
}

const ChatHeader = ({ onMenuClick, userName }: ChatHeaderProps) => {
  const { signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden shrink-0 md:flex"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-none">
              Fin<span className="text-primary">Sight</span> AI
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
              AI-based Stock Market Analysis (Educational)
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Theme Toggle & User Menu */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              {resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className={theme === "light" ? "bg-accent" : ""}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className={theme === "dark" ? "bg-accent" : ""}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className={theme === "system" ? "bg-accent" : ""}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden max-w-24 truncate sm:inline-block text-sm">
                {userName || "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
