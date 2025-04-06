import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Award, LogIn, Coffee } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { FaRegMap } from "react-icons/fa";
import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from '@clerk/clerk-react';
import { ThemeToggle } from './ThemeToggle';
import { NotificationDropdown } from './NotificationDropdown';

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    // const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    // const demoMode = localStorage.getItem('isDemoUser') === 'true';
    
    // setIsLoggedIn(loggedIn);
    // setIsDemoUser(demoMode);
    
    // Get user data if logged in
    if (SignedIn) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isDemoUser');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsDemoUser(false);
    setUser(null);
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
      <Link to="/">
        <div className="flex items-center gap-2">
          <Award className="h-12 w-12 text-primary" />
          <span className="text-4xl font-bold">ReFrame</span>
        </div>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            <SignedIn>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/community">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Users className="mr-2 h-4 w-4" />
                  Community
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            </SignedIn>
            {/* {isLoggedIn && user ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.username}
                  {isDemoUser && (
                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                      <Coffee className="h-3 w-3 mr-1" />
                      Demo
                    </Badge>
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[200px] gap-3 p-4">
                    <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">
                        {user.username}
                        {isDemoUser && (
                          <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Demo
                          </Badge>
                        )}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/profile">
                        View Profile
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10" 
                      onClick={handleLogout}
                    >
                      Sign out
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Button asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </NavigationMenuItem>
            )} */}
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NotificationDropdown />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <SignedIn>
                <UserButton/>
              </SignedIn>
              <SignedOut>
                <Link to="/login">
                  <Button variant="outline" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
              </SignedOut>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/map">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <FaRegMap className="mr-2 h-4 w-4" />
                  Maps
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* <NavigationMenuItem> */}
              <ThemeToggleButton></ThemeToggleButton>
            {/* </NavigationMenuItem> */}
           </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;