import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, Award, Smile, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { FaFireAlt } from "react-icons/fa";

const communityPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      level: 12
    },
    timestamp: "2 hours ago",
    content: "Just completed a 7-day streak of morning meditation! 🧘‍♀️ Feeling so much more centered and focused throughout my day.",
    likes: 24,
    comments: 8,
    achievements: ["7-Day Streak", "Morning Person"],
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=8",
      level: 8
    },
    timestamp: "Yesterday",
    content: "Finally reached my goal of drinking 8 glasses of water daily for a month straight! Who else is on the hydration journey? 💧",
    likes: 42,
    comments: 15,
    achievements: ["Hydration Master", "30-Day Streak"],
  },
  {
    id: 3,
    user: {
      name: "Alex Taylor",
      avatar: "https://i.pravatar.cc/150?img=4",
      level: 15
    },
    timestamp: "2 days ago",
    content: "Looking for accountability partners for my new reading habit! Aiming for 20 pages every day. Anyone want to join? 📚",
    likes: 18,
    comments: 27,
    achievements: ["Bookworm", "Early Adopter"],
  }
];

const Community = () => {

  const [posts, setPosts] = useState(communityPosts);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;

    const newEntry = {
      id: posts.length + 1,
      user: {
        name: "You",
        avatar: "https://i.pravatar.cc/150?img=3",
        level: 5,
      },
      timestamp: "Just now",
      content: newPost,
      likes: 0,
      comments: 0,
      achievements: [],
    };
    setPosts([newEntry, ...posts]);
    setNewPost(""); // Clear textarea
  };

  return (
    <div className="min-h-screen bg-habit-background">
      <div className="container py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Community Feed</h1>
          <p className="text-muted-foreground mt-2">Connect with others on their habit journeys</p>
        </header>
        
        <div className="bg-background text-text p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold">Community</h2>
          <p>Engage with the community here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          <section className="space-y-6">
            <Card className="bg-white dark:bg-card border border-border">
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea 
                     value={newPost}
                     onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      placeholder="Share your habit journey..."
                    />
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handlePost}>
                        Share Update
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {posts.map(post => (
              <Card key={post.id} className="bg-white dark:bg-card border border-border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold flex items-center">
                          {post.user.name}
                          <div className="ml-2 flex items-center text-sm text-muted-foreground">
                            <Award className="h-4 w-4 mr-1 text-primary" />
                            Level {post.user.level}
                          </div>
                        </div>
                        <CardDescription>{post.timestamp}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{post.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.achievements.map(achievement => (
                      <Badge key={achievement} variant="secondary" className="flex items-center gap-1">
                        <Smile className="h-3 w-3" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>
          
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Achievers</CardTitle>
                <CardDescription>This week's habit champions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Emma Smith", avatar: "https://i.pravatar.cc/150?img=5", level: 22, streak: 45 },
                  { name: "David Wong", avatar: "https://i.pravatar.cc/150?img=12", level: 19, streak: 32 },
                  { name: "Priya Patel", avatar: "https://i.pravatar.cc/150?img=9", level: 17, streak: 28 }
                ].map(achiever => (
                  <div key={achiever.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={achiever.avatar} />
                        <AvatarFallback>{achiever.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{achiever.name}</div>
                        <div className="text-sm text-muted-foreground">Level {achiever.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                    <FaFireAlt className="h-4 w-4 mr-1 text-red-500" />
                      <span>{achiever.streak} day streak</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Habits</CardTitle>
                <CardDescription>Trending in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "Daily Meditation", count: 248 },
                    { name: "Water Intake", count: 189 },
                    { name: "Reading", count: 154 },
                    { name: "Exercise", count: 126 },
                    { name: "Journaling", count: 98 }
                  ].map(habit => (
                    <div key={habit.name} className="flex justify-between items-center">
                      <span>{habit.name}</span>
                      <Badge variant="secondary">{habit.count} users</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Community;
